import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getAdminContext } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, FileText, FlaskConical, LogOut, ExternalLink } from "lucide-react";

const adminContextQuery = queryOptions({
  queryKey: ["admin", "context"],
  queryFn: () => getAdminContext(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Knowledge Labs" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(adminContextQuery),
  component: AdminLayout,
});

const nav = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/posts", label: "Posts", icon: FileText, exact: false },
  { to: "/admin/papers", label: "Papers", icon: FlaskConical, exact: false },
];

function AdminLayout() {
  const { data: ctx } = useSuspenseQuery(adminContextQuery);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const fetchCtx = useServerFn(getAdminContext);
  // ensure the fetched function reference is preserved for type wiring
  void fetchCtx;

  const signOut = async () => {
    await supabase.auth.signOut();
    qc.clear();
    navigate({ to: "/login", replace: true });
  };

  return (
    <div className="container-wide grid gap-8 py-10 md:grid-cols-[220px_1fr]">
      <aside className="md:sticky md:top-24 md:self-start">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Workspace
          </p>
          <p className="mt-1 truncate font-display text-sm font-semibold">
            {ctx.profile?.display_name ?? "Editor"}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {ctx.isAdmin ? "Admin" : ctx.isEditor ? "Editor" : "Author"}
          </p>
        </div>

        <nav className="mt-4 space-y-0.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 space-y-0.5 border-t border-border pt-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <ExternalLink className="h-4 w-4" />
            View site
          </Link>
          <button
            type="button"
            onClick={signOut}
            className="flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      </aside>

      <section className="min-w-0">
        <Outlet />
      </section>
    </div>
  );
}
