import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getAdminContext } from "@/lib/admin.functions";
import { PaperEditor } from "@/components/admin/paper-editor";

const ctxQuery = queryOptions({
  queryKey: ["admin", "context"],
  queryFn: () => getAdminContext(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/_authenticated/admin/papers/$id")({
  head: () => ({ meta: [{ title: "Edit paper — Knowledge Labs" }, { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(ctxQuery),
  component: EditPaper,
});

function EditPaper() {
  const { id } = Route.useParams();
  const { data: ctx } = useSuspenseQuery(ctxQuery);
  return <PaperEditor paperId={id} isAdmin={ctx.isAdmin} userId={ctx.userId} />;
}
