import { createFileRoute } from "@tanstack/react-router";
import { Mail, FileText, Twitter, Clock, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Knowledge Labs" },
      { name: "description", content: "Get in touch with Knowledge Labs." },
      { property: "og:title", content: "Contact — Knowledge Labs" },
      { property: "og:description", content: "Get in touch with Knowledge Labs." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-wide py-16 md:py-24">
      <div className="reveal max-w-3xl">
        <p style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 11, color: "var(--text-accent)", textTransform: "uppercase", letterSpacing: "0.12em" }}>
          Contact
        </p>
        <h1
          className="mt-3 text-balance"
          style={{
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(36px, 5vw, 56px)", lineHeight: 1.1,
            color: "var(--text-primary)", letterSpacing: "-0.02em",
          }}
        >
          Get in <span className="gradient-text italic">touch.</span>
        </h1>
        <p className="mt-5 max-w-xl" style={{ color: "var(--text-secondary)", fontSize: 17, lineHeight: 1.75 }}>
          Have a question about a paper, a correction, or just want to say
          something sharp? Reach out.
        </p>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-2">
        {/* Left: info */}
        <div className="space-y-4 reveal">
          <InfoCard Icon={Mail} title="Email" value="hello@knowledgelabs.xyz" href="mailto:hello@knowledgelabs.xyz" />
          <InfoCard Icon={FileText} title="arXiv profile" value="View published research" href="#" />
          <InfoCard Icon={Twitter} title="Twitter / X" value="@knowledgelabs" href="https://twitter.com" />

          <div
            className="flex items-center gap-3 rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg, rgba(16,185,129,.08), rgba(6,182,212,.05))",
              border: "1px solid rgba(16,185,129,.25)",
            }}
          >
            <div className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "rgba(16,185,129,.15)", color: "#10B981" }}>
              <Clock className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <div>
              <div style={{ color: "var(--text-primary)", fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 14 }}>
                Usually replies within 48 hours
              </div>
              <div className="mt-0.5" style={{ color: "var(--text-muted)", fontSize: 12 }}>Mon–Fri, occasionally weekends</div>
            </div>
          </div>
        </div>

        {/* Right: form */}
        <form
          className="reveal rounded-2xl p-8 space-y-5"
          style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
          onSubmit={(e) => e.preventDefault()}
        >
          <Field label="Name">
            <input type="text" required className="contact-input" placeholder="Jane Doe" />
          </Field>
          <Field label="Email">
            <input type="email" required className="contact-input" placeholder="you@domain.com" />
          </Field>
          <Field label="Subject">
            <select className="contact-input" defaultValue="General">
              <option>General question</option>
              <option>Paper correction</option>
              <option>Collaboration</option>
              <option>Other</option>
            </select>
          </Field>
          <Field label="Message">
            <textarea rows={6} required className="contact-input" placeholder="Tell me what's on your mind…" />
          </Field>
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 px-6 py-3 rounded-lg text-white font-medium"
            style={{ background: "linear-gradient(135deg,#7C3AED,#6D28D9)", fontSize: 14 }}
          >
            Send message <ArrowUpRight className="h-4 w-4" />
          </button>
          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center" }}>
            No spam. Responses only for substantive messages.
          </p>
        </form>
      </div>

      <style>{`
        .contact-input {
          width: 100%;
          padding: 11px 14px;
          border-radius: 9px;
          background: rgba(255,255,255,.04);
          border: 1px solid var(--border);
          color: var(--text-primary);
          font-family: var(--font-sans); font-size: 14px;
          outline: none;
        }
        .contact-input:focus {
          border-color: var(--border-hover);
          box-shadow: 0 0 0 3px var(--accent-glow-sm);
        }
        select.contact-input { appearance: none; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block mb-1.5" style={{ fontFamily: "var(--font-sans)", fontWeight: 500, fontSize: 12, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
        {label}
      </span>
      {children}
    </label>
  );
}

function InfoCard({ Icon, title, value, href }: { Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>; title: string; value: string; href: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-4 rounded-2xl p-5 group"
      style={{ background: "var(--bg-surface)", border: "1px solid var(--border)" }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.transform = ""; }}
    >
      <div className="grid h-11 w-11 place-items-center rounded-xl" style={{ background: "rgba(124,58,237,.12)", border: "1px solid rgba(124,58,237,.22)", color: "var(--text-accent)" }}>
        <Icon className="h-4 w-4" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600 }}>{title}</div>
        <div className="mt-0.5" style={{ color: "var(--text-primary)", fontSize: 15 }}>{value}</div>
      </div>
      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-accent)" }} />
    </a>
  );
}
