import { lazy, Suspense, useEffect, useState } from "react";
import { useStore } from "./useStore";
import Bowl from "./components/Bowl";
import OrderSection from "./components/OrderSection";
import Loading from "./components/Loading";

const Admin = lazy(() => import("./Admin.jsx"));

const FAQ = [
  ["How do I pay?", "After you send the WhatsApp message, we share payment options (UPI or bank transfer) and confirm your order."],
  ["Where do you deliver?", "We deliver all over India from Chandigarh."],
  ["Is shipping included in the price?", "No. Shipping is charged extra. We confirm the exact amount on WhatsApp once we have your address."],
  ["How long does a pack stay fresh?", "Keep it sealed in a cool, dry place and finish within a few weeks of opening for best crunch."],
];

export default function App() {
  const [hash, setHash] = useState(location.hash);
  useEffect(() => {
    const f = () => setHash(location.hash);
    addEventListener("hashchange", f);
    return () => removeEventListener("hashchange", f);
  }, []);
  const { cfg, ready } = useStore();

  if (hash.startsWith("#/admin"))
    return <Suspense fallback={<Loading />}><Admin /></Suspense>;
  if (!ready) return <Loading />;

  const ask = `https://wa.me/${cfg.whatsapp}?text=${encodeURIComponent("Hi! I have a question about your makhana.")}`;
  return (
    <>
      {cfg.offer?.enabled && cfg.offer.text && <div className="offer-bar">{cfg.offer.text}</div>}
      <div className="wrap">
        <header>
          <img className="brand-logo header-logo" src="/hsp-logo-green.png" alt="HSP Makhana" />
          <a className="hdr-btn" href="#order">Order now</a>
        </header>

        <div className="hero">
          <div>
            <h1>Goodness of nature, delivered to you</h1>
            <p>Crunchy, light and freshly roasted makhana (fox nuts) from {cfg.brand}. A healthy snack you can feel good about, made in {cfg.location}.</p>
            <div className="badges"><span>100% natural</span><span>Premium quality</span><span>Delivery all over India</span></div>
            <a className="btn" href="#order">Choose your pack</a>
          </div>
          <Bowl cfg={cfg} />
        </div>

        <OrderSection cfg={cfg} />

        <section>
          <h2>Why makhana</h2>
          <ul className="benefits">
            <li>Light and crunchy, with no deep frying needed.</li>
            <li>Naturally low in fat and a good source of plant protein.</li>
            <li>A snack for fasting days, evening cravings and kids' tiffins.</li>
          </ul>
          <div className="why">
            <div><h3>Fresh roasted</h3><p>Small batches, packed soon after roasting so every bite stays crisp.</p></div>
            <div><h3>Carefully sorted</h3><p>Only large, even, white pops go into our packs.</p></div>
            <div><h3>Sealed packaging</h3><p>Airtight pouches that keep the crunch till you open them.</p></div>
          </div>
        </section>

        <section>
          <h2>Questions</h2>
          {FAQ.map(([q, a]) => (<details key={q}><summary>{q}</summary><p>{a}</p></details>))}
        </section>
      </div>

      <footer>
        <div className="wrap">
          <img className="brand-logo footer-logo" src="/hsp-logo-green.png" alt={cfg.brand} />
          <p>Goodness of nature, delivered to you.</p>
          <div className="contact">
            <span>{cfg.location}</span>
            <a href={`tel:+91${cfg.phone}`}>{cfg.phone}</a>
            <a href={`mailto:${cfg.email}`}>{cfg.email}</a>
          </div>
        </div>
      </footer>
      <a className="float" href={ask} target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </>
  );
}
