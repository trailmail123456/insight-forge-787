import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Knowledge Labs" },
      { name: "description", content: "Essays, deep dives, and notes on AI, LLMs, and computer vision." },
      { property: "og:title", content: "Blog — Knowledge Labs" },
      { property: "og:description", content: "Essays and deep dives on AI, LLMs, and computer vision." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogIndex,
});

const posts = [
  { kind: "Essay", title: "Why retrieval is the bottleneck, not generation", excerpt: "Where LLM systems actually fail in production — and why the answer almost always sits upstream of the model.", date: "Mar 14, 2026", readTime: "12 min read", tags: ["LLM", "Systems"] },
  { kind: "Deep dive", title: "What vision transformers learned that CNNs didn't", excerpt: "Inductive biases, attention maps, and the quiet revolution in how machines see.", date: "Mar 02, 2026", readTime: "18 min read", tags: ["Vision", "Transformers"] },
  { kind: "Notes", title: "A practical taxonomy of evaluation harnesses", excerpt: "Comparing eval suites across reasoning, retrieval, and tool-use, with notes on what they actually measure.", date: "Feb 20, 2026", readTime: "9 min read", tags: ["Evals"] },
  { kind: "Opinion", title: "Scaling laws are not predictions", excerpt: "On the difference between empirical regularities and engineering forecasts in modern ML.", date: "Feb 04, 2026", readTime: "7 min read", tags: ["ML", "Opinion"] },
];

const filters = ["All", "Essay", "Deep dive", "Notes", "Opinion"];

function BlogIndex() {
  return (
    <div className="container-wide py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Blog</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Essays, deep dives, and notes.
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Long-form writing on AI systems, LLM behaviour, computer vision, and
          the engineering that holds them together.
        </p>
      </header>

      <div className="mt-12 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            placeholder="Search posts…"
            className="w-full rounded-md border border-border bg-background py-2 pl-9 pr-3 text-sm outline-none ring-ring focus:ring-2"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {filters.map((f, i) => (
            <button
              key={f}
              className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
                i === 0 ? "bg-foreground text-background" : "border border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="hairline my-10" />

      <ul className="divide-y divide-border/60">
        {posts.map((p) => (
          <li key={p.title} className="group py-8">
            <Link to="/blog" className="block">
              <div className="flex items-center gap-2 text-xs">
                <span className="font-mono uppercase tracking-wider text-primary">{p.kind}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{p.date}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{p.readTime}</span>
              </div>
              <h2 className="mt-3 font-display text-2xl font-semibold tracking-tight transition-colors group-hover:text-primary md:text-3xl">
                {p.title}
              </h2>
              <p className="mt-2 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{p.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span key={t} className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {t}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
