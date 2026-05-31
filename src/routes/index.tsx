import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight, BookOpen, FileText, Download, ExternalLink,
  ChevronDown, Copy, Check, Brain, Eye, Cpu, Server, NotebookPen, MessageSquare,
} from "lucide-react";

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

type Kind = "Essay" | "Deep dive" | "Explainer" | "Opinion";
type Post = {
  kind: Kind;
  title: string;
  excerpt: string;
  date: string;
  publishedAt: string; // ISO
  readTime: string;
  reads: string;
  tags: string[];
  slug: string;
};

const posts: Post[] = [
  {
    kind: "Essay",
    title: "Why retrieval is the bottleneck, not generation",
    excerpt: "A practical look at where LLM systems actually fail in production — and why the answer almost always sits upstream of the model.",
    date: "Mar 14, 2026", publishedAt: "2026-03-14",
    readTime: "12 min", reads: "1.2k",
    tags: ["LLM", "Retrieval", "Systems"],
    slug: "retrieval-is-the-bottleneck",
  },
  {
    kind: "Deep dive",
    title: "What vision transformers learned that CNNs didn't",
    excerpt: "Inductive biases, attention maps, and the quiet revolution in how machines see — explained with worked examples and intuition.",
    date: "Mar 02, 2026", publishedAt: "2026-03-02",
    readTime: "18 min", reads: "3.4k",
    tags: ["Vision", "Transformers"],
    slug: "vit-vs-cnn",
  },
  {
    kind: "Explainer",
    title: "Speculative decoding in plain language",
    excerpt: "How draft-and-verify schemes squeeze 2-3× more throughput out of the same model, without changing quality.",
    date: "Feb 18, 2026", publishedAt: "2026-02-18",
    readTime: "8 min", reads: "842",
    tags: ["LLM", "Inference"],
    slug: "speculative-decoding-explained",
  },
  {
    kind: "Opinion",
    title: "Scaling laws are not predictions",
    excerpt: "On the difference between empirical regularities and engineering forecasts in modern ML.",
    date: "Feb 04, 2026", publishedAt: "2026-02-04",
    readTime: "7 min", reads: "511",
    tags: ["ML", "Opinion"],
    slug: "scaling-laws-not-predictions",
  },
];

const papers = [
  {
    title: "Sparse Attention Routing for Long-Context Retrieval",
    abstract: "We propose a sparse routing mechanism that reduces memory overhead by 4.2× while preserving recall on long-context benchmarks. Across eight datasets and three model scales, the method matches dense baselines on accuracy while running materially faster at inference time.",
    keywords: ["Attention", "Retrieval", "Long-context"],
    year: "2026", citations: 14,
    slug: "sparse-attention-routing",
    pdf: "#", arxiv: "#",
    authors: ["A. Researcher", "B. Co-author"],
  },
  {
    title: "Self-Supervised Pretraining for Low-Resource Vision Tasks",
    abstract: "A study of contrastive and masked-image pretraining objectives across five low-data domains, with reproducible baselines and an analysis of which signals transfer when labels are scarce.",
    keywords: ["SSL", "Vision", "Pretraining"],
    year: "2025", citations: 47,
    slug: "ssl-low-resource-vision",
    pdf: "#", arxiv: "#",
    authors: ["A. Researcher"],
  },
];

const categories = [
  { name: "Large Language Models", count: 24, icon: Brain, color: "text-violet-600 dark:text-violet-400", slug: "llm" },
  { name: "Computer Vision", count: 18, icon: Eye, color: "text-rose-600 dark:text-rose-400", slug: "vision" },
  { name: "Machine Learning", count: 31, icon: Cpu, color: "text-amber-600 dark:text-amber-400", slug: "ml" },
  { name: "Systems & Infra", count: 11, icon: Server, color: "text-sky-600 dark:text-sky-400", slug: "systems" },
  { name: "Research Notes", count: 22, icon: NotebookPen, color: "text-emerald-600 dark:text-emerald-400", slug: "notes" },
  { name: "Opinion", count: 9, icon: MessageSquare, color: "text-orange-600 dark:text-orange-400", slug: "opinion" },
];

function isNew(iso: string) {
  return Date.now() - new Date(iso).getTime() < 7 * 24 * 60 * 60 * 1000;
}

function Home() {
  const [filter, setFilter] = useState<"All" | Kind>("All");
  const [sort, setSort] = useState<"Latest" | "Most read">("Latest");
  const [reads, setReads] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const raw = localStorage.getItem("kl:read-progress");
      if (raw) setReads(JSON.parse(raw));
    } catch {}
  }, []);

  const visiblePosts = useMemo(() => {
    let list = filter === "All" ? posts : posts.filter((p) => p.kind === filter);
    list = [...list].sort((a, b) =>
      sort === "Latest"
        ? +new Date(b.publishedAt) - +new Date(a.publishedAt)
        : parseFloat(b.reads) - parseFloat(a.reads),
    );
    return list;
  }, [filter, sort]);

  const kinds: ("All" | Kind)[] = ["All", "Essay", "Deep dive", "Explainer", "Opinion"];

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border/60">
        <div className="container-wide py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="grid h-7 w-7 place-items-center rounded-full bg-foreground text-[10px] font-semibold text-background">
                  KL
                </div>
                <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                  Knowledge Labs
                </span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--teal)]/40 bg-[color:var(--teal)]/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--teal)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--teal)]" />
                Open access
              </span>
            </div>

            <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
              A research and writing space for AI, LLMs, and computer vision.
            </h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              Essays, deep dives, and research notes on how modern intelligent
              systems actually work — written for engineers and researchers who
              want depth without noise.
            </p>

            {/* Stats */}
            <dl className="mt-8 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-border/70 bg-border/70">
              {[
                { label: "Essays", value: "42" },
                { label: "Papers", value: "11" },
                { label: "Subscribers", value: "3.7k" },
              ].map((s) => (
                <div key={s.label} className="bg-background px-4 py-3">
                  <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{s.label}</dt>
                  <dd className="mt-0.5 font-display text-xl font-semibold tracking-tight">{s.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
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

      {/* Essays */}
      <section className="container-wide py-14 md:py-16">
        <SectionHead
          eyebrow="Featured"
          title="Recent essays"
          link={{ to: "/blog", label: "All posts" }}
          icon={BookOpen}
        />

        <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {kinds.map((k) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`rounded-full px-3 py-1.5 text-xs transition-colors ${
                  filter === k
                    ? "bg-foreground text-background"
                    : "border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-muted-foreground">Sort:</span>
            {(["Latest", "Most read"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`rounded-md px-2.5 py-1 ${
                  sort === s ? "text-foreground underline underline-offset-4" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-px overflow-hidden rounded-xl border border-border/60 bg-border/60 md:grid-cols-2">
          {visiblePosts.map((p) => {
            const progress = reads[p.slug] ?? 0;
            return (
              <article key={p.slug} className="group relative bg-background p-7 transition-colors hover:bg-surface">
                {progress > 0 && (
                  <span
                    className="absolute inset-x-0 top-0 h-0.5 bg-[color:var(--teal)]"
                    style={{ width: `${Math.min(100, progress)}%` }}
                    aria-label={`${progress}% read`}
                  />
                )}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono uppercase tracking-wider text-primary">{p.kind}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{p.date}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="text-muted-foreground">{p.readTime}</span>
                  {isNew(p.publishedAt) && (
                    <span className="ml-1 rounded-full bg-[color:var(--teal)] px-1.5 py-0.5 font-mono text-[9px] font-semibold uppercase tracking-wider text-background">
                      New
                    </span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-1 text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3" /> {p.reads} reads
                  </span>
                </div>
                <h3 className="mt-3 font-display text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="decoration-foreground/30 underline-offset-4 group-hover:underline"
                  >
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 text-pretty leading-relaxed text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <Link
                      key={t}
                      to="/blog"
                      className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Papers */}
      <section className="border-y border-border/60 bg-surface/60">
        <div className="container-wide py-16">
          <SectionHead
            eyebrow="Research"
            title="Recent papers"
            link={{ to: "/papers", label: "All papers" }}
            icon={FileText}
          />
          <div className="mt-8 space-y-px overflow-hidden rounded-xl border border-border/60 bg-border/60">
            {papers.map((p) => (
              <PaperCard key={p.slug} paper={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-wide py-16">
        <SectionHead
          eyebrow="Browse"
          title="By category"
          link={{ to: "/categories", label: "All categories" }}
          icon={BookOpen}
        />
        <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.slug}
              to="/categories"
              className="group flex flex-col gap-3 rounded-xl border border-border/70 bg-background p-5 transition-colors hover:border-foreground/40"
            >
              <div className={`grid h-9 w-9 place-items-center rounded-md bg-muted ${c.color}`}>
                <c.icon className="h-4 w-4" strokeWidth={1.5} />
              </div>
              <div>
                <div className="font-display text-sm font-semibold leading-tight md:text-base">{c.name}</div>
                <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">{c.count} articles</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-border/60">
        <div className="container-wide grid gap-10 py-16 md:grid-cols-2 md:gap-16">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">About the author</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight">Independent research, openly shared.</h2>
            <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
              Knowledge Labs is a personal publication. Everything here is
              written first-hand — essays, paper drafts, and research notes
              built around problems I'm actively working on.
            </p>
            <Link to="/about" className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline">
              Read more about the project <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="rounded-xl border border-border/70 bg-surface/60 p-7">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Stay in the loop</p>
            <h3 className="mt-3 font-display text-xl font-semibold tracking-tight">New essays & papers, occasionally.</h3>
            <div className="mt-4 rounded-md border border-border bg-background p-3 text-sm leading-relaxed text-muted-foreground">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--teal)]">Latest essay</span>
              <p className="mt-1">
                {posts[0].excerpt} Subscribe to get new pieces like this in your inbox the day they're published.
              </p>
            </div>
            <form className="mt-4 flex flex-col gap-2 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
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
            <p className="mt-2 text-xs text-muted-foreground">No spam. Unsubscribe anytime.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function PaperCard({ paper }: { paper: (typeof papers)[number] }) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const bibtex = useMemo(
    () =>
      `@article{${paper.slug},\n  title={${paper.title}},\n  author={${paper.authors.join(" and ")}},\n  year={${paper.year}}\n}`,
    [paper],
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(bibtex);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  return (
    <article className="bg-background p-7 transition-colors hover:bg-surface">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <h3 className="font-display text-lg font-semibold tracking-tight md:text-xl">
          <Link to="/papers">{paper.title}</Link>
        </h3>
        <div className="flex items-center gap-3 font-mono text-[11px] text-muted-foreground">
          <span>{paper.year}</span>
          <span>·</span>
          <span>{paper.citations} citations</span>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
        aria-expanded={open}
      >
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
        {open ? "Hide abstract" : "Show abstract"}
      </button>

      {open && (
        <p className="mt-3 max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground">
          {paper.abstract}
        </p>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {paper.keywords.map((k) => (
          <span key={k} className="rounded-full border border-border bg-background px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
            {k}
          </span>
        ))}
        <div className="ml-auto flex flex-wrap items-center gap-1.5">
          <a
            href={paper.pdf}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <Download className="h-3 w-3" /> PDF
          </a>
          <a
            href={paper.arxiv}
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            <ExternalLink className="h-3 w-3" /> arXiv
          </a>
          <button
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="h-3 w-3 text-[color:var(--teal)]" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied" : "BibTeX"}
          </button>
        </div>
      </div>
    </article>
  );
}

function SectionHead({
  eyebrow, title, link, icon: Icon,
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
