import { createFileRoute, Link } from "@tanstack/react-router";
import { FileDown } from "lucide-react";

export const Route = createFileRoute("/papers")({
  head: () => ({
    meta: [
      { title: "Research papers — Knowledge Labs" },
      { name: "description", content: "Research papers and technical reports on AI, LLMs, and computer vision." },
      { property: "og:title", content: "Research papers — Knowledge Labs" },
      { property: "og:description", content: "Research papers and technical reports on AI, LLMs, and computer vision." },
      { property: "og:url", content: "/papers" },
    ],
    links: [{ rel: "canonical", href: "/papers" }],
  }),
  component: PapersIndex,
});

const papers = [
  { title: "Sparse Attention Routing for Long-Context Retrieval", abstract: "We propose a sparse routing mechanism that reduces memory overhead by 4.2× while preserving recall on long-context benchmarks across 12 evaluation suites.", keywords: ["Attention", "Retrieval", "Long-context"], year: "2026", pdf: true },
  { title: "Self-Supervised Pretraining for Low-Resource Vision Tasks", abstract: "A comparative study of contrastive and masked-image pretraining objectives across five low-data domains, with reproducible baselines and ablations.", keywords: ["SSL", "Vision", "Pretraining"], year: "2025", pdf: true },
  { title: "On the Calibration of Instruction-Tuned Language Models", abstract: "We measure calibration drift introduced by RLHF and propose a lightweight post-hoc correction that recovers 78% of base-model calibration.", keywords: ["LLM", "Calibration", "RLHF"], year: "2025", pdf: true },
];

function PapersIndex() {
  return (
    <div className="container-wide py-16 md:py-24">
      <header className="max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Research</p>
        <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
          Papers and technical reports.
        </h1>
        <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
          Formal write-ups with abstracts, methodology, and references. PDFs
          are available for each paper alongside the web version.
        </p>
      </header>

      <div className="hairline my-10" />

      <ul className="space-y-10">
        {papers.map((p) => (
          <li key={p.title}>
            <div className="flex items-baseline justify-between gap-6">
              <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">
                <Link to="/papers" className="hover:text-primary">{p.title}</Link>
              </h2>
              <span className="font-mono text-xs text-muted-foreground">{p.year}</span>
            </div>
            <p className="mt-3 max-w-3xl text-pretty leading-relaxed text-muted-foreground">{p.abstract}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {p.keywords.map((k) => (
                  <span key={k} className="rounded-full border border-border bg-background px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground">
                    {k}
                  </span>
                ))}
              </div>
              {p.pdf && (
                <a className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground" href="#">
                  <FileDown className="h-3.5 w-3.5" /> PDF
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
