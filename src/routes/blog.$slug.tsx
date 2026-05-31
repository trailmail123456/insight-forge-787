import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Copy, Check, Twitter, Linkedin, Link2 } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    const title = post ? `${post.title} — Knowledge Labs` : "Essay — Knowledge Labs";
    const description = post?.excerpt ?? "An essay from Knowledge Labs.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `/blog/${params.slug}` },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [{ rel: "canonical", href: `/blog/${params.slug}` }],
    };
  },
  component: ArticlePage,
  notFoundComponent: () => (
    <div className="container-wide py-24 text-center">
      <h1 className="font-display text-3xl font-semibold">Essay not found</h1>
      <Link to="/blog" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">← Back to blog</Link>
    </div>
  ),
});

type Section = { id: string; heading: string; body: string[] };
type ArticlePost = {
  slug: string;
  kind: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  readMinutes: number;
  tags: string[];
  sections: Section[];
};

const posts: ArticlePost[] = [
  {
    slug: "retrieval-is-the-bottleneck",
    kind: "Essay",
    title: "Why retrieval is the bottleneck, not generation",
    excerpt: "A practical look at where LLM systems actually fail in production — and why the answer almost always sits upstream of the model.",
    date: "Mar 14, 2026",
    readTime: "12 min", readMinutes: 12,
    tags: ["LLM", "Retrieval", "Systems"],
    sections: [
      { id: "intro", heading: "The wrong layer gets the blame", body: [
        "When a retrieval-augmented system produces a bad answer, the first instinct is to blame the language model. It is the last thing that touched the output, and it's the most visible component in the stack. But the failures that show up in production almost never originate there.",
        "If you instrument enough requests, a pattern appears: the model is given context that does not actually contain the answer, and it confabulates around the gap. The model did its job. The retriever did not.",
      ]},
      { id: "what-fails", heading: "What actually fails", body: [
        "Three issues recur. First, the chunking strategy splits answers across boundaries. Second, the embedding model maps queries and documents into spaces that disagree on what 'similar' means for the domain. Third, the ranking step optimizes for surface relevance rather than answer-bearing content.",
      ]},
      { id: "fixes", heading: "Where the leverage is", body: [
        "Better chunking, hybrid retrieval, and a reranker trained on your domain — in that order — typically move the needle more than swapping the generator. None of it is glamorous. All of it compounds.",
        "The unglamorous work upstream of the model is where the production wins live.",
      ]},
    ],
  },
  {
    slug: "vit-vs-cnn",
    kind: "Deep dive",
    title: "What vision transformers learned that CNNs didn't",
    excerpt: "Inductive biases, attention maps, and the quiet revolution in how machines see.",
    date: "Mar 02, 2026",
    readTime: "18 min", readMinutes: 18,
    tags: ["Vision", "Transformers"],
    sections: [
      { id: "biases", heading: "Inductive biases, revisited", body: [
        "Convolutions encode locality and translation equivariance as architectural priors. Transformers don't — they learn them from data when the data is large enough.",
      ]},
      { id: "attention", heading: "What attention maps reveal", body: [
        "Early ViT layers behave like generic edge detectors. Later layers route attention to semantically coherent regions, often crossing the entire image to gather context a CNN would only assemble in its final stages.",
      ]},
      { id: "tradeoffs", heading: "The trade", body: [
        "You trade strong priors for scale. With enough data, transformers find priors that beat hand-designed ones. With less data, CNNs still win.",
      ]},
    ],
  },
  {
    slug: "speculative-decoding-explained",
    kind: "Explainer",
    title: "Speculative decoding in plain language",
    excerpt: "How draft-and-verify schemes squeeze 2-3× more throughput out of the same model.",
    date: "Feb 18, 2026",
    readTime: "8 min", readMinutes: 8,
    tags: ["LLM", "Inference"],
    sections: [
      { id: "idea", heading: "The core idea", body: [
        "A small, fast model drafts several tokens. A large, slow model verifies them in parallel. When the draft agrees with the large model, you've gotten multiple tokens for the cost of one forward pass.",
      ]},
      { id: "why", heading: "Why it works", body: [
        "Most next tokens are easy. The big model wastes capacity on them. Letting a smaller model handle the easy cases — and only paying the full cost when the draft and verifier disagree — recovers that wasted capacity as throughput.",
      ]},
    ],
  },
  {
    slug: "scaling-laws-not-predictions",
    kind: "Opinion",
    title: "Scaling laws are not predictions",
    excerpt: "On the difference between empirical regularities and engineering forecasts in modern ML.",
    date: "Feb 04, 2026",
    readTime: "7 min", readMinutes: 7,
    tags: ["ML", "Opinion"],
    sections: [
      { id: "obs", heading: "What scaling laws are", body: [
        "They are observations: loss curves that look surprisingly smooth across orders of magnitude of compute and data. They are not theories of why.",
      ]},
      { id: "limit", heading: "What they don't tell you", body: [
        "They don't tell you when a curve will bend. They don't tell you whether the next capability will appear before the next compute budget runs out. Treating them as forecasts is a category error.",
      ]},
    ],
  },
];

function ArticlePage() {
  const { slug } = useParams({ from: "/blog/$slug" });
  const post = posts.find((p) => p.slug === slug);

  const [progress, setProgress] = useState(0);
  const [activeId, setActiveId] = useState<string>(post?.sections[0]?.id ?? "");
  const [tweetSel, setTweetSel] = useState<{ x: number; y: number; text: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const articleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const seen = Math.min(Math.max(-rect.top, 0), Math.max(total, 1));
      const pct = total > 0 ? (seen / total) * 100 : 0;
      setProgress(pct);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!post) return;
    const onIO = (entries: IntersectionObserverEntry[]) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setActiveId(visible[0].target.id);
    };
    const obs = new IntersectionObserver(onIO, { rootMargin: "0px 0px -70% 0px" });
    post.sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [post]);

  // Save reading progress to localStorage
  useEffect(() => {
    if (!post) return;
    if (progress < 5) return;
    try {
      const raw = localStorage.getItem("kl:read-progress");
      const data = raw ? JSON.parse(raw) : {};
      data[post.slug] = Math.max(data[post.slug] ?? 0, Math.round(progress));
      localStorage.setItem("kl:read-progress", JSON.stringify(data));
    } catch {}
  }, [progress, post]);

  // Highlight-to-tweet
  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection();
      const text = sel?.toString().trim() ?? "";
      if (!text || text.length < 12) {
        setTweetSel(null);
        return;
      }
      const range = sel!.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerEl = articleRef.current;
      if (!containerEl || !containerEl.contains(range.commonAncestorContainer)) {
        setTweetSel(null);
        return;
      }
      setTweetSel({
        x: rect.left + rect.width / 2 + window.scrollX,
        y: rect.top + window.scrollY - 12,
        text: text.slice(0, 200),
      });
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, []);

  const related = useMemo(() => {
    if (!post) return [];
    return posts
      .filter((p) => p.slug !== post.slug && p.tags.some((t) => post.tags.includes(t)))
      .slice(0, 3);
  }, [post]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  };

  if (!post) {
    return (
      <div className="container-wide py-24 text-center">
        <h1 className="font-display text-3xl font-semibold">Essay not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground">← Back to blog</Link>
      </div>
    );
  }

  const url = typeof window !== "undefined" ? window.location.href : `/blog/${post.slug}`;
  const minutesLeft = Math.max(0, Math.ceil(((100 - progress) / 100) * post.readMinutes));

  return (
    <>
      {/* Reading progress bar */}
      <div className="sticky top-16 z-30 h-0.5 w-full bg-transparent">
        <div className="h-full bg-[color:var(--teal)] transition-[width]" style={{ width: `${progress}%` }} />
      </div>

      <div className="container-wide py-10 md:py-14">
        <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to blog
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_220px]">
          <article ref={articleRef} className="min-w-0">
            <header>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="font-mono uppercase tracking-wider text-primary">{post.kind}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{post.date}</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-muted-foreground">{post.readTime} read</span>
                <span className="text-muted-foreground">·</span>
                <span className="text-[color:var(--teal)]">{minutesLeft} min left</span>
              </div>
              <h1 className="mt-4 text-balance font-display text-3xl font-semibold leading-[1.1] tracking-tight md:text-5xl">
                {post.title}
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
                {post.excerpt}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Twitter className="h-3.5 w-3.5" /> Tweet
                </a>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <Linkedin className="h-3.5 w-3.5" /> LinkedIn
                </a>
                <button
                  onClick={copyLink}
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-[color:var(--teal)]" /> : <Link2 className="h-3.5 w-3.5" />}
                  {copied ? "Copied" : "Copy link"}
                </button>
              </div>
            </header>

            <div className="mt-12 max-w-2xl space-y-12">
              {post.sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-32">
                  <h2 className="font-display text-2xl font-semibold tracking-tight md:text-3xl">{s.heading}</h2>
                  <div className="mt-4 space-y-4 text-base leading-relaxed text-foreground/90">
                    {s.body.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </section>
              ))}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <section className="mt-16 border-t border-border/60 pt-10">
                <h2 className="font-display text-xl font-semibold tracking-tight">Related essays</h2>
                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        to="/blog/$slug" params={{ slug: r.slug }}
                        className="block rounded-lg border border-border/70 bg-background p-4 transition-colors hover:border-foreground/40"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{r.kind} · {r.readTime}</div>
                        <div className="mt-1 font-display text-base font-semibold tracking-tight">{r.title}</div>
                        <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{r.excerpt}</p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: post.title,
                  description: post.excerpt,
                  datePublished: post.date,
                  author: { "@type": "Organization", name: "Knowledge Labs" },
                }),
              }}
            />
          </article>

          {/* TOC */}
          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">On this page</p>
              <ul className="mt-3 space-y-2 border-l border-border">
                {post.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className={`-ml-px block border-l py-1 pl-3 text-sm transition-colors ${
                        activeId === s.id
                          ? "border-[color:var(--teal)] text-foreground"
                          : "border-transparent text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* Highlight-to-tweet floating button */}
      {tweetSel && (
        <a
          href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`"${tweetSel.text}"`)}&url=${encodeURIComponent(url)}`}
          target="_blank" rel="noopener noreferrer"
          style={{ position: "absolute", top: tweetSel.y, left: tweetSel.x, transform: "translate(-50%, -100%)" }}
          className="z-40 inline-flex items-center gap-1.5 rounded-md bg-foreground px-2.5 py-1.5 text-xs font-medium text-background shadow-lg"
        >
          <Twitter className="h-3 w-3" /> Tweet this
        </a>
      )}
    </>
  );
}
