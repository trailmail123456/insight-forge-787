import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/slug";
import {
  CategorySelect,
  TagPicker,
  useCategories,
  useTags,
  type Tag,
} from "@/components/admin/taxonomy-pickers";
import { ArrowLeft, Loader2, Trash2, Upload } from "lucide-react";

type PostType = "essay" | "note" | "opinion" | "technical";
type Status = "draft" | "published";

type PostRecord = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_image_url: string | null;
  post_type: PostType;
  category_id: string | null;
  status: Status;
  featured: boolean;
  reading_minutes: number | null;
};

export function PostEditor({
  postId,
  isAdmin,
  userId,
}: {
  postId?: string;
  isAdmin: boolean;
  userId: string;
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !postId;
  const categories = useCategories();
  const { tags, refresh: refreshTags } = useTags();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [postType, setPostType] = useState<PostType>("essay");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ["admin", "post", postId],
    queryFn: async () => {
      if (!postId) return null;
      const { data, error } = await supabase
        .from("posts")
        .select("*, post_tags(tag_id)")
        .eq("id", postId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!postId,
  });

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setSlug(existing.slug);
    setExcerpt(existing.excerpt ?? "");
    setContent(existing.content ?? "");
    setPostType(existing.post_type as PostType);
    setCategoryId(existing.category_id);
    setFeatured(existing.featured);
    setStatus(existing.status as Status);
    setCoverUrl(existing.cover_image_url);
    setSelectedTags(
      (existing.post_tags as { tag_id: string }[] | null)?.map((t) => t.tag_id) ?? [],
    );
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (!slugTouched && isNew) setSlug(slugify(title));
  }, [title, slugTouched, isNew]);

  const readingMinutes = useMemo(() => {
    const words = content.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 220));
  }, [content]);

  const createTag = async (name: string): Promise<Tag | null> => {
    const { data, error } = await supabase
      .from("tags")
      .insert({ name, slug: slugify(name) })
      .select("id, name, slug")
      .single();
    if (error) {
      toast.error(`Could not create tag: ${error.message}`);
      return null;
    }
    await refreshTags();
    return data;
  };

  const uploadCover = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from("cover-images").upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from("cover-images").getPublicUrl(path);
      setCoverUrl(data.publicUrl);
      toast.success("Cover uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const save = async (publish: boolean) => {
    if (!title.trim()) return toast.error("Title is required");
    if (!slug.trim()) return toast.error("Slug is required");
    setLoading(true);
    try {
      const nextStatus: Status = publish ? "published" : "draft";
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt.trim() || null,
        content,
        cover_image_url: coverUrl,
        post_type: postType,
        category_id: categoryId,
        status: nextStatus,
        featured,
        reading_minutes: readingMinutes,
        published_at:
          nextStatus === "published"
            ? existing?.published_at ?? new Date().toISOString()
            : null,
        author_id: userId,
      };

      let id = postId;
      if (isNew) {
        const { data, error } = await supabase
          .from("posts")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from("posts").update(payload).eq("id", postId!);
        if (error) throw error;
      }

      // sync tags
      if (id) {
        await supabase.from("post_tags").delete().eq("post_id", id);
        if (selectedTags.length) {
          const rows = selectedTags.map((tag_id) => ({ post_id: id, tag_id }));
          const { error: tErr } = await supabase.from("post_tags").insert(rows);
          if (tErr) console.warn("Tag sync warning:", tErr.message);
        }
      }

      toast.success(publish ? "Published" : "Saved as draft");
      qc.invalidateQueries({ queryKey: ["admin", "posts"] });
      qc.invalidateQueries({ queryKey: ["admin", "post", id] });
      if (isNew && id) navigate({ to: "/admin/posts/$id", params: { id } });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Save failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!postId) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) return toast.error(error.message);
    toast.success("Post deleted");
    qc.invalidateQueries({ queryKey: ["admin", "posts"] });
    navigate({ to: "/admin/posts" });
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-center" />

      <div className="flex items-center gap-3">
        <Link
          to="/admin/posts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Posts
        </Link>
      </div>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {isNew ? "New post" : "Edit post"}
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {title || "Untitled"}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {!isNew && (
            <button
              type="button"
              onClick={remove}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          )}
          <button
            type="button"
            disabled={loading}
            onClick={() => save(false)}
            className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Save draft
          </button>
          {isAdmin ? (
            <button
              type="button"
              disabled={loading}
              onClick={() => save(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background hover:opacity-90 disabled:opacity-50"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {status === "published" ? "Update published" : "Publish"}
            </button>
          ) : (
            <span
              title="Only admins can publish"
              className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground"
            >
              Admin required to publish
            </span>
          )}
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <Field label="Title">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-base"
              placeholder="A thoughtful, specific headline"
            />
          </Field>

          <Field label="Slug" hint="URL fragment, lowercase with dashes">
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
              placeholder="my-post-slug"
            />
          </Field>

          <Field label="Excerpt" hint="One- or two-sentence summary used on listings">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Content" hint="Markdown supported in rendering layer">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm leading-relaxed"
              placeholder="# Heading&#10;&#10;Start writing…"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {readingMinutes} min read
            </p>
          </Field>
        </div>

        <aside className="space-y-5">
          <Field label="Status">
            <div className="rounded-md border border-border bg-card px-3 py-2 text-sm capitalize">
              {status}
            </div>
          </Field>

          <Field label="Type">
            <select
              value={postType}
              onChange={(e) => setPostType(e.target.value as PostType)}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm capitalize"
            >
              {(["essay", "note", "opinion", "technical"] as PostType[]).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Category">
            <CategorySelect value={categoryId} onChange={setCategoryId} categories={categories} />
          </Field>

          <Field label="Tags">
            <TagPicker
              value={selectedTags}
              onChange={setSelectedTags}
              tags={tags}
              onCreate={createTag}
            />
          </Field>

          <Field label="Cover image">
            {coverUrl ? (
              <div className="space-y-2">
                <img
                  src={coverUrl}
                  alt="Cover"
                  className="aspect-video w-full rounded-md border border-border object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverUrl(null)}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-6 text-sm text-muted-foreground hover:border-foreground/30">
                {uploading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploading ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void uploadCover(f);
                  }}
                />
              </label>
            )}
          </Field>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={featured}
              onChange={(e) => setFeatured(e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            Feature on home
          </label>
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium">{label}</label>
        {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
