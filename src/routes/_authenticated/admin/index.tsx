import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getAdminStats } from "@/lib/admin.functions";
import { FileText, FlaskConical, FilePlus, FlaskRound } from "lucide-react";

const statsQuery = queryOptions({
  queryKey: ["admin", "stats"],
  queryFn: () => getAdminStats(),
  staleTime: 30_000,
});

export const Route = createFileRoute("/_authenticated/admin/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(statsQuery),
  component: Dashboard,
});

function Dashboard() {
  const { data } = useSuspenseQuery(statsQuery);

  return (
    <div className="space-y-8">
      <header>
        <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Overview
        </p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          A quick view of your content. Editors handle drafts here; only admins
          can flip status to published.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        <StatCard
          icon={FileText}
          label="Posts"
          total={data.posts.total}
          published={data.posts.published}
          drafts={data.posts.drafts}
          newHref="/admin/posts"
          listHref="/admin/posts"
        />
        <StatCard
          icon={FlaskConical}
          label="Papers"
          total={data.papers.total}
          published={data.papers.published}
          drafts={data.papers.drafts}
          newHref="/admin/papers"
          listHref="/admin/papers"
        />
      </div>

      <div className="rounded-lg border border-border bg-card p-6">
        <h2 className="font-display text-lg font-semibold">Quick actions</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Editors and writing tools come online in the next phase.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <ActionLink to="/admin/posts" icon={FilePlus}>
            Manage posts
          </ActionLink>
          <ActionLink to="/admin/papers" icon={FlaskRound}>
            Manage papers
          </ActionLink>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  total,
  published,
  drafts,
  listHref,
}: {
  icon: typeof FileText;
  label: string;
  total: number;
  published: number;
  drafts: number;
  newHref: string;
  listHref: string;
}) {
  return (
    <Link
      to={listHref}
      className="group rounded-lg border border-border bg-card p-5 transition-colors hover:border-foreground/30"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Icon className="h-4 w-4" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="font-mono text-xs text-muted-foreground group-hover:text-foreground">
          {total} total
        </span>
      </div>
      <div className="mt-4 flex items-baseline gap-6">
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight">
            {published}
          </p>
          <p className="text-xs text-muted-foreground">Published</p>
        </div>
        <div>
          <p className="font-display text-3xl font-semibold tracking-tight text-muted-foreground">
            {drafts}
          </p>
          <p className="text-xs text-muted-foreground">Drafts</p>
        </div>
      </div>
    </Link>
  );
}

function ActionLink({
  to,
  icon: Icon,
  children,
}: {
  to: string;
  icon: typeof FileText;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
    >
      <Icon className="h-4 w-4" />
      {children}
    </Link>
  );
}
