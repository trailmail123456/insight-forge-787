import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BookOpen, FileText, Hash } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Knowledge Labs — Research & writing on AI, LLMs, and computer vision" },
      { name: "description", content: "A research and writing space focused on AI, LLMs, computer vision, and deep technical ideas." },
      { property: "og:title", content: "Knowledge Labs" },
      { property: "og:description", content: "Research and writing on AI, LLMs, and computer vision." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const featuredPosts = [
  {
    kind: "Essay",
    title: "Why retrieval is the bottleneck, not generation",
    excerpt: "A practical look at where LLM systems actually fail in production — and why the answer almost always sits upstream of the model.",
    date: "Mar 14, 2026",
    readTime: "12 min read",
    slug: "retrieval-is-the-bottleneck",
  },
  {
    kind: "Deep dive",
    title: "What vision transformers learned that CNNs didn't",
    excerpt: "Inductive biases, attention maps, and the quiet revolution in how machines see — explained with worked examples and intuition.",
    date: "Mar 02, 2026",
    readTime: "18 min read",
    slug: "vit-vs-cnn",
  },
];

const featuredPapers = [
  {
    title: "Sparse Attention Routing for Long-Context Retrieval",
    abstract: "We propose a sparse routing mechanism that reduces memory overhead by 4.2× while preserving recall on long-context benchmarks.",
    keywords: ["Attention", "Retrieval", "Long-context"],
    year: "2026",
    slug: "sparse-attention-routing",
  },
  {
    title: "Self-Supervised Pretraining for Low-Resource Vision Tasks",
    abstract: "A study of contrastive and masked-image pretraining objectives across five low-data domains, with reproducible baselines.",
    keywords: ["SSL", "Vision", "Pretraining"],
    year: "2025",
    slug: "ssl-low-resource-vision",
  },
];

const categories = [
  { name: "Large Language Models", count: 24 },
  { name: "Computer Vision", count: 18 },
  { name: "Machine Learning", count: 31 },
  { name: "Systems & Infra", count: 11 },
  { name: "Research Notes", count: 22 },
  { name: "Opinion", count: 9 },
];

function Home() {
  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border/60">
        <div className="container-wide py-20 md:py-32">
          <div className="max-w-3xl">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Knowledge Labs · est. 2026
            </p>
            <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              A research and writing space for AI, LLMs, and computer vision.
            </h1>
            <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
              Essays, deep dives, and research notes on how modern intelligent
              systems actually work — written for engineers and researchers who
              want depth without noise.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Read the blog <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/papers"
                className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-5 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
              >
                View research papers
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured blog */}
      <section className="container-wide py-20">
        <SectionHead
          eyebrow="Featured"
          title="Recent essays"
          link={{ to: "/blog", label: "All posts" }}
          icon={BookOpen}
        />
        <div className="mt-10 grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 md:grid-cols-2">
          {featuredPosts.map((p) => (
            <article key={p.slug} className="group bg-background p-8 transition-colors hover:bg-surface">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono uppercase tracking-wider text-primary">{p.kind}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{p.date}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{p.readTime}</span>
              </div>
              <h3 className="mt-4 font-display text-2xl font-semibold leading-snug tracking-tight">
                <Link to="/blog" className="decoration-foreground/30 underline-offset-4 group-hover:underline">
                  {p.title}
                </Link>
              </h3>
              <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">{p.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Featured papers */}
      <section className="bg-surface/60 border-y border-border/60">
        <div className="container-wide py-20">
          <SectionHead
            eyebrow="Research"
            title="Recent papers"
            link={{ to: "/papers", label: "All papers" }}
            icon={FileText}
          />
          <div className="mt-10 space-y-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
            {featuredPapers.map((p) => (
              <article key={p.slug} className="bg-background p-8 transition-colors hover:bg-surface">
                <div className="flex items-baseline justify-between gap-6">
                  <h3 className="font-display text-xl font-semibold tracking-tight md:text-2xl">
                    <Link to="/papers">{p.title}</Link>
                  </h3>
                  <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
                </div>
                <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{p.abstract}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.keywords.map((k) => (
                    <span key={k} className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                      {k}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-wide py-20">
        <SectionHead
          eyebrow="Browse"
          title="By category"
          link={{ to: "/categories", label: "All categories" }}
          icon={Hash}
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.name}
              to="/categories"
              className="group flex items-center justify-between rounded-lg border border-border/70 bg-background px-5 py-4 transition-colors hover:border-foreground/30"
            >
              <span className="font-display text-base font-medium">{c.name}</span>
              <span className="font-mono text-xs text-muted-foreground">{c.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* About / newsletter */}
      <section className="border-t border-border/60">
        <div className="container-wide grid gap-10 py-20 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">About the author</p>
            <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight">Independent research, openly shared.</h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Knowledge Labs is a personal publication. Everything here is
              written first-hand — essays, paper drafts, and research notes
              built around problems I'm actively working on.
            </p>
            <Link to="/about" className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
              Read more about the project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface/60 p-8">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stay in the loop</p>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">New essays & papers, occasionally.</h3>
            <p className="mt-2 text-sm text-muted-foreground">No spam. Unsubscribe anytime.</p>
            <form className="mt-5 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="you@domain.com"
                className="flex-1 rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-ring focus:ring-2"
              />
              <button
                type="submit"
                className="rounded-md bg-foreground px-4 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHead({
  eyebrow,
  title,
  link,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  link: { to: string; label: string };
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-end justify-between gap-6">
      <div>
        <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          <Icon className="h-3.5 w-3.5" /> {eyebrow}
        </div>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      </div>
      <Link
        to={link.to}
        className="hidden shrink-0 items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground sm:inline-flex"
      >
        {link.label} <ArrowUpRight className="h-3.5 w-3.5" />
      </Link>
    </div>
  );
}
