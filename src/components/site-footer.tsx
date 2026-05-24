import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border/60">
      <div className="container-wide grid gap-10 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-foreground text-background">
              <span className="font-display text-xs font-bold">K</span>
            </div>
            <span className="font-display text-base font-semibold tracking-tight">
              Knowledge Labs
            </span>
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
            A research and writing space focused on AI, LLMs, computer vision,
            and deep technical ideas.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Read
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/blog" className="hover:text-foreground text-muted-foreground">Blog</Link></li>
            <li><Link to="/papers" className="hover:text-foreground text-muted-foreground">Research papers</Link></li>
            <li><Link to="/categories" className="hover:text-foreground text-muted-foreground">Categories</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Site
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-foreground text-muted-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground text-muted-foreground">Contact</Link></li>
            <li><a href="/sitemap.xml" className="hover:text-foreground text-muted-foreground">Sitemap</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="container-wide flex flex-col items-start justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Knowledge Labs. All rights reserved.</p>
          <p className="font-mono">Built for long-form reading.</p>
        </div>
      </div>
    </footer>
  );
}
