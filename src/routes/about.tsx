import { createFileRoute } from "@tanstack/react-router";
import { Github, Twitter, Mail, BookOpen, FileText, Notebook } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Knowledge Labs" },
      { name: "description", content: "About Knowledge Labs — independent research and writing on AI, LLMs, and computer vision." },
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
    <div>
      {/* Hero */}
      <section className="container-prose text-center" style={{ padding: "80px 20px 60px" }}>
        <div
          className="mx-auto grid place-items-center rounded-full text-white animate-float"
          style={{
            width: 96, height: 96,
            background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
            fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 28,
            boxShadow: "0 0 48px rgba(124,58,237,.4), 0 0 0 4px rgba(124,58,237,.15)",
          }}
        >KL</div>
        <p className="mt-5" style={{ fontFamily: "var(--font-mono)", fontSize: 13, color: "var(--text-muted)" }}>@knowledgelabs</p>
        <h1
          className="mt-4 text-balance"
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 56px)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          A space for <span className="gradient-text italic">serious technical writing.</span>
        </h1>

        <div className="mt-10 space-y-6 text-left" style={{ fontSize: 17, lineHeight: 1.9, color: "var(--text-secondary)" }}>
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

        <div className="mt-8 flex justify-center gap-2 flex-wrap">
          {[
            { Icon: Twitter, href: "https://twitter.com", label: "Twitter" },
            { Icon: Github, href: "https://github.com", label: "GitHub" },
            { Icon: Mail, href: "mailto:hello@knowledgelabs.xyz", label: "Email" },
          ].map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="grid h-10 w-10 place-items-center rounded-lg"
              style={{
                background: "rgba(255,255,255,.05)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-accent)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
            </a>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container-wide pb-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { Icon: BookOpen, title: "Essays", desc: "Long-form arguments on AI systems, with worked examples and references." },
            { Icon: FileText, title: "Research Papers", desc: "Original work and reproducible studies, openly published." },
            { Icon: Notebook, title: "Research Notes", desc: "In-progress thinking, half-formed ideas, and field reports from current work." },
          ].map(({ Icon, title, desc }) => (
            <div
              key={title}
              className="reveal rounded-2xl p-7"
              style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl mb-4" style={{ background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.22)", color: "var(--text-accent)" }}>
                <Icon className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 18, color: "var(--text-primary)" }}>{title}</h3>
              <p className="mt-2" style={{ color: "var(--text-secondary)", fontSize: 14, lineHeight: 1.7 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="container-wide">
        <div
          className="flex justify-center flex-wrap"
          style={{ borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "48px 0", margin: "20px 0 60px" }}
        >
          {[
            { n: 42, label: "Essays" },
            { n: 11, label: "Papers" },
            { n: 3700, label: "Readers" },
            { n: 2024, label: "Since" },
          ].map((s, i, arr) => (
            <div
              key={s.label}
              className="text-center"
              style={{
                padding: "0 36px",
                borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
              }}
            >
              <div data-count={s.n} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 44, color: "var(--text-primary)", lineHeight: 1.1 }}>0</div>
              <div className="mt-1.5" style={{ fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section
        className="text-center"
        style={{
          background: "linear-gradient(135deg, rgba(124,58,237,.10), rgba(6,182,212,.06))",
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "70px 20px",
        }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(28px, 4vw, 40px)", letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          Get new essays in <span className="gradient-text italic">your inbox.</span>
        </h2>
        <p className="mt-3 max-w-md mx-auto" style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.7 }}>
          One thoughtful email a month. Unsubscribe whenever.
        </p>
        <form className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email" required placeholder="you@domain.com"
            className="flex-1 px-4 py-3 rounded-lg outline-none"
            style={{ background: "rgba(255,255,255,.05)", border: "1px solid var(--border)", color: "var(--text-primary)", fontSize: 14 }}
          />
          <button
            type="submit"
            className="px-6 py-3 rounded-lg text-white font-medium"
            style={{ background: "linear-gradient(135deg,#7C3AED,#6D28D9)", fontSize: 14 }}
          >
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
