import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Category = { id: string; name: string; slug: string };
export type Tag = { id: string; name: string; slug: string };

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  useEffect(() => {
    supabase
      .from("categories")
      .select("id, name, slug")
      .order("name")
      .then(({ data }) => setCategories(data ?? []));
  }, []);
  return categories;
}

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const refresh = async () => {
    const { data } = await supabase.from("tags").select("id, name, slug").order("name");
    setTags(data ?? []);
  };
  useEffect(() => { void refresh(); }, []);
  return { tags, refresh };
}

export function CategorySelect({
  value,
  onChange,
  categories,
}: {
  value: string | null;
  onChange: (v: string | null) => void;
  categories: Category[];
}) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className="block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
    >
      <option value="">— Uncategorized —</option>
      {categories.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

export function TagPicker({
  value,
  onChange,
  tags,
  onCreate,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  tags: Tag[];
  onCreate: (name: string) => Promise<Tag | null>;
}) {
  const [input, setInput] = useState("");
  const selected = new Set(value);

  const toggle = (id: string) =>
    onChange(selected.has(id) ? value.filter((v) => v !== id) : [...value, id]);

  const handleCreate = async () => {
    const name = input.trim();
    if (!name) return;
    const created = await onCreate(name);
    if (created && !selected.has(created.id)) onChange([...value, created.id]);
    setInput("");
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t) => {
          const active = selected.has(t.id);
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => toggle(t.id)}
              className={`rounded-full border px-2.5 py-1 text-xs transition-colors ${
                active
                  ? "border-foreground bg-foreground text-background"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              #{t.name}
            </button>
          );
        })}
        {tags.length === 0 && (
          <p className="text-xs text-muted-foreground">No tags yet — create one below.</p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              void handleCreate();
            }
          }}
          placeholder="New tag name…"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
        >
          Add tag
        </button>
      </div>
    </div>
  );
}
