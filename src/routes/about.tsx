import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Knowledge Labs" },
      { name: "description", content: "About Knowledge Labs and the author behind it." },
      { property: "og:title", content: "About — Knowledge Labs" },
      { property: "og:description", content: "About Knowledge Labs and the author behind it." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">About</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        A space for serious technical writing.
      </h1>
      <div className="prose-content mt-8 space-y-6 text-lg leading-relaxed text-foreground/90">
        <p>
          Knowledge Labs is an independent publication focused on artificial
          intelligence, large language models, and computer vision. Everything
          here is written first-hand — essays, paper drafts, and research notes
          built around problems I'm actively working on.
        </p>
        <p>
          The goal is depth without noise: clear technical writing that respects
          the reader's time, backed by references and reproducible reasoning.
          No hot takes, no hype cycles — just the work.
        </p>
        <p>
          If something here is useful, surprising, or wrong, I'd like to hear
          about it.
        </p>
      </div>
    </div>
  );
}
