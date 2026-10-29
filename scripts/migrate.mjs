// Applies db/migrations/*.sql in order, once each. Usage: npm run db:migrate
import { readdir, readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { Pool } from "@neondatabase/serverless";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is missing. Run `npx vercel env pull .env.local` first.");
  process.exit(1);
}

const pool = new Pool({ connectionString: url });
const dir = path.join(process.cwd(), "db", "migrations");

try {
  await pool.query(`create table if not exists schema_migrations (name text primary key, applied_at timestamptz not null default now())`);
  const done = new Set((await pool.query(`select name from schema_migrations`)).rows.map((r) => r.name));
  const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
  let applied = 0;
  for (const file of files) {
    if (done.has(file)) continue;
    const client = await pool.connect();
    try {
      await client.query("begin");
      await client.query(await readFile(path.join(dir, file), "utf8"));
      await client.query("insert into schema_migrations(name) values ($1)", [file]);
      await client.query("commit");
      console.log(`applied ${file}`);
      applied++;
    } catch (err) {
      await client.query("rollback");
      console.error(`failed ${file}: ${err.message}`);
      process.exitCode = 1;
      break;
    } finally {
      client.release();
    }
  }
  if (!applied && !process.exitCode) console.log("database is up to date");
} finally {
  await pool.end();
}
