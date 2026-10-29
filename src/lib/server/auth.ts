import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE } from "@/lib/admin-cookie";
import { db } from "./db";
import { DUMMY_HASH, verifyPassword } from "./password";

export type Role = "owner" | "admin" | "editor";
export type Admin = { id: string; email: string; name: string; role: Role };

const SESSION_DAYS = 7;
const MAX_FAILS_PER_EMAIL = 5;
const MAX_FAILS_PER_IP = 20;
const FAIL_WINDOW = "15 minutes";

/** What each role may do. Editors prepare content; only admins publish, archive or delete. */
const PERMISSIONS = {
  edit: ["owner", "admin", "editor"],
  publish: ["owner", "admin"],
  delete: ["owner", "admin"],
  media: ["owner", "admin", "editor"],
} as const satisfies Record<string, readonly Role[]>;
export type Permission = keyof typeof PERMISSIONS;

export function can(role: Role, permission: Permission) {
  return (PERMISSIONS[permission] as readonly Role[]).includes(role);
}

const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

async function clientIp() {
  const h = await headers();
  return h.get("x-real-ip") ?? h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
}

export type LoginResult = { ok: true } | { ok: false; error: "invalid" | "throttled" };

/** Checks the credentials, throttles repeated failures and opens a session cookie. */
export async function login(emailInput: string, password: string): Promise<LoginResult> {
  const sql = db();
  const email = emailInput.trim().toLowerCase();
  const ip = await clientIp();

  const [fails] = await sql`
    select
      count(*) filter (where email = ${email})::int as by_email,
      count(*) filter (where ip = ${ip})::int as by_ip
    from login_attempts where created_at > now() - ${FAIL_WINDOW}::interval`;
  if (fails.by_email >= MAX_FAILS_PER_EMAIL || (ip && fails.by_ip >= MAX_FAILS_PER_IP)) {
    return { ok: false, error: "throttled" };
  }

  const [user] = await sql`select id, password_hash, active from admin_users where email = ${email}`;
  // always run one hash comparison so unknown e-mails take as long as wrong passwords
  const valid = await verifyPassword(password, user?.password_hash ?? DUMMY_HASH);
  if (!user || !user.active || !valid) {
    await sql`insert into login_attempts (email, ip) values (${email}, ${ip})`;
    return { ok: false, error: "invalid" };
  }

  const token = randomBytes(32).toString("base64url");
  const ua = (await headers()).get("user-agent")?.slice(0, 300) ?? null;
  await sql`delete from admin_sessions where user_id = ${user.id} and expires_at < now()`;
  await sql`
    insert into admin_sessions (token_hash, user_id, expires_at, user_agent)
    values (${sha256(token)}, ${user.id}, now() + ${`${SESSION_DAYS} days`}::interval, ${ua})`;
  await sql`update admin_users set last_login_at = now() where id = ${user.id}`;
  await sql`delete from login_attempts where email = ${email}`;
  await logActivity(user.id, "login", "session", null);

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
  return { ok: true };
}

export async function logout() {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (token) await db()`delete from admin_sessions where token_hash = ${sha256(token)}`;
  jar.delete(ADMIN_COOKIE);
}

/** The signed-in admin, or null. Reads the request cookie, so callers sit behind Suspense. */
export async function getAdmin(): Promise<Admin | null> {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  const [row] = await db()`
    select u.id, u.email, u.name, u.role
    from admin_sessions s join admin_users u on u.id = s.user_id
    where s.token_hash = ${sha256(token)} and s.expires_at > now() and u.active`;
  return (row as Admin | undefined) ?? null;
}

/** Guard for admin pages and server actions: redirects to the login page, or throws on a missing permission. */
export async function requireAdmin(permission: Permission = "edit"): Promise<Admin> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  if (!can(admin.role, permission)) throw new Error("FORBIDDEN");
  return admin;
}

export async function logActivity(userId: string | null, action: string, entity: string, entityId: string | null, detail?: object) {
  await db()`
    insert into activity_logs (user_id, action, entity, entity_id, detail)
    values (${userId}, ${action}, ${entity}, ${entityId}, ${detail ? JSON.stringify(detail) : null}::jsonb)`;
}
