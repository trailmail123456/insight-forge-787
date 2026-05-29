import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { getAdminContext } from "@/lib/admin.functions";
import { PostEditor } from "@/components/admin/post-editor";

const ctxQuery = queryOptions({
  queryKey: ["admin", "context"],
  queryFn: () => getAdminContext(),
  staleTime: 60_000,
});

export const Route = createFileRoute("/_authenticated/admin/posts/$id")({
  head: () => ({ meta: [{ title: "Edit post — Knowledge Labs" }, { name: "robots", content: "noindex" }] }),
  loader: ({ context }) => context.queryClient.ensureQueryData(ctxQuery),
  component: EditPost,
});

function EditPost() {
  const { id } = Route.useParams();
  const { data: ctx } = useSuspenseQuery(ctxQuery);
  return <PostEditor postId={id} isAdmin={ctx.isAdmin} userId={ctx.userId} />;
}
