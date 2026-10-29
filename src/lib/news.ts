/** News vocabulary, automatic labels and the safe article renderer (shared by the site and the back-office). */

export const NEWS_CATEGORIES = ["announcement", "scholarship", "deadline", "results", "event", "guide"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

/** Labels an editor can set by hand; NEW and DEADLINE ALERT are also added automatically. */
export const NEWS_LABELS = ["new", "important", "applications-open", "deadline-alert", "announcement", "results-released"] as const;
export type NewsLabel = (typeof NEWS_LABELS)[number];

export type NewsArticle = {
  id: string;
  slug: string;
  content_lang: "fr" | "en" | "ar";
  title: string;
  cover_url: string | null;
  summary: string | null;
  body: string;
  category: NewsCategory;
  labels: NewsLabel[];
  country_code: string | null;
  university: string | null;
  author: string | null;
  source_url: string | null;
  scholarship_id: string | null;
  scholarship_slug: string | null;
  scholarship_title: string | null;
  scholarship_deadline: string | null;
  seo_title: string | null;
  seo_description: string | null;
  status: "draft" | "published";
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

const DAY = 24 * 60 * 60 * 1000;

/**
 * Labels shown on an article: the editor's own, plus NEW (published in the last 7 days),
 * DEADLINE ALERT (linked opportunity closes within 7 days) and the category's natural label.
 */
export function newsLabels(a: Pick<NewsArticle, "labels" | "published_at" | "category" | "scholarship_deadline">, now = new Date()): NewsLabel[] {
  const out = new Set<NewsLabel>(a.labels);
  if (a.published_at && now.getTime() - new Date(a.published_at).getTime() < 7 * DAY) out.add("new");
  if (a.scholarship_deadline) {
    const left = new Date(a.scholarship_deadline).getTime() - now.getTime();
    if (left >= 0 && left <= 7 * DAY) out.add("deadline-alert");
  }
  if (a.category === "results") out.add("results-released");
  if (a.category === "announcement") out.add("announcement");
  const order = NEWS_LABELS;
  return [...out].sort((x, y) => order.indexOf(x) - order.indexOf(y));
}

// ── Article body: a small, safe subset of Markdown ─────────────────────────

const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inline(s: string) {
  return escape(s)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, "$1<em>$2</em>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

/**
 * Renders the editor's text to HTML. Everything is escaped first, so the only markup
 * that can come out is what this function writes: headings (##, ###), lists (- or 1.),
 * quotes (>), **bold**, *italic*, [links](https://…) and images ![alt](https://…).
 */
export function renderArticle(src: string) {
  const out: string[] = [];
  let list: "ul" | "ol" | null = null;
  let para: string[] = [];
  const flushPara = () => {
    if (para.length) out.push(`<p>${para.map(inline).join("<br />")}</p>`);
    para = [];
  };
  const closeList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const raw of src.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trimEnd();
    const img = line.match(/^!\[([^\]]*)\]\((https:\/\/[^\s)]+)\)$/);
    const h = line.match(/^(#{2,3})\s+(.+)$/);
    const ul = line.match(/^\s*[-*]\s+(.+)$/);
    const ol = line.match(/^\s*\d+[.)]\s+(.+)$/);
    const quote = line.match(/^>\s?(.*)$/);
    if (!line.trim()) {
      flushPara();
      closeList();
    } else if (img) {
      flushPara();
      closeList();
      out.push(`<figure><img src="${escape(img[2])}" alt="${escape(img[1])}" loading="lazy" /></figure>`);
    } else if (h) {
      flushPara();
      closeList();
      const tag = h[1].length === 2 ? "h2" : "h3";
      out.push(`<${tag}>${inline(h[2])}</${tag}>`);
    } else if (ul || ol) {
      flushPara();
      const kind = ul ? "ul" : "ol";
      if (list !== kind) {
        closeList();
        out.push(`<${kind}>`);
        list = kind;
      }
      out.push(`<li>${inline((ul ?? ol)![1])}</li>`);
    } else if (quote) {
      flushPara();
      closeList();
      out.push(`<blockquote>${inline(quote[1])}</blockquote>`);
    } else {
      closeList();
      para.push(line);
    }
  }
  flushPara();
  closeList();
  return out.join("\n");
}

/** Plain-text excerpt for cards and meta descriptions. */
export function excerpt(src: string, max = 180) {
  const plain = src
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_`-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > max ? `${plain.slice(0, max - 1).trimEnd()}…` : plain;
}
