// Creates (or resets the password of) an admin account. Usage: npm run admin:create
// The password is typed in the terminal and only its scrypt hash is stored.
import { existsSync } from "node:fs";
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import { neon } from "@neondatabase/serverless";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing. Run `npx vercel env pull .env.local` first.");
  process.exit(1);
}

// keep in sync with src/lib/server/password.ts
function hashPassword(password) {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString("base64")}$${hash.toString("base64")}`;
}

const rl = createInterface({ input: process.stdin, output: process.stdout });
const email = (await rl.question("Admin e-mail: ")).trim().toLowerCase();
const name = (await rl.question("Display name: ")).trim() || email;
const role = ((await rl.question("Role [owner/admin/editor] (owner): ")).trim() || "owner").toLowerCase();
const password = await rl.question("Password (min 12 characters): ");
rl.close();

if (!email.includes("@")) throw new Error("Invalid e-mail");
if (!["owner", "admin", "editor"].includes(role)) throw new Error("Invalid role");
if (password.length < 12) throw new Error("Password must be at least 12 characters");

const sql = neon(process.env.DATABASE_URL);
await sql`
  insert into admin_users (email, name, role, password_hash)
  values (${email}, ${name}, ${role}, ${hashPassword(password)})
  on conflict (email) do update set name = excluded.name, role = excluded.role,
    password_hash = excluded.password_hash, active = true`;
await sql`delete from admin_sessions where user_id = (select id from admin_users where email = ${email})`;
console.log(`Admin ${email} (${role}) is ready. Sign in at /admin/login`);
