import { makeToken, samePassword } from "./_auth.js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  if (!process.env.ADMIN_PASSWORD || !process.env.JWT_SECRET) return res.status(500).json({ error: "setup" });
  if (!samePassword(req.body?.password)) {
    await new Promise((r) => setTimeout(r, 700)); // slows down password guessing
    return res.status(401).json({ error: "wrong" });
  }
  res.json({ token: makeToken() });
}
