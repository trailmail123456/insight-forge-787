import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search, LogIn, LayoutDashboard, Menu, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SearchModal } from "./search-modal";

const nav = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/papers", label: "Research" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [signedIn, setSignedIn] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => setMenuOpen(false), [path]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="container-wide flex h-16 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <span className="font-display text-xs font-bold">K</span>
            </div>
            <span className="font-display text-base font-semibold tracking-tight">
              Knowledge Labs
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden h-9 w-64 items-center gap-2 rounded-md border border-border bg-background px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-muted md:flex"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="flex-1 truncate">Search papers, essays…</span>
              <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px]">⌘K</kbd>
            </button>

            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground md:hidden"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              to={signedIn ? "/admin" : "/login"}
              aria-label={signedIn ? "Admin" : "Sign in"}
              className="hidden items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted sm:inline-flex"
            >
              {signedIn ? (
                <><LayoutDashboard className="h-3.5 w-3.5" />Admin</>
              ) : (
                <><LogIn className="h-3.5 w-3.5" />Sign in</>
              )}
            </Link>

            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground lg:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden">
          <div className="absolute inset-0 bg-foreground/30 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 max-w-[85vw] border-l border-border bg-background p-6 shadow-xl">
            <div className="mt-12 flex flex-col gap-1">
              {nav.map((item) => {
                const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`rounded-md px-3 py-2.5 text-sm ${
                      active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-3 h-px bg-border" />
              <Link
                to={signedIn ? "/admin" : "/login"}
                className="rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {signedIn ? "Admin dashboard" : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
