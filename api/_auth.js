import crypto from "node:crypto";

const secret = () => process.env.JWT_SECRET || "";
const b64 = (s) => Buffer.from(s).toString("base64url");
const sign = (p) => crypto.createHmac("sha256", secret()).update(p).digest("base64url");

export function makeToken() {
  const p = b64(JSON.stringify({ exp: Date.now() + 7 * 24 * 3600 * 1000 }));
  return `${p}.${sign(p)}`;
}

export function isAdmin(req) {
  if (!secret()) return false;
  const t = (req.headers.authorization || "").replace("Bearer ", "");
  const [p, s] = t.split(".");
  if (!p || !s) return false;
  const good = sign(p);
  if (s.length !== good.length || !crypto.timingSafeEqual(Buffer.from(s), Buffer.from(good))) return false;
  try { return JSON.parse(Buffer.from(p, "base64url").toString()).exp > Date.now(); } catch { return false; }
}

export function samePassword(input) {
  const a = Buffer.from(String(input || ""));
  const b = Buffer.from(process.env.ADMIN_PASSWORD || "");
  return b.length > 0 && a.length === b.length && crypto.timingSafeEqual(a, b);
}
