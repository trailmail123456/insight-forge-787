import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowRight, Search } from "lucide-react";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Essays — Knowledge Labs" },
      { name: "description", content: "Essays, deep dives, and notes on AI, LLMs, and computer vision." },
      { property: "og:title", content: "Essays — Knowledge Labs" },
      { property: "og:description", content: "Essays and deep dives on AI, LLMs, and computer vision." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

type Post = { kind: string; title: string; excerpt: string; date: string; readTime: string; tags: string[]; slug: string };

const posts: Post[] = [
  { kind: "Essay", title: "Why retrieval is the bottleneck, not generation", excerpt: "Where LLM systems actually fail in production — and why the answer almost always sits upstream of the model.", date: "Mar 14, 2026", readTime: "12 min read", tags: ["LLM", "Systems"], slug: "retrieval-is-the-bottleneck" },
  { kind: "Deep dive", title: "What vision transformers learned that CNNs didn't", excerpt: "Inductive biases, attention maps, and the quiet revolution in how machines see.", date: "Mar 02, 2026", readTime: "18 min read", tags: ["Vision", "Transformers"], slug: "vit-vs-cnn" },
  { kind: "Notes", title: "A practical taxonomy of evaluation harnesses", excerpt: "Comparing eval suites across reasoning, retrieval, and tool-use, with notes on what they actually measure.", date: "Feb 20, 2026", readTime: "9 min read", tags: ["Evals"], slug: "eval-harnesses" },
  { kind: "Opinion", title: "Scaling laws are not predictions", excerpt: "On the difference between empirical regularities and engineering forecasts in modern ML.", date: "Feb 04, 2026", readTime: "7 min read", tags: ["ML", "Opinion"], slug: "scaling-laws-not-predictions" },
];

const filters = ["All", "Essay", "Deep dive", "Notes", "Opinion"];

function BlogIndex() {
  const [active, setActive] = useState("All");
  const [q, setQ] = useState("");

  const list = useMemo(() => {
    return posts.filter((p) => (active === "All" || p.kind === active) && (!q || p.title.toLowerCase().includes(q.toLowerCase())));
  }, [active, q]);

  const counts = useMemo(() => {
    const out: Record<string, number> = { All: posts.length };
    posts.forEach((p) => { out[p.kind] = (out[p.kind] ?? 0) + 1; });
    return out;
  }, []);

  return (
    <div className="container-wide py-16 md:py-24">
      <header className="max-w-3xl reveal">
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 11, color: "var(--text-accent)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          The Blog
        </p>
        <h1 className="mt-3" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Essays, deep dives, <span className="gradient-text italic">and notes.</span>
        </h1>
        <p className="mt-5" style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.75 }}>
          Long-form writing on AI systems, LLM behaviour, computer vision, and
          the engineering that holds them together.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between reveal">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            placeholder="Search posts…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="w-full py-2 pl-9 pr-3 text-sm outline-none rounded-lg"
            style={{
              background: "rgba(255,255,255,.04)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
          />
        </div>

        <div className="inline-flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)" }}>
          {filters.map((f) => {
            const isActive = active === f;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5"
                style={{
                  background: isActive ? "var(--accent-violet)" : "transparent",
                  color: isActive ? "#fff" : "var(--text-muted)",
                  boxShadow: isActive ? "0 4px 12px rgba(124,58,237,.35)" : undefined,
                  border: "none",
                }}
              >
                {f}
                <span style={{
                  background: isActive ? "rgba(255,255,255,.25)" : "rgba(255,255,255,.08)",
                  borderRadius: 999, padding: "1px 6px", fontSize: 10,
                }}>{counts[f] ?? 0}</span>
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-12">
        {list.map((p) => (
          <li
            key={p.slug}
            className="group reveal relative"
            style={{ padding: "24px 0", borderBottom: "1px solid var(--border)", transition: "padding .2s, background .2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(124,58,237,.035)"; e.currentTarget.style.paddingLeft = "20px"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.paddingLeft = "0"; }}
          >
            <Link to="/blog/$slug" params={{ slug: p.slug }} className="block">
              <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-muted)" }}>
                <span style={{ color: "var(--text-accent)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{p.kind}</span>
                <span>·</span>
                <span>{p.date}</span>
                <span>·</span>
                <span>{p.readTime}</span>
              </div>
              <h2 className="mt-3 transition-colors" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 22, lineHeight: 1.35, color: "var(--text-primary)" }}>
                {p.title}
              </h2>
              <p className="mt-2 max-w-3xl" style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.65 }}>{p.excerpt}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span key={t} style={{
                      padding: "3px 10px", borderRadius: 999,
                      background: "rgba(255,255,255,.05)", border: "1px solid var(--border)",
                      fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
                    }}>#{t}</span>
                  ))}
                </div>
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" style={{ color: "var(--text-accent)" }} />
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
