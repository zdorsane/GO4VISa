import "server-only";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

let client: NeonQueryFunction<false, false> | null = null;

/** True when a database is configured (DATABASE_URL from the Vercel ↔ Neon integration). */
export function hasDatabase() {
  return !!process.env.DATABASE_URL;
}

/**
 * Tagged-template SQL over Neon's HTTP driver. Values are always sent as bound
 * parameters, never concatenated into the query text.
 */
export function db() {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("DATABASE_URL is not configured");
    client = neon(url);
  }
  return client;
}
