import { useEffect, useState } from "react";
import { useStore } from "./useStore";
import Loading from "./components/Loading";

const KEY = "hsp_admin_token";
const getTok = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
const setTok = (t) => { try { t ? localStorage.setItem(KEY, t) : localStorage.removeItem(KEY); } catch {} };

// Resize photo to ~900px JPEG so it fits in the database (no paid storage needed)
function compress(file) {
  return new Promise((res, rej) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(1, 900 / Math.max(img.width, img.height));
      const c = document.createElement("canvas");
      c.width = img.width * s; c.height = img.height * s;
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height);
      res(c.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = rej;
    img.src = URL.createObjectURL(file);
  });
}

function Login({ onIn }) {
  const [p, setP] = useState(""); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const go = async (ev) => {
    ev.preventDefault(); setErr(""); setBusy(true);
    try {
      const r = await fetch("/api/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: p }) });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { setTok(d.token); onIn(d.token); }
      else if (d.error === "setup") setErr("Server is not set up yet. Add ADMIN_PASSWORD and JWT_SECRET in Vercel, then redeploy.");
      else setErr("Wrong password.");
    } catch { setErr("Could not reach the server. Try again."); }
    setBusy(false);
  };
  return (
    <div className="login-screen">
      <form className="panel login-panel" onSubmit={go}>
        <div className="login-brand" aria-hidden="true">HSP <span>FOODS</span></div>
        <p className="login-kicker">STORE MANAGEMENT</p>
        <h1>Welcome back</h1>
        <p className="login-copy">Sign in to manage your products and orders.</p>
        <label htmlFor="p">Admin password</label>
        <input className="login-input" id="p" type="password" value={p} onChange={(x) => setP(x.target.value)} autoComplete="current-password" required />
        {err && <p className="login-error" role="alert">{err}</p>}
        <button className="btn login-submit" type="submit" disabled={busy}>{busy ? <><span className="button-spinner" aria-hidden="true" /> Signing in...</> : "Sign in"}</button>
      </form>
    </div>
  );
}

function Editor({ initial, token, onOut }) {
  const [f, setF] = useState(initial);
  const [msg, setMsg] = useState("");
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const upOffer = (k, v) => setF({ ...f, offer: { ...f.offer, [k]: v } });
  const upVar = (i, k, v) => setF({ ...f, variants: f.variants.map((x, j) => (j === i ? { ...x, [k]: v } : x)) });

  const save = async () => {
    setMsg("Saving...");
    try {
      const data = {
        ...f,
        freeShippingAbove: Number(f.freeShippingAbove) || 0,
        variants: f.variants.map((v) => ({ label: v.label, price: Number(v.price) || 0, mrp: Number(v.mrp) || 0 })),
        offer: { enabled: !!f.offer.enabled, text: f.offer.text || "", percent: Number(f.offer.percent) || 0 },
      };
      const r = await fetch("/api/store", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify(data) });
      if (r.status === 401) { setTok(null); onOut(); return; }
      const d = await r.json().catch(() => ({}));
      if (!r.ok) { setMsg(d.error === "setup" ? "Database is not connected yet (MONGODB_URI)." : d.error || "Could not save."); return; }
      setMsg("Saved. The website is updated.");
    } catch { setMsg("Could not save. Check your internet and try again."); }
  };

  return (
    <div className="wrap admin">
      <header>
        <div className="logo">HSP<small>ADMIN</small></div>
        <div style={{ display: "flex", gap: 10 }}>
          <a className="hdr-btn" href="#/">View website</a>
          <button className="hdr-btn" style={{ background: "none", cursor: "pointer" }} onClick={() => { setTok(null); onOut(); }}>Log out</button>
        </div>
      </header>

      <div className="panel adm">
        <h3>Product</h3>
        <label>Product name</label><input type="text" value={f.productName} onChange={up("productName")} />
        <label>Short line under the name</label><input type="text" value={f.tagline} onChange={up("tagline")} />
        <label>Product photo</label>
        {f.image && <img src={f.image} alt="" style={{ maxWidth: 200, borderRadius: 12, display: "block", marginBottom: 8 }} />}
        <input type="file" accept="image/*" onChange={async (e) => e.target.files[0] && setF({ ...f, image: await compress(e.target.files[0]) })} />
        {f.image && <button className="link" onClick={() => setF({ ...f, image: "" })}>Remove photo</button>}
      </div>

      <div className="panel adm">
        <h3>Pack sizes and prices</h3>
        {f.variants.map((v, i) => (
          <div className="vrow" key={i}>
            <div><label>Pack</label><input type="text" value={v.label} onChange={(e) => upVar(i, "label", e.target.value)} /></div>
            <div><label>Price (&#8377;)</label><input type="text" inputMode="numeric" value={v.price} onChange={(e) => upVar(i, "price", e.target.value)} /></div>
            <div><label>Old price (optional)</label><input type="text" inputMode="numeric" value={v.mrp || ""} onChange={(e) => upVar(i, "mrp", e.target.value)} /></div>
            <button className="link" onClick={() => f.variants.length > 1 && setF({ ...f, variants: f.variants.filter((_, j) => j !== i) })}>Remove</button>
          </div>
        ))}
        <button className="link" onClick={() => setF({ ...f, variants: [...f.variants, { label: "", price: 0, mrp: 0 }] })}>+ Add pack size</button>
        <label style={{ marginTop: 14, display: "block" }}>Shipping note (shown under the total)</label>
        <input type="text" value={f.shippingNote || ""} onChange={up("shippingNote")} />
        <label>Free delivery above (&#8377;, 0 = no free delivery)</label>
        <input type="text" inputMode="numeric" value={f.freeShippingAbove} onChange={up("freeShippingAbove")} />
      </div>

      <div className="panel adm">
        <h3>Offer</h3>
        <label className="chk"><input type="checkbox" checked={!!f.offer.enabled} onChange={(e) => upOffer("enabled", e.target.checked)} /> Offer is on</label>
        <label>Banner text (shown at top of website)</label>
        <input type="text" placeholder="Festival offer: 10% off on all packs" value={f.offer.text} onChange={(e) => upOffer("text", e.target.value)} />
        <label>Discount (%)</label>
        <input type="text" inputMode="numeric" value={f.offer.percent} onChange={(e) => upOffer("percent", e.target.value)} />
      </div>

      <div className="panel adm">
        <h3>Contact</h3>
        <label>WhatsApp number (with 91, no + or spaces)</label><input type="text" value={f.whatsapp} onChange={up("whatsapp")} />
        <label>Phone</label><input type="text" value={f.phone} onChange={up("phone")} />
        <label>Email</label><input type="text" value={f.email} onChange={up("email")} />
        <label>Location</label><input type="text" value={f.location} onChange={up("location")} />
      </div>

      <div style={{ position: "sticky", bottom: 12, display: "flex", gap: 14, alignItems: "center", paddingBottom: 20 }}>
        <button className="btn" onClick={save}>Save changes</button>
        <span role="status">{msg}</span>
      </div>
    </div>
  );
}

export default function Admin() {
  const [token, setToken] = useState(getTok());
  const { cfg, ready } = useStore();
  if (!ready) return <Loading />;
  return token ? <Editor initial={cfg} token={token} onOut={() => setToken(null)} /> : <Login onIn={setToken} />;
}