import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { listAdminPosts } from "@/lib/admin.functions";
import { Plus } from "lucide-react";

const postsQuery = queryOptions({
  queryKey: ["admin", "posts"],
  queryFn: () => listAdminPosts(),
  staleTime: 15_000,
});

export const Route = createFileRoute("/_authenticated/admin/posts")({
  loader: ({ context }) => context.queryClient.ensureQueryData(postsQuery),
  component: PostsAdmin,
});

function PostsAdmin() {
  const { data } = useSuspenseQuery(postsQuery);

  return (
    <div className="space-y-6">
      <header className="flex items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Content
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            Posts
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Essays, notes, opinions, and technical writing.
          </p>
        </div>
        <button
          type="button"
          disabled
          title="Editor available in the next phase"
          className="inline-flex items-center gap-2 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background opacity-60"
        >
          <Plus className="h-4 w-4" />
          New post
        </button>
      </header>

      {data.length === 0 ? (
        <EmptyState label="No posts yet. The editor will let you create your first essay shortly." />
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
              {data.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.title}</div>
                    <div className="font-mono text-xs text-muted-foreground">
                      /{p.slug}
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">
                    {p.post_type}
                  </td>
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
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const isPublished = status === "published";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${
        isPublished
          ? "bg-foreground/10 text-foreground"
          : "bg-muted text-muted-foreground"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          isPublished ? "bg-foreground" : "bg-muted-foreground"
        }`}
      />
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
