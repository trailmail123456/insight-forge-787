import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, LayoutDashboard, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SearchModal } from "./search-modal";

const nav = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Essays" },
  { to: "/papers", label: "Research" },
  { to: "/categories", label: "Topics" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [signedIn, setSignedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => setMenuOpen(false), [path]);

  return (
    <>
      <header
        className="sticky top-0 z-40"
        style={{
          background: scrolled ? "rgba(11,16,38,.88)" : "rgba(11,16,38,.35)",
          backdropFilter: "blur(24px) saturate(180%)",
          borderBottom: `1px solid ${scrolled ? "rgba(120,130,200,.18)" : "rgba(120,130,200,.07)"}`,
        }}
      >
        <div className="container-wide flex h-16 items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
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
            <span style={{ fontFamily: "var(--font-sans)", fontWeight: 600, fontSize: 15 }} className="text-foreground">
              Knowledge Labs
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1 mx-auto">
            {nav.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className="relative rounded-lg px-3.5 py-1.5 text-sm transition-colors"
                  style={{
                    color: active ? "var(--text-accent)" : "var(--text-secondary)",
                    background: active ? "transparent" : undefined,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute left-1/2 -bottom-0.5 -translate-x-1/2 h-1 w-1 rounded-full"
                      style={{ background: "var(--text-accent)", boxShadow: "0 0 6px var(--text-accent)" }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs"
              style={{
                background: "rgba(255,255,255,.04)",
                border: "1px solid var(--border)",
                color: "var(--text-muted)",
              }}
            >
              <Search className="h-3.5 w-3.5" />
              <span>Search…</span>
              <kbd
                className="rounded px-1.5 py-0.5"
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid var(--border)",
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "var(--text-muted)",
                }}
              >⌘K</kbd>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="md:hidden grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              <Search className="h-4 w-4" />
            </button>

            {signedIn && (
              <Link
                to="/admin"
                aria-label="Admin"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
                style={{
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid var(--border)",
                  color: "var(--text-secondary)",
                }}
              >
                <LayoutDashboard className="h-3.5 w-3.5" /> Admin
              </Link>
            )}

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="lg:hidden grid h-9 w-9 place-items-center rounded-md text-muted-foreground hover:bg-white/5 hover:text-foreground"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div
            className="absolute right-0 top-0 h-full w-72 max-w-[85vw] p-6 shadow-xl"
            style={{ background: "var(--bg-surface)", borderLeft: "1px solid var(--border)" }}
          >
            <div className="mt-12 flex flex-col gap-1">
              {nav.map((item) => {
                const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="rounded-md px-3 py-2.5 text-sm"
                    style={{
                      color: active ? "var(--text-accent)" : "var(--text-secondary)",
                      background: active ? "rgba(124,58,237,.10)" : "transparent",
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-3 h-px bg-border" />
              {signedIn ? (
                <Link to="/admin" className="rounded-md px-3 py-2.5 text-sm text-muted-foreground">Admin dashboard</Link>
              ) : null}
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
