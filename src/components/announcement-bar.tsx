import { useEffect, useState } from "react";
import { X } from "lucide-react";

export function AnnouncementBar() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    try {
      if (localStorage.getItem("kl:ann-dismissed") === "1") setShow(false);
    } catch {}
  }, []);

  if (!show) return null;

  const dismiss = () => {
    setShow(false);
    try { localStorage.setItem("kl:ann-dismissed", "1"); } catch {}
  };

  return (
    <div
      style={{
        width: "100%", height: 38, display: "flex",
        alignItems: "center", justifyContent: "center", gap: 10,
        background: "linear-gradient(90deg, rgba(124,58,237,.14), rgba(6,182,212,.09), rgba(124,58,237,.14))",
        backgroundSize: "200% 100%",
        animation: "shimmer 4s linear infinite",
        borderBottom: "1px solid rgba(124,58,237,.2)",
        fontFamily: "var(--font-sans)",
        fontWeight: 500, fontSize: 12,
        color: "var(--text-accent)",
        position: "relative",
      }}
    >
      <span style={{
        width: 7, height: 7, borderRadius: "50%",
        background: "var(--emerald, #10B981)",
        boxShadow: "0 0 8px #10B981",
        display: "inline-block",
      }} />
      <span>✦ Open Access Research — All papers and essays freely available</span>
      <button
        aria-label="Dismiss"
        onClick={dismiss}
        style={{
          position: "absolute", right: 16, background: "none", border: "none",
          color: "var(--text-muted)", cursor: "pointer", lineHeight: 1, padding: 0,
          display: "inline-flex", alignItems: "center",
        }}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
