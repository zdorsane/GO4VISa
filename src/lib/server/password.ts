import "server-only";
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

type Params = { N: number; r: number; p: number };

function derive(password: string, salt: Buffer, { N, r, p }: Params) {
  return new Promise<Buffer>((resolve, reject) =>
    scrypt(password, salt, 64, { N, r, p, maxmem: 64 * 1024 * 1024 }, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

/** Format: scrypt$N$r$p$salt$hash (kept in sync with scripts/create-admin.mjs). */
export async function hashPassword(password: string) {
  const params = { N: 16384, r: 8, p: 1 };
  const salt = randomBytes(16);
  const hash = await derive(password, salt, params);
  return `scrypt$${params.N}$${params.r}$${params.p}$${salt.toString("base64")}$${hash.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [algo, N, r, p, salt, hash] = stored.split("$");
  if (algo !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64");
  const actual = await derive(password, Buffer.from(salt, "base64"), { N: Number(N), r: Number(r), p: Number(p) });
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

/** A hash of a random password, compared against when the e-mail is unknown (same timing). */
export const DUMMY_HASH =
  "scrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==";
