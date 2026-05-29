import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getAdminContext } from "@/lib/admin.functions";
import { PaperEditor } from "@/components/admin/paper-editor";

const ctxQuery = queryOptions({
  queryKey: ["admin", "context"],
  queryFn: () => getAdminContext(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/_authenticated/admin/papers/new")({
  head: () => ({ meta: [{ title: "New paper — Knowledge Labs" }, { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(ctxQuery),
  component: NewPaper,
});

function NewPaper() {
  const { data: ctx } = useSuspenseQuery(ctxQuery);
  return <PaperEditor isAdmin={ctx.isAdmin} userId={ctx.userId} />;
}
