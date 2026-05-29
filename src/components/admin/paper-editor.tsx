import { useEffect, useState } from "react";
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

type Status = "draft" | "published";

export function PaperEditor({
  paperId,
  isAdmin,
  userId,
}: {
  paperId?: string;
  isAdmin: boolean;
  userId: string;
}) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isNew = !paperId;
  const categories = useCategories();
  const { tags, refresh: refreshTags } = useTags();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [abstract, setAbstract] = useState("");
  const [authors, setAuthors] = useState("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [featured, setFeatured] = useState(false);
  const [status, setStatus] = useState<Status>("draft");
  const [coverUrl, setCoverUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [externalUrl, setExternalUrl] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const { data: existing } = useQuery({
    queryKey: ["admin", "paper", paperId],
    queryFn: async () => {
      if (!paperId) return null;
      const { data, error } = await supabase
        .from("papers")
        .select("*, paper_tags(tag_id)")
        .eq("id", paperId)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!paperId,
  });

  useEffect(() => {
    if (!existing) return;
    setTitle(existing.title);
    setSlug(existing.slug);
    setAbstract(existing.abstract ?? "");
    setAuthors((existing.authors ?? []).join(", "));
    setCategoryId(existing.category_id);
    setFeatured(existing.featured);
    setStatus(existing.status as Status);
    setCoverUrl(existing.cover_image_url);
    setPdfUrl(existing.pdf_url);
    setExternalUrl(existing.external_url ?? "");
    setSelectedTags(
      (existing.paper_tags as { tag_id: string }[] | null)?.map((t) => t.tag_id) ?? [],
    );
    setSlugTouched(true);
  }, [existing]);

  useEffect(() => {
    if (!slugTouched && isNew) setSlug(slugify(title));
  }, [title, slugTouched, isNew]);

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

  const upload = async (
    bucket: "cover-images" | "paper-pdfs",
    file: File,
    set: (url: string) => void,
    setBusy: (b: boolean) => void,
  ) => {
    setBusy(true);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await supabase.storage.from(bucket).upload(path, file, {
        cacheControl: "3600",
        upsert: false,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      set(data.publicUrl);
      toast.success("Uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  };

  const save = async (publish: boolean) => {
    if (!title.trim()) return toast.error("Title is required");
    if (!slug.trim()) return toast.error("Slug is required");
    setLoading(true);
    try {
      const nextStatus: Status = publish ? "published" : "draft";
      const authorList = authors
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean);
      const payload = {
        title: title.trim(),
        slug: slug.trim(),
        abstract: abstract.trim() || null,
        authors: authorList,
        category_id: categoryId,
        cover_image_url: coverUrl,
        pdf_url: pdfUrl,
        external_url: externalUrl.trim() || null,
        featured,
        status: nextStatus,
        published_at:
          nextStatus === "published"
            ? existing?.published_at ?? new Date().toISOString()
            : null,
        uploader_id: userId,
      };

      let id = paperId;
      if (isNew) {
        const { data, error } = await supabase
          .from("papers")
          .insert(payload)
          .select("id")
          .single();
        if (error) throw error;
        id = data.id;
      } else {
        const { error } = await supabase.from("papers").update(payload).eq("id", paperId!);
        if (error) throw error;
      }

      if (id) {
        await supabase.from("paper_tags").delete().eq("paper_id", id);
        if (selectedTags.length) {
          const rows = selectedTags.map((tag_id) => ({ paper_id: id, tag_id }));
          const { error: tErr } = await supabase.from("paper_tags").insert(rows);
          if (tErr) console.warn("Tag sync warning:", tErr.message);
        }
      }

      toast.success(publish ? "Published" : "Saved as draft");
      qc.invalidateQueries({ queryKey: ["admin", "papers"] });
      qc.invalidateQueries({ queryKey: ["admin", "paper", id] });
      if (isNew && id) navigate({ to: "/admin/papers/$id", params: { id } });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  const remove = async () => {
    if (!paperId) return;
    if (!confirm("Delete this paper? This cannot be undone.")) return;
    const { error } = await supabase.from("papers").delete().eq("id", paperId);
    if (error) return toast.error(error.message);
    toast.success("Paper deleted");
    qc.invalidateQueries({ queryKey: ["admin", "papers"] });
    navigate({ to: "/admin/papers" });
  };

  return (
    <div className="space-y-6">
      <Toaster richColors position="top-center" />

      <Link
        to="/admin/papers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Papers
      </Link>

      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {isNew ? "New paper" : "Edit paper"}
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
            <span className="rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground">
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
            />
          </Field>

          <Field label="Slug">
            <input
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugTouched(true);
              }}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 font-mono text-sm"
            />
          </Field>

          <Field label="Authors" hint="Comma-separated">
            <input
              value={authors}
              onChange={(e) => setAuthors(e.target.value)}
              placeholder="Jane Doe, John Smith"
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Abstract">
            <textarea
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              rows={6}
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm leading-relaxed"
            />
          </Field>

          <Field label="External URL" hint="arXiv, DOI, or publisher link">
            <input
              value={externalUrl}
              onChange={(e) => setExternalUrl(e.target.value)}
              placeholder="https://arxiv.org/abs/…"
              className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </Field>

          <Field label="PDF">
            {pdfUrl ? (
              <div className="flex items-center justify-between rounded-md border border-border bg-card px-3 py-2 text-sm">
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="truncate text-foreground hover:underline"
                >
                  {pdfUrl.split("/").pop()}
                </a>
                <button
                  type="button"
                  onClick={() => setPdfUrl(null)}
                  className="ml-3 text-xs text-muted-foreground hover:text-destructive"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-card px-3 py-4 text-sm text-muted-foreground hover:border-foreground/30">
                {uploadingPdf ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploadingPdf ? "Uploading…" : "Upload PDF"}
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload("paper-pdfs", f, setPdfUrl, setUploadingPdf);
                  }}
                />
              </label>
            )}
          </Field>
        </div>

        <aside className="space-y-5">
          <Field label="Status">
            <div className="rounded-md border border-border bg-card px-3 py-2 text-sm capitalize">
              {status}
            </div>
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
                {uploadingCover ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="h-4 w-4" />
                )}
                {uploadingCover ? "Uploading…" : "Upload image"}
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) void upload("cover-images", f, setCoverUrl, setUploadingCover);
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
