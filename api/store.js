import { getCol } from "./_db.js";
import { isAdmin } from "./_auth.js";

const str = (v, n = 200) => String(v ?? "").slice(0, n);
const num = (v) => Math.max(0, Number(v) || 0);

function clean(b) {
  const image = str(b.image, 1_500_000);
  return {
    _id: "main",
    brand: str(b.brand, 60),
    productName: str(b.productName, 80),
    tagline: str(b.tagline, 120),
    image: /^(data:image\/|https:\/\/|\/)/.test(image) ? image : "",
    whatsapp: str(b.whatsapp, 20).replace(/\D/g, ""),
    phone: str(b.phone, 20),
    email: str(b.email, 80),
    location: str(b.location, 80),
    shippingNote: str(b.shippingNote, 160),
    freeShippingAbove: num(b.freeShippingAbove),
    variants: (Array.isArray(b.variants) ? b.variants : []).slice(0, 10)
      .map((v) => ({ label: str(v.label, 30), price: num(v.price), mrp: num(v.mrp) }))
      .filter((v) => v.label && v.price > 0),
    offer: {
      enabled: !!b.offer?.enabled,
      text: str(b.offer?.text, 160),
      percent: Math.min(90, num(b.offer?.percent)),
    },
  };
}

export default async function handler(req, res) {
  try {
    const col = await getCol();
    if (req.method === "GET") {
      const doc = await col.findOne({ _id: "main" });
      res.setHeader("Cache-Control", "no-store");
      return res.json(doc || {});
    }
    if (req.method === "PUT") {
      if (!isAdmin(req)) return res.status(401).json({ error: "auth" });
      const data = clean(req.body || {});
      if (!data.variants.length) return res.status(400).json({ error: "Add at least one pack with a price." });
      await col.replaceOne({ _id: "main" }, data, { upsert: true });
      return res.json({ ok: true });
    }
    res.status(405).end();
  } catch (e) {
    console.error("store api error:", e);
    res.status(500).json({ error: e.message === "setup" ? "setup" : "server" });
  }
}