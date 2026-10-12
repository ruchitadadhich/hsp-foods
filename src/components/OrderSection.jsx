import { useState, useMemo } from "react";

const inr = (n) => "\u20B9" + n.toLocaleString("en-IN");

export default function OrderSection({ cfg }) {
  const [v, setV] = useState(0);
  const [q, setQ] = useState(1);
  const [form, setForm] = useState({ name: "", phone: "", addr: "" });

  const item = cfg.variants[Math.min(v, cfg.variants.length - 1)];
  const pct = cfg.offer?.enabled ? Number(cfg.offer.percent) || 0 : 0;
  const subtotal = item.price * q;
  const total = Math.round(subtotal * (1 - pct / 100));
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const waUrl = useMemo(() => {
    let m = `Hi! I want to order from ${cfg.brand}.\n\nProduct: ${cfg.productName}\nPack: ${item.label}\nQuantity: ${q}`;
    if (pct) m += `\nOffer: ${cfg.offer.text || pct + "% off"} (${pct}% off)`;
    m += `\nTotal: ${inr(total)}`;
    const { name, phone, addr } = form;
    if (name || phone || addr) m += `\n\nName: ${name.trim()}\nPhone: ${phone.trim()}\nAddress: ${addr.trim()}`;
    m += "\n\nPlease confirm shipping charges, payment and delivery details.";
    return `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent(m)}`;
  }, [cfg, item, q, total, pct, form]);

  const ship = cfg.freeShippingAbove
    ? total >= cfg.freeShippingAbove
      ? "Free delivery on this order."
      : `Add ${inr(cfg.freeShippingAbove - total)} more for free delivery.`
    : cfg.shippingNote || "";

  return (
    <section id="order">
      <h2>Order your makhana</h2>
      <p style={{ marginTop: 0 }}>{cfg.productName}. {cfg.tagline}.</p>
      <div className="order">
        <div className="panel">
          <label>Pack size</label>
          <div className="sizes">
            {cfg.variants.map((it, i) => (
              <button key={i} aria-pressed={i === v} onClick={() => setV(i)}>
                {it.label}
                <b>{inr(it.price)}</b>
                {Number(it.mrp) > Number(it.price) && <s className="mrp">{inr(Number(it.mrp))}</s>}
              </button>
            ))}
          </div>

          <label>Quantity</label>
          <div className="qty">
            <button aria-label="Decrease quantity" onClick={() => setQ(Math.max(1, q - 1))}>&minus;</button>
            <output aria-live="polite">{q}</output>
            <button aria-label="Increase quantity" onClick={() => setQ(Math.min(20, q + 1))}>+</button>
          </div>

          <div className="total">
            <span>{q} &times; {item.label} at {inr(item.price)}{pct ? `, ${pct}% off` : ""}</span>
            <strong>{pct ? <s className="mrp">{inr(subtotal)}</s> : null} {inr(total)}</strong>
          </div>
          <p className="note">{ship}</p>
        </div>

        <div className="panel">
          <label htmlFor="name">Your name</label>
          <input id="name" type="text" placeholder="Full name" autoComplete="name" value={form.name} onChange={set("name")} />
          <label htmlFor="phone">Phone number</label>
          <input id="phone" type="tel" placeholder="10-digit mobile number" autoComplete="tel" value={form.phone} onChange={set("phone")} />
          <label htmlFor="addr">Delivery address</label>
          <textarea id="addr" rows="3" placeholder="House no, area, city, pincode" value={form.addr} onChange={set("addr")} />
          <a className="btn" href={waUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", textAlign: "center" }}>
            Order on WhatsApp
          </a>
          <p className="note">WhatsApp opens with your order filled in. Press Send and we will confirm payment and delivery with you.</p>
        </div>
      </div>
    </section>
  );
}
