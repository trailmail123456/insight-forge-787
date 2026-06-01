import { useEffect, useState } from "react";

export function PageLoader() {
  const [gone, setGone] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setFading(true), 1100);
    const t2 = setTimeout(() => setGone(true), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  if (gone) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 99998,
        background: "var(--bg-void)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 24,
        opacity: fading ? 0 : 1,
        transition: "opacity .5s ease",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      <div
        className="animate-float"
        style={{
          width: 56, height: 56, borderRadius: 14,
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fff", fontFamily: "var(--font-sans)",
          fontWeight: 700, fontSize: 22,
          boxShadow: "0 0 40px rgba(124,58,237,.5)",
        }}
      >K</div>
      <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14, color: "var(--text-secondary)", letterSpacing: "0.05em" }}>
        Knowledge Labs
      </div>
      <div style={{ width: 180, height: 2, background: "rgba(255,255,255,.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: 0, borderRadius: 2,
          background: "linear-gradient(90deg,#7C3AED,#06B6D4)",
          animation: "loaderFill 1.2s ease-out forwards",
        }} />
      </div>
    </div>
  );
}
