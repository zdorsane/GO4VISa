import "server-only";
import * as z from "zod";

/** Free tier of Google's Gemini API, tried in order: the free models are often briefly overloaded (503). */
const GEMINI_MODELS = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-flash-lite-latest"];

/** Why a Gemini call failed, in the codes the back-office shows. */
export class GeminiError extends Error {}

type Part = { text: string } | { inlineData: { mimeType: string; data: string } };

/**
 * Sends one request to Gemini and returns its JSON answer checked against `schema`.
 * Throws GeminiError: no-api-key, quota, busy, bad-api-key, refused, too-long, unreadable or failed.
 */
export async function askGemini<T>(system: string, parts: Part[], schema: z.ZodType<T>): Promise<T> {
  if (!process.env.GEMINI_API_KEY) throw new GeminiError("no-api-key");
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: system }] },
    contents: [{ role: "user", parts }],
    generationConfig: { responseMimeType: "application/json", responseJsonSchema: z.toJSONSchema(schema), temperature: 0 },
  });

  let res: Response | null = null;
  for (const model of GEMINI_MODELS) {
    try {
      res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY },
        body,
        // a stuck model would otherwise hold the request for minutes
        signal: AbortSignal.timeout(120_000),
      });
    } catch {
      res = null;
      continue;
    }
    // overloaded, over quota or retired for this key: try the next model
    if (![404, 429, 500, 503].includes(res.status)) break;
  }
  if (!res) throw new GeminiError("busy");
  if (res.status === 429) throw new GeminiError("quota");
  if (res.status === 503 || res.status === 500) throw new GeminiError("busy");
  if (!res.ok) {
    console.error("Gemini error", res.status, (await res.text()).slice(0, 500));
    throw new GeminiError(res.status === 400 || res.status === 403 ? "bad-api-key" : "failed");
  }

  const answer = (await res.json()) as {
    candidates?: { finishReason?: string; content?: { parts?: { text?: string }[] } }[];
    promptFeedback?: { blockReason?: string };
  };
  const candidate = answer.candidates?.[0];
  if (answer.promptFeedback?.blockReason || candidate?.finishReason === "SAFETY") throw new GeminiError("refused");
  if (candidate?.finishReason === "MAX_TOKENS") throw new GeminiError("too-long");
  let json: unknown;
  try {
    json = JSON.parse(candidate?.content?.parts?.map((p) => p.text ?? "").join("") ?? "");
  } catch {
    throw new GeminiError("unreadable");
  }
  const parsed = schema.safeParse(json);
  if (!parsed.success) throw new GeminiError("unreadable");
  return parsed.data;
}
