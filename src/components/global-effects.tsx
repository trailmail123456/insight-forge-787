import { useEffect } from "react";

/**
 * Global UX effects: scroll reveal, animated counters, trailing cursor.
 * Mounts once at the root. All effects are scoped to opt-in elements
 * (.reveal, [data-count]) and respect reduced-motion / coarse pointer.
 */
export function GlobalEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Scroll reveal ----
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            setTimeout(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            }, i * 55);
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12 },
    );

    const initReveals = () => {
      document.querySelectorAll<HTMLElement>(".reveal:not([data-reveal-init])").forEach((el) => {
        el.dataset.revealInit = "1";
        if (reduced) {
          el.style.opacity = "1";
          return;
        }
        el.style.opacity = "0";
        el.style.transform = "translateY(26px)";
        el.style.transition = "opacity .55s ease, transform .55s cubic-bezier(.4,0,.2,1)";
        revealObserver.observe(el);
      });
    };

    // ---- Counters ----
    const animateCount = (el: HTMLElement, target: number, duration = 1800) => {
      const isK = target >= 1000;
      const display = isK ? target / 1000 : target;
      const start = performance.now();
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - t, 4);
        const cur = ease * display;
        el.textContent = isK
          ? (cur < 10 ? cur.toFixed(1) : String(Math.floor(cur))) + "K"
          : String(Math.floor(cur));
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = isK ? display + "K" : String(target);
      };
      requestAnimationFrame(tick);
    };

    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            animateCount(el, Number(el.dataset.count));
            counterObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.5 },
    );

    const initCounters = () => {
      document.querySelectorAll<HTMLElement>("[data-count]:not([data-count-init])").forEach((el) => {
        el.dataset.countInit = "1";
        if (reduced) {
          const n = Number(el.dataset.count);
          el.textContent = n >= 1000 ? (n / 1000) + "K" : String(n);
          return;
        }
        el.textContent = "0";
        counterObserver.observe(el);
      });
    };

    initReveals();
    initCounters();
    const mo = new MutationObserver(() => { initReveals(); initCounters(); });
    mo.observe(document.body, { childList: true, subtree: true });

    // ---- Trailing cursor (desktop) ----
    let cleanupCursor: (() => void) | null = null;
    if (!reduced && window.matchMedia("(pointer:fine)").matches) {
      const dot = document.createElement("div");
      dot.style.cssText = `
        position:fixed;width:7px;height:7px;border-radius:50%;
        background:#7C3AED;pointer-events:none;z-index:99999;
        mix-blend-mode:screen;transition:opacity .3s;opacity:0;
      `;
      document.body.appendChild(dot);
      let cx = 0, cy = 0, tx = 0, ty = 0, raf = 0;
      const onMove = (e: MouseEvent) => {
        tx = e.clientX - 3.5;
        ty = e.clientY - 3.5;
        dot.style.opacity = "1";
      };
      const onLeave = () => { dot.style.opacity = "0"; };
      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseleave", onLeave);
      const loop = () => {
        cx += (tx - cx) * 0.18;
        cy += (ty - cy) * 0.18;
        dot.style.left = cx + "px";
        dot.style.top = cy + "px";
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      cleanupCursor = () => {
        cancelAnimationFrame(raf);
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseleave", onLeave);
        dot.remove();
      };
    }

    return () => {
      mo.disconnect();
      revealObserver.disconnect();
      counterObserver.disconnect();
      cleanupCursor?.();
    };
  }, []);

  return null;
}
