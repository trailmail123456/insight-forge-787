import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listAdminPosts } from "@/lib/admin.functions";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

const postsQuery = queryOptions({
  queryKey: ["admin", "posts"],
  queryFn: () => listAdminPosts(),
  staleTime: 15_000,
});

export const Route = createFileRoute("/_authenticated/admin/posts")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: PostsAdmin,
});

const PAGE_SIZE = 15;
const TYPES = ["all", "essay", "note", "opinion", "technical"] as const;
const STATUSES = ["all", "draft", "published"] as const;

function PostsAdmin() {
  const { data } = useSuspenseQuery(postsQuery);
  const [status, setStatus] = useState<(typeof STATUSES)[number]>("all");
  const [type, setType] = useState<(typeof TYPES)[number]>("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(
    () =>
      data.filter(
        (p) =>
          (status === "all" || p.status === status) &&
          (type === "all" || p.post_type === type),
      ),
    [data, status, type],
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Content</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">Posts</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Essays, notes, opinions, and technical writing.
          </p>
        </div>
        <Link
          to="/admin/posts/new"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90"
        >
          <Plus className="h-4 w-4" />
          New post
        </Link>
      </header>

      <div className="flex flex-wrap items-center gap-3">
        <FilterGroup label="Status" value={status} options={STATUSES} onChange={(v) => { setStatus(v); setPage(1); }} />
        <FilterGroup label="Type" value={type} options={TYPES} onChange={(v) => { setType(v); setPage(1); }} />
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "post" : "posts"}
        </span>
      </div>

      {pageItems.length === 0 ? (
        <EmptyState label="No posts match the current filters." />
      ) : (
        <div className="overflow-hidden rounded-lg border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Title</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {pageItems.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <Link to="/admin/posts/$id" params={{ id: p.id }} className="font-medium hover:underline">
                      {p.title}
                    </Link>
                    <div className="font-mono text-xs text-muted-foreground">/{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{p.post_type}</td>
                  <td className="px-4 py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(p.updated_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <Pager page={current} totalPages={totalPages} onChange={setPage} />
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">{label}:</span>
      <div className="flex rounded-md border border-border bg-card p-0.5">
        {options.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`rounded px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
              value === opt ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function Pager({ page, totalPages, onChange }: { page: number; totalPages: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
      >
        Previous
      </button>
      <span className="text-xs text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="rounded-md border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        isPublished ? "bg-foreground/10 text-foreground" : "bg-muted text-muted-foreground"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${isPublished ? "bg-foreground" : "bg-muted-foreground"}`} />
      {status}
    </span>
  );
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-card/40 px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
