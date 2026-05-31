import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";

const mockResults = [
  { type: "Essay", title: "Why retrieval is the bottleneck, not generation", to: "/blog/retrieval-is-the-bottleneck" },
  { type: "Deep dive", title: "What vision transformers learned that CNNs didn't", to: "/blog/vit-vs-cnn" },
  { type: "Paper", title: "Sparse Attention Routing for Long-Context Retrieval", to: "/papers" },
  { type: "Paper", title: "Self-Supervised Pretraining for Low-Resource Vision Tasks", to: "/papers" },
];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;
  const filtered = q
    ? mockResults.filter((r) => r.title.toLowerCase().includes(q.toLowerCase()))
    : mockResults;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[10vh]" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-popover shadow-2xl">
        <div className="flex items-center gap-3 border-b border-border px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search papers, essays…"
            className="h-14 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          <kbd className="hidden rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline-block">ESC</kbd>
          <button onClick={onClose} className="rounded p-1 text-muted-foreground hover:text-foreground sm:hidden" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2">
          {filtered.length === 0 && (
            <li className="px-3 py-8 text-center text-sm text-muted-foreground">No results for "{q}"</li>
          )}
          {filtered.map((r) => (
            <li key={r.title}>
              <Link
                to={r.to}
                onClick={onClose}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm hover:bg-muted"
              >
                <span className="truncate">{r.title}</span>
                <span className="shrink-0 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{r.type}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
