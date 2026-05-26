import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Moon, Sun, Search, LogIn, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const nav = [
  { to: "/", label: "Home" },
  { to: "/blog", label: "Blog" },
  { to: "/papers", label: "Research" },
  { to: "/categories", label: "Categories" },
  { to: "/about", label: "About" },
];

export function SiteHeader() {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const [dark, setDark] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = stored ? stored === "dark" : prefers;
    setDark(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setSignedIn(!!session);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-wide flex h-16 items-center justify-between gap-6">
        <Link to="/" className="group flex items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
            <span className="font-display text-xs font-bold">K</span>
          </div>
          <span className="font-display text-base font-semibold tracking-tight">
            Knowledge Labs
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {nav.map((item) => {
            const active = item.to === "/" ? path === "/" : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-md px-3 py-1.5 text-sm transition-colors ${
                  active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <Link
            to="/search"
            aria-label="Search"
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to={signedIn ? "/admin" : "/login"}
            aria-label={signedIn ? "Admin" : "Sign in"}
            className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted"
          >
            {signedIn ? (
              <>
                <LayoutDashboard className="h-3.5 w-3.5" />
                Admin
              </>
            ) : (
              <>
                <LogIn className="h-3.5 w-3.5" />
                Sign in
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
