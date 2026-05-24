import { createFileRoute } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";

export const Route = createFileRoute("/search")({
  head: () => ({
    meta: [
      { title: "Search — Knowledge Labs" },
      { name: "description", content: "Search posts and research papers." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  return (
    <div className="container-wide py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Search</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Find anything on the site.
      </h1>

      <div className="relative mt-10 max-w-2xl">
        <SearchIcon className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          autoFocus
          placeholder="Search posts, papers, tags, categories…"
          className="w-full rounded-md border border-border bg-background py-4 pl-12 pr-4 text-base outline-none ring-ring focus:ring-2"
        />
      </div>

      <p className="mt-8 text-sm text-muted-foreground">
        Start typing to search across blog posts, research papers, tags, and
        categories.
      </p>
    </div>
  );
}
