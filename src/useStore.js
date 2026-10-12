import { useEffect, useState } from "react";
import { CONFIG } from "./config";

export const DEFAULTS = { ...CONFIG, offer: { enabled: false, text: "", percent: 0 } };

// Loads store data from our own API. If API/database is not set up, defaults from config.js are used.
export function useStore() {
  const [cfg, setCfg] = useState(DEFAULTS);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const ctl = new AbortController();
    const t = setTimeout(() => ctl.abort(), 4000);
    fetch("/api/store", { signal: ctl.signal })
      .then((r) => (r.ok ? r.json() : {}))
      .then((d) => { if (d && d.productName) setCfg({ ...DEFAULTS, ...d, image: d.image || DEFAULTS.image }); })
      .catch(() => {})
      .finally(() => { clearTimeout(t); setReady(true); });
    return () => { clearTimeout(t); ctl.abort(); };
  }, []);
  return { cfg, ready };
}