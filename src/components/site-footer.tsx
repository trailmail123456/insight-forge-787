import { Link } from "@tanstack/react-router";
import { Rss, Github, Twitter, Mail } from "lucide-react";

export function SiteFooter() {
  return (
    <footer
      className="mt-24"
      style={{
        background: "var(--bg-footer)",
        borderTop: "1px solid var(--border)",
        padding: "60px 0 32px",
      }}
    >
      <div className="container-wide">
        <div className="grid gap-12 md:grid-cols-[2fr_1fr_1fr_1fr] mb-12">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className="grid h-9 w-9 place-items-center rounded-[10px] text-white"
                style={{
                  background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
                  boxShadow: "0 0 18px rgba(124,58,237,.45)",
                  fontFamily: "var(--font-sans)",
                  fontWeight: 700,
                  fontSize: 14,
                }}
              >K</div>
              <span className="text-foreground" style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 16 }}>
                Knowledge Labs
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              An independent research and writing space focused on AI, LLMs,
              computer vision, and the engineering beneath them.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                { href: "/rss.xml", Icon: Rss, label: "RSS" },
                { href: "https://twitter.com", Icon: Twitter, label: "Twitter" },
                { href: "https://github.com", Icon: Github, label: "GitHub" },
                { href: "mailto:hello@knowledgelabs.xyz", Icon: Mail, label: "Email" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="grid h-9 w-9 place-items-center rounded-lg"
                  style={{
                    background: "rgba(255,255,255,.04)",
                    border: "1px solid var(--border)",
                    color: "var(--text-muted)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--border-hover)";
                    e.currentTarget.style.color = "var(--text-accent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol
            title="Read"
            links={[
              { to: "/blog", label: "Essays" },
              { to: "/papers", label: "Research" },
              { to: "/categories", label: "Topics" },
              { href: "/rss.xml", label: "RSS feed" },
            ]}
          />
          <FooterCol
            title="Site"
            links={[
              { to: "/about", label: "About" },
              { to: "/contact", label: "Contact" },
              { href: "/sitemap.xml", label: "Sitemap" },
            ]}
          />
          <FooterCol
            title="Connect"
            links={[
              { href: "https://twitter.com", label: "Twitter / X" },
              { href: "https://github.com", label: "GitHub" },
              { href: "mailto:hello@knowledgelabs.xyz", label: "Email" },
            ]}
          />
        </div>

        <div
          className="pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
        >
          <p>© {new Date().getFullYear()} Knowledge Labs <span style={{ color: "var(--accent-mid)" }}>·</span> All rights reserved.</p>
          <p style={{ fontFamily: "var(--font-mono)" }}>Built for long-form reading.</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: Array<{ to?: string; href?: string; label: string }> }) {
  return (
    <div>
      <h4 style={{
        fontFamily: "var(--font-sans)",
        fontWeight: 600,
        fontSize: 11,
        color: "var(--text-accent)",
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        marginBottom: 16,
      }}>{title}</h4>
      <ul>
        {links.map((l) => (
          <li key={l.label}>
            {l.to ? (
              <Link to={l.to} className="block py-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className="block py-1 text-sm" style={{ color: "var(--text-secondary)" }}>
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
