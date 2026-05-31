import { Link } from "@tanstack/react-router";
import { Rss, Github, Twitter } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border/60">
      <div className="container-wide grid gap-10 py-14 sm:grid-cols-2 md:grid-cols-4">
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
          <div className="mt-5 flex items-center gap-2">
            <a href="/rss.xml" aria-label="RSS feed" className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground">
              <Rss className="h-3.5 w-3.5" /> RSS
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground">
              <Twitter className="h-3.5 w-3.5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="grid h-8 w-8 place-items-center rounded-md border border-border text-muted-foreground hover:text-foreground">
              <Github className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Read</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/blog" className="text-muted-foreground hover:text-foreground">Blog</Link></li>
            <li><Link to="/papers" className="text-muted-foreground hover:text-foreground">Research papers</Link></li>
            <li><Link to="/categories" className="text-muted-foreground hover:text-foreground">Categories</Link></li>
            <li><a href="/rss.xml" className="text-muted-foreground hover:text-foreground">RSS feed</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Site</h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/about" className="text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><a href="/sitemap.xml" className="text-muted-foreground hover:text-foreground">Sitemap</a></li>
          </ul>
          <div className="mt-6">
            <ThemeToggle />
          </div>
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
