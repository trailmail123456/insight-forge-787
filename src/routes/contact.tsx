import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Knowledge Labs" },
      { name: "description", content: "Get in touch with Knowledge Labs." },
      { property: "og:title", content: "Contact — Knowledge Labs" },
      { property: "og:description", content: "Get in touch with Knowledge Labs." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <div className="container-prose py-16 md:py-24">
      <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Contact</p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight md:text-5xl">
        Get in touch.
      </h1>
      <p className="mt-4 text-pretty leading-relaxed text-muted-foreground">
        Questions, corrections, or collaboration ideas — send a note.
      </p>

      <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Name</label>
          <input className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-ring focus:ring-2" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Email</label>
          <input type="email" className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-ring focus:ring-2" />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">Message</label>
          <textarea rows={6} className="w-full rounded-md border border-border bg-background px-3.5 py-2.5 text-sm outline-none ring-ring focus:ring-2" />
        </div>
        <button className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90">
          Send message
        </button>
      </form>
    </div>
  );
}
