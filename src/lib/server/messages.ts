import "server-only";
import { db } from "./db";

export type MessageKind = "contact" | "feedback";

export type Message = {
  id: string;
  kind: MessageKind;
  name: string;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string;
  rating: number | null;
  lang: "fr" | "en" | "ar" | null;
  read_at: string | null;
  created_at: string;
};

type NewMessage = Omit<Message, "id" | "read_at" | "created_at">;

const toLang = (l: string | null | undefined) => (l === "fr" || l === "en" || l === "ar" ? l : null);

/** Stores a message sent from the public site (contact form or feedback box). */
export async function saveMessage(m: NewMessage) {
  await db()`
    insert into messages (kind, name, email, phone, subject, message, rating, lang)
    values (${m.kind}, ${m.name}, ${m.email || null}, ${m.phone || null}, ${m.subject || null}, ${m.message}, ${m.rating}, ${toLang(m.lang)})`;
}

export async function listMessages(kind?: MessageKind): Promise<Message[]> {
  const rows = kind
    ? await db()`select * from messages where kind = ${kind} order by created_at desc limit 300`
    : await db()`select * from messages order by created_at desc limit 300`;
  return rows.map((r) => ({
    ...(r as Message),
    read_at: r.read_at ? new Date(r.read_at).toISOString() : null,
    created_at: new Date(r.created_at).toISOString(),
  }));
}

export async function unreadMessages(): Promise<number> {
  const [r] = await db()`select count(*)::int as n from messages where read_at is null`;
  return r.n as number;
}

export async function setMessageRead(id: string, read: boolean) {
  await db()`update messages set read_at = ${read ? new Date().toISOString() : null} where id = ${id}`;
}

export async function deleteMessage(id: string) {
  await db()`delete from messages where id = ${id}`;
}
