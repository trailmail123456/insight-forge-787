import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowUpRight, ArrowRight, Download, ExternalLink, ChevronDown,
  Brain, Eye, TrendingUp, Server, FileText, MessageSquare,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Knowledge Labs — Research & writing on AI, LLMs, and computer vision" },
      { name: "description", content: "A deep-space research institute for AI, LLMs, computer vision, and serious technical writing." },
      { property: "og:title", content: "Knowledge Labs" },
      { property: "og:description", content: "Research and writing on AI, LLMs, and computer vision." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

type Kind = "Essay" | "Deep dive" | "Notes" | "Opinion";
type Post = {
  kind: Kind;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  tags: string[];
  slug: string;
};

const KIND_STYLE: Record<Kind, { bg: string; border: string; color: string }> = {
  "Essay":     { bg: "rgba(124,58,237,.14)", border: "rgba(124,58,237,.4)",  color: "#A78BFA" },
  "Deep dive": { bg: "rgba(6,182,212,.12)",  border: "rgba(6,182,212,.35)",  color: "#06B6D4" },
  "Notes":     { bg: "rgba(16,185,129,.12)", border: "rgba(16,185,129,.35)", color: "#10B981" },
  "Opinion":   { bg: "rgba(245,158,11,.12)", border: "rgba(245,158,11,.35)", color: "#F59E0B" },
};

const posts: Post[] = [
  { kind: "Essay", title: "Why retrieval is the bottleneck, not generation", excerpt: "A practical look at where LLM systems actually fail in production — and why the answer almost always sits upstream of the model.", date: "Mar 14, 2026", readTime: "12 min", tags: ["LLM", "Retrieval", "Systems"], slug: "retrieval-is-the-bottleneck" },
  { kind: "Deep dive", title: "What vision transformers learned that CNNs didn't", excerpt: "Inductive biases, attention maps, and the quiet revolution in how machines see — explained with worked examples.", date: "Mar 02, 2026", readTime: "18 min", tags: ["Vision", "Transformers"], slug: "vit-vs-cnn" },
  { kind: "Notes", title: "Speculative decoding in plain language", excerpt: "How draft-and-verify schemes squeeze 2-3× more throughput out of the same model, without changing quality.", date: "Feb 18, 2026", readTime: "8 min", tags: ["LLM", "Inference"], slug: "speculative-decoding-explained" },
  { kind: "Opinion", title: "Scaling laws are not predictions", excerpt: "On the difference between empirical regularities and engineering forecasts in modern ML.", date: "Feb 04, 2026", readTime: "7 min", tags: ["ML", "Opinion"], slug: "scaling-laws-not-predictions" },
];

const papers = [
  {
    title: "Sparse Attention Routing for Long-Context Retrieval",
    abstract: "We propose a sparse routing mechanism that reduces memory overhead by 4.2× while preserving recall on long-context benchmarks. Across eight datasets and three model scales, the method matches dense baselines on accuracy while running materially faster at inference time.",
    year: "2026", citations: 14, slug: "sparse-attention-routing", authors: "A. Researcher, B. Co-author",
  },
  {
    title: "Self-Supervised Pretraining for Low-Resource Vision Tasks",
    abstract: "A study of contrastive and masked-image pretraining objectives across five low-data domains, with reproducible baselines and an analysis of which signals transfer when labels are scarce.",
    year: "2025", citations: 47, slug: "ssl-low-resource-vision", authors: "A. Researcher",
  },
];

const categories = [
  { name: "Large Language Models", count: 24, Icon: Brain,          slug: "llm" },
  { name: "Computer Vision",       count: 18, Icon: Eye,            slug: "vision" },
  { name: "Machine Learning",      count: 31, Icon: TrendingUp,     slug: "ml" },
  { name: "Systems & Infra",       count: 11, Icon: Server,         slug: "systems" },
  { name: "Research Notes",        count: 22, Icon: FileText,       slug: "notes" },
  { name: "Opinion",               count:  9, Icon: MessageSquare,  slug: "opinion" },
];

function Home() {
  const [filter, setFilter] = useState<"All" | Kind>("All");
  const visiblePosts = useMemo(
    () => (filter === "All" ? posts : posts.filter((p) => p.kind === filter)),
    [filter],
  );
  const kinds: ("All" | Kind)[] = ["All", "Essay", "Deep dive", "Notes", "Opinion"];

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute -top-32 -left-20 h-[550px] w-[550px] rounded-full animate-drift"
          style={{ background: "radial-gradient(circle, rgba(124,58,237,.18) 0%, transparent 70%)" }} />
        <div aria-hidden className="pointer-events-none absolute top-5 -right-16 h-[420px] w-[420px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(6,182,212,.10) 0%, transparent 70%)", animation: "drift 26s ease-in-out infinite alternate-reverse" }} />

        <div className="container-wide relative py-20 md:py-28">
          <div className="max-w-3xl">
            <div
              className="inline-flex items-center gap-2 rounded-full animate-fade-up animate-pulse-border"
              style={{
                padding: "6px 18px",
                background: "rgba(124,58,237,.10)",
                border: "1px solid rgba(139,92,246,.35)",
                color: "var(--text-accent)",
                fontFamily: "var(--font-sans)",
                fontWeight: 500,
                fontSize: 12,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 6px #10B981" }} />
              Open Access · Independent research
            </div>

            <h1
              className="mt-7 animate-fade-up text-balance"
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 400,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
                fontSize: "clamp(40px, 5.8vw, 70px)",
                color: "var(--text-primary)",
                animationDelay: ".15s",
              }}
            >
              A research and writing space for{" "}
              <span className="gradient-text italic">AI, LLMs, and computer vision.</span>
            </h1>

            <p
              className="mt-6 max-w-2xl animate-fade-up text-pretty"
              style={{
                color: "var(--text-secondary)",
                fontSize: 18, lineHeight: 1.75,
                animationDelay: ".3s",
              }}
            >
              Essays, deep dives, and research notes on how modern intelligent
              systems actually work — written for engineers and researchers who
              want depth without noise.
            </p>

            <div className="mt-8 flex flex-wrap gap-3 animate-fade-up" style={{ animationDelay: ".45s" }}>
              <Link to="/blog" className="kl-btn-primary">
                Read the essays <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
              </Link>
              <Link to="/papers" className="kl-btn-secondary">
                Browse research
              </Link>
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-0">
              <Stat n={42} label="Essays published" />
              <span className="hidden sm:block h-10 w-px" style={{ background: "var(--border)" }} />
              <Stat n={11} label="Research papers" />
              <span className="hidden sm:block h-10 w-px" style={{ background: "var(--border)" }} />
              <Stat n={3700} label="Subscribers" />
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div
          className="relative overflow-hidden"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "18px 0" }}
        >
          <div className="animate-marquee flex gap-8 w-max">
            {[...Array(2)].map((_, dup) => (
              <div key={dup} className="flex gap-8 items-center">
                {["Large Language Models", "Computer Vision", "Machine Learning", "Systems & Infrastructure", "Research Notes", "Opinion & Analysis"].map((t, i) => (
                  <span key={`${dup}-${i}`} className="flex items-center gap-8 whitespace-nowrap">
                    <span style={{ color: "var(--accent-mid)", fontSize: 12 }}>✦</span>
                    <span style={{ color: "var(--text-secondary)", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 13, letterSpacing: "0.04em" }}>
                      {t}
                    </span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Essays */}
      <section className="container-wide py-20">
        <SectionHead eyebrow="Featured" title="Recent essays" link={{ to: "/blog", label: "All essays" }} />

        <div className="mt-8 flex flex-wrap gap-2">
          <div className="inline-flex gap-1 p-1 rounded-xl" style={{ background: "rgba(255,255,255,.04)", border: "1px solid var(--border)" }}>
            {kinds.map((k) => {
              const active = filter === k;
              return (
                <button
                  key={k}
                  onClick={() => setFilter(k)}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium transition-colors"
                  style={{
                    background: active ? "var(--accent-violet)" : "transparent",
                    color: active ? "#fff" : "var(--text-muted)",
                    boxShadow: active ? "0 4px 12px rgba(124,58,237,.35)" : undefined,
                    border: "none",
                  }}
                >
                  {k}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {visiblePosts.map((p) => (
            <EssayCard key={p.slug} post={p} />
          ))}
        </div>
      </section>

      {/* Papers */}
      <section className="container-wide pb-20">
        <SectionHead eyebrow="Research" title="Recent papers" link={{ to: "/papers", label: "All papers" }} />
        <div className="mt-8 reveal" style={{ borderTop: "1px solid var(--border)" }}>
          {papers.map((p) => <PaperRow key={p.slug} paper={p} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="container-wide pb-20">
        <SectionHead eyebrow="Browse" title="By topic" link={{ to: "/categories", label: "All topics" }} />
        <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/categories"
              className="reveal group rounded-2xl p-6 block"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--border-hover)";
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(124,58,237,.18)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.transform = "";
                e.currentTarget.style.boxShadow = "";
              }}
            >
              <div
                className="grid h-12 w-12 place-items-center rounded-xl mb-4"
                style={{
                  background: "rgba(124,58,237,.12)",
                  border: "1px solid rgba(124,58,237,.22)",
                  color: "var(--text-accent)",
                }}
              >
                <c.Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <div style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 16, color: "var(--text-primary)" }}>{c.name}</div>
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>{c.count} articles</div>
              <div className="mt-3 text-xs font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-accent)" }}>
                Browse <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Author + Newsletter */}
      <section className="container-wide pb-24">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="reveal rounded-2xl p-8" style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}>
            <div
              className="grid place-items-center rounded-full text-white animate-float"
              style={{
                width: 72, height: 72,
                background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
                fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 22,
                boxShadow: "0 0 32px rgba(124,58,237,.35)",
              }}
            >KL</div>
            <h3 className="mt-5" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 26, fontStyle: "italic", color: "var(--text-primary)" }}>
              Independent research, openly shared.
            </h3>
            <p className="mt-3" style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.75 }}>
              Knowledge Labs is a personal publication. Everything here is
              written first-hand — essays, paper drafts, and research notes
              built around problems I'm actively working on.
            </p>
            <Link to="/about" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium" style={{ color: "var(--text-accent)" }}>
              About the project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div
            className="reveal rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg, rgba(124,58,237,.10), rgba(6,182,212,.06))",
              border: "1px solid rgba(124,58,237,.22)",
            }}
          >
            <p className="font-mono uppercase tracking-widest" style={{ fontSize: 11, color: "var(--text-accent)" }}>Stay in the loop</p>
            <h3 className="mt-3" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 24, color: "var(--text-primary)" }}>
              New essays & papers, occasionally.
            </h3>
            <p className="mt-3" style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>
              Roughly one email a month. Skim the field without the noise.
            </p>
            <form className="mt-5" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email" required placeholder="you@domain.com"
                className="kl-input w-full mb-2.5"
              />
              <button type="submit" className="kl-btn-primary w-full justify-center">Subscribe</button>
            </form>
            <p className="mt-3 text-center" style={{ fontSize: 11, color: "var(--text-muted)" }}>No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>

      {/* Local component styles */}
      <style>{`
        .kl-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 10px;
          background: linear-gradient(135deg, #7C3AED, #6D28D9);
          color: #fff; border: none; cursor: pointer;
          font-family: var(--font-sans); font-weight: 500; font-size: 14px;
          transition: transform .2s, box-shadow .25s;
        }
        .kl-btn-primary:hover {
          box-shadow: 0 0 42px rgba(124,58,237,.5), 0 8px 30px rgba(124,58,237,.25);
          transform: translateY(-2px);
        }
        .kl-btn-secondary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 26px; border-radius: 10px;
          background: rgba(255,255,255,.03);
          border: 1px solid var(--border);
          color: var(--text-secondary); cursor: pointer;
          font-family: var(--font-sans); font-weight: 500; font-size: 14px;
        }
        .kl-btn-secondary:hover {
          border-color: var(--border-hover); color: var(--text-primary);
          background: rgba(255,255,255,.05);
        }
        .kl-input {
          padding: 11px 14px; border-radius: 9px;
          background: rgba(255,255,255,.05);
          border: 1px solid var(--border);
          color: var(--text-primary); outline: none;
          font-family: var(--font-sans); font-size: 14px;
        }
        .kl-input:focus {
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px var(--accent-glow-sm);
        }
      `}</style>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div style={{ padding: "0 28px" }} className="first:pl-0">
      <div data-count={n} style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 30, color: "var(--text-primary)" }}>0</div>
      <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 4 }}>
        {label}
      </div>
    </div>
  );
}

function SectionHead({ eyebrow, title, link }: { eyebrow: string; title: string; link?: { to: string; label: string } }) {
  return (
    <div className="reveal flex flex-wrap items-end justify-between gap-3">
      <div>
        <div style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 11, color: "var(--text-accent)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          {eyebrow}
        </div>
        <h2 className="mt-2" style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 36, lineHeight: 1.15, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          {title}
        </h2>
      </div>
      {link && (
        <Link to={link.to} className="text-sm font-medium inline-flex items-center gap-1" style={{ color: "var(--text-accent)" }}>
          {link.label} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

function EssayCard({ post }: { post: Post }) {
  const ks = KIND_STYLE[post.kind];
  return (
    <article
      className="reveal group rounded-2xl p-6 cursor-pointer"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--bg-elevated)";
        e.currentTarget.style.borderColor = "var(--border-hover)";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "0 20px 60px rgba(124,58,237,.14)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--bg-surface)";
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "";
        e.currentTarget.style.boxShadow = "";
      }}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 14, fontSize: 12, color: "var(--text-muted)" }}>
        <span style={{
          padding: "3px 10px", borderRadius: 999,
          background: ks.bg, border: `1px solid ${ks.border}`, color: ks.color,
          fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: "0.08em", fontWeight: 600,
        }}>
          {post.kind.toUpperCase()}
        </span>
        <span>{post.date} · {post.readTime}</span>
      </div>
      <h3
        className="transition-colors"
        style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 19, lineHeight: 1.4, color: "var(--text-primary)" }}
      >
        <Link to="/blog/$slug" params={{ slug: post.slug }} className="group-hover:[color:var(--text-accent)]">
          {post.title}
        </Link>
      </h3>
      <p className="mt-2" style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.65 }}>{post.excerpt}</p>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {post.tags.map((t) => (
            <span key={t} style={{
              padding: "3px 10px", borderRadius: 999,
              background: "rgba(255,255,255,.05)", border: "1px solid var(--border)",
              fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)",
            }}>#{t}</span>
          ))}
        </div>
        <ArrowUpRight
          className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-all"
          style={{ color: "var(--text-accent)" }}
        />
      </div>
    </article>
  );
}

function PaperRow({ paper }: { paper: (typeof papers)[number] }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="group relative reveal"
      style={{
        padding: "24px 0",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        transition: "background .2s, padding-left .2s",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(124,58,237,.04)";
        e.currentTarget.style.paddingLeft = "16px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.paddingLeft = "0";
      }}
    >
      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span style={{ padding: "2px 9px", borderRadius: 6, background: "rgba(255,255,255,.06)", border: "1px solid var(--border)", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-muted)" }}>
          {paper.year}
        </span>
        <span style={{ padding: "2px 10px", borderRadius: 999, background: "rgba(6,182,212,.1)", border: "1px solid rgba(6,182,212,.3)", fontSize: 12, color: "var(--cyan, #06B6D4)" }}>
          {paper.citations} citations
        </span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{paper.authors}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 18, lineHeight: 1.45, color: "var(--text-primary)" }}>
        {paper.title}
      </h3>
      <div
        style={{
          overflow: "hidden",
          maxHeight: open ? 220 : 0,
          transition: "max-height .4s ease, padding .3s ease",
          paddingTop: open ? 12 : 0,
          color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7, fontStyle: "italic",
        }}
      >
        {paper.abstract}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button onClick={() => setOpen((v) => !v)} className="paper-action">
          <ChevronDown className="h-3.5 w-3.5" style={{ transform: open ? "rotate(180deg)" : "", transition: "transform .2s" }} />
          {open ? "Hide abstract" : "Read abstract"}
        </button>
        <button className="paper-action"><Download className="h-3.5 w-3.5" /> PDF</button>
        <button className="paper-action"><ExternalLink className="h-3.5 w-3.5" /> arXiv</button>
      </div>
      <style>{`
        .paper-action {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 5px 12px; border-radius: 7px;
          background: rgba(255,255,255,.04); border: 1px solid var(--border);
          color: var(--text-secondary); font-size: 12px; font-weight: 500;
          cursor: pointer;
        }
        .paper-action:hover {
          border-color: var(--border-hover); color: var(--text-accent);
        }
      `}</style>
    </div>
  );
}
