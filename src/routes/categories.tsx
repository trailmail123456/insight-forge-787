import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/categories")({
  head: () => ({
    meta: [
      { title: "Categories — Knowledge Labs" },
      { name: "description", content: "Browse writing and research by category." },
      { property: "og:title", content: "Categories — Knowledge Labs" },
      { property: "og:description", content: "Browse writing and research by category." },
      { property: "og:url", content: "/categories" },
    ],
    links: [{ rel: "canonical", href: "/categories" }],
  }),
  component: Categories,
});

const cats = [
  { name: "Large Language Models", count: 24, desc: "Architecture, training, alignment, and behaviour." },
  { name: "Computer Vision", count: 18, desc: "Detection, segmentation, vision transformers, multimodal." },
  { name: "Machine Learning", count: 31, desc: "Foundations, training dynamics, optimization." },
  { name: "Systems & Infrastructure", count: 11, desc: "Serving, retrieval, evaluation pipelines." },
  { name: "Research Notes", count: 22, desc: "Short-form notes on papers and ideas in progress." },
  { name: "Opinion", count: 9, desc: "Essays and positions backed by references." },
];

function Categories() {
  return (
    <div className="container-wide py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Categories</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Browse by topic.
        </h1>
      </header>

      <div className="mt-12 grid gap-4 md:grid-cols-2">
        {cats.map((c) => (
          <Link
            key={c.name}
            to="/blog"
            className="group rounded-xl border border-border/70 bg-background p-6 transition-colors hover:border-foreground/30"
          >
            <div className="flex items-baseline justify-between">
              <h2 className="font-display text-xl font-semibold tracking-tight">{c.name}</h2>
              <span className="font-mono text-xs text-muted-foreground">{c.count}</span>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
