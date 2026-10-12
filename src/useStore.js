import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db, configured } from "./firebase";
import { CONFIG } from "./config";

export const DEFAULTS = { ...CONFIG, offer: { enabled: false, text: "", percent: 0 } };

// Live store data. Admin changes show up on the website instantly.
export function useStore() {
  const [cfg, setCfg] = useState(DEFAULTS);
  const [ready, setReady] = useState(!configured);
  useEffect(() => {
    if (!configured) return;
    const t = setTimeout(() => setReady(true), 3000);
    const off = onSnapshot(
      doc(db, "store", "main"),
      (s) => {
        if (s.exists()) setCfg({ ...DEFAULTS, ...s.data() });
        setReady(true);
      },
      () => setReady(true)
    );
    return () => { clearTimeout(t); off(); };
  }, []);
  return { cfg, ready };
}
