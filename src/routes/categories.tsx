import { createFileRoute, Link } from "@tanstack/react-router";
import { Brain, Eye, TrendingUp, Server, FileText, MessageSquare, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Topics — Knowledge Labs" },
      { name: "description", content: "Browse writing and research by topic." },
      { property: "og:title", content: "Topics — Knowledge Labs" },
      { property: "og:description", content: "Browse writing and research by topic." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: Categories,
});

const cats = [
  { name: "Large Language Models", count: 24, Icon: Brain,         desc: "Architecture, training, alignment, and behaviour.", preview: "Retrieval bottleneck · Speculative decoding · Long context" },
  { name: "Computer Vision",       count: 18, Icon: Eye,           desc: "Detection, segmentation, vision transformers, multimodal.", preview: "ViTs vs CNNs · SSL pretraining · Open-set detection" },
  { name: "Machine Learning",      count: 31, Icon: TrendingUp,    desc: "Foundations, training dynamics, optimization.", preview: "Scaling laws · Loss landscapes · Generalization" },
  { name: "Systems & Infrastructure", count: 11, Icon: Server,     desc: "Serving, retrieval, evaluation pipelines.", preview: "Inference stacks · Vector DBs · Eval harnesses" },
  { name: "Research Notes",        count: 22, Icon: FileText,      desc: "Short-form notes on papers and ideas in progress.", preview: "Weekly digests · Paper takedowns · Open questions" },
  { name: "Opinion",               count:  9, Icon: MessageSquare, desc: "Essays and positions backed by references.", preview: "On hype cycles · Bench validity · Open research" },
];

function Categories() {
  return (
    <div className="container-wide py-16 md:py-24">
      <header className="max-w-3xl reveal">
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 11, color: "var(--text-accent)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Topics
        </p>
        <h1 className="mt-3 text-balance" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Browse by <span className="gradient-text italic">topic.</span>
        </h1>
        <p className="mt-5 max-w-xl" style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.75 }}>
          Six tracks across the work — pick a thread and pull on it.
        </p>
      </header>

      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {cats.map((c) => (
          <Link
            key={c.name}
            to="/blog"
            className="reveal group rounded-2xl p-7 flex flex-col gap-3"
            style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--border-hover)";
              e.currentTarget.style.transform = "translateY(-5px)";
              e.currentTarget.style.boxShadow = "0 20px 55px rgba(124,58,237,.15)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border)";
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = "";
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="grid h-12 w-12 place-items-center rounded-xl" style={{ background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.22)", color: "var(--text-accent)" }}>
                <c.Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div className="text-right">
                <div data-count={c.count} style={{ fontFamily: "var(--font-sans)", fontWeight: 700, fontSize: 24, color: "var(--text-accent)" }}>0</div>
                <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>articles</div>
              </div>
            </div>
            <h2 className="mt-2" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 20, color: "var(--text-primary)" }}>{c.name}</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.65 }}>{c.desc}</p>
            <div
              className="opacity-0 group-hover:opacity-100 transition-all flex items-center justify-between gap-3 pt-3"
              style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)", fontSize: 12 }}
            >
              <span className="truncate" style={{ fontFamily: "var(--font-mono)" }}>{c.preview}</span>
              <ArrowUpRight className="h-4 w-4" style={{ color: "var(--text-accent)" }} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
