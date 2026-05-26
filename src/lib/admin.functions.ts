import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const getAdminContext = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);
    const isAdmin = (roles ?? []).some((r) => r.role === "admin");
    const isEditor = (roles ?? []).some((r) => r.role === "editor");
    const { data: profile } = await supabase
      .from("profiles")
      .select("display_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    return { userId, isAdmin, isEditor, profile };
  });

export const listAdminPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("posts")
      .select("id, title, slug, status, post_type, featured, updated_at, published_at")
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const listAdminPapers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const { data, error } = await supabase
      .from("papers")
      .select("id, title, slug, status, featured, authors, updated_at, published_at")
      .order("updated_at", { ascending: false })
      .limit(200);
    if (error) throw new Error(error.message);
    return data ?? [];
  });

export const getAdminStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase } = context;
    const [posts, papers] = await Promise.all([
      supabase.from("posts").select("status", { count: "exact", head: false }),
      supabase.from("papers").select("status", { count: "exact", head: false }),
    ]);
    const countBy = (rows: { status: string }[] | null, s: string) =>
      (rows ?? []).filter((r) => r.status === s).length;
    return {
      posts: {
        total: posts.data?.length ?? 0,
        published: countBy(posts.data, "published"),
        drafts: countBy(posts.data, "draft"),
      },
      papers: {
        total: papers.data?.length ?? 0,
        published: countBy(papers.data, "published"),
        drafts: countBy(papers.data, "draft"),
      },
    };
  });
