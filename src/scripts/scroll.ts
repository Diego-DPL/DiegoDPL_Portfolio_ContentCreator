/**
 * REVELADOS DE SCROLL
 * -------------------
 * Un único IntersectionObserver gobierna todo lo que aparece al bajar.
 * El estado inicial (opacidad 0, desenfoque, máscara) vive en CSS, así que
 * no hay parpadeo si el JS tarda: la web se ve entera sin scripts.
 *
 * Marcado disponible:
 *   data-reveal            → sube y enfoca
 *   data-reveal="mask"     → se descubre como una cortina
 *   data-reveal="line"     → una línea que se dibuja
 *   data-split="words"     → texto que emerge palabra a palabra
 *   data-reveal-once="false" → se repite cada vez que entra en pantalla
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initReveals(root: ParentNode = document): void {
  // Lo que vive dentro del carril horizontal se revela aparte (ver main.ts):
  // un IntersectionObserver no es fiable dentro de un contenedor que se
  // desplaza en X dentro de una sección anclada.
  const targets = Array.from(
    root.querySelectorAll<HTMLElement>('[data-reveal], [data-split]'),
  ).filter((el) => !el.closest('[data-rail-track]'));
  if (!targets.length) return;

  if (REDUCED) {
    targets.forEach((el) => el.classList.add('is-in'));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          el.classList.add('is-in');
          if (el.dataset.revealOnce !== 'false') io.unobserve(el);
        } else if (el.dataset.revealOnce === 'false') {
          el.classList.remove('is-in');
        }
      }
    },
    { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
  );

  targets.forEach((el) => io.observe(el));
}

/**
 * CONTADORES
 * Los números del media kit suben desde cero cuando entran en pantalla.
 */
export function initCounters(root: ParentNode = document): void {
  const nodes = root.querySelectorAll<HTMLElement>('[data-count]');
  if (!nodes.length) return;

  const render = (el: HTMLElement, value: number): void => {
    const decimals = Number(el.dataset.decimals ?? 0);
    el.textContent = value.toLocaleString('es-ES', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  };

  if (REDUCED) {
    nodes.forEach((el) => render(el, Number(el.dataset.count)));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        io.unobserve(el);

        const target = Number(el.dataset.count);
        const duration = 1600;
        const start = performance.now();

        const step = (now: number): void => {
          const p = Math.min((now - start) / duration, 1);
          // easeOutExpo: arranca rápido y se posa, como el polvo
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          render(el, target * eased);
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    },
    { threshold: 0.4 },
  );

  nodes.forEach((el) => io.observe(el));
}

/**
 * MARQUESINA
 * Se desplaza sola y acelera con la velocidad del scroll.
 */
export function initMarquees(root: ParentNode = document): void {
  const marquees = root.querySelectorAll<HTMLElement>('[data-marquee]');
  if (!marquees.length || REDUCED) return;

  marquees.forEach((el) => {
    const track = el.querySelector<HTMLElement>('.marquee');
    if (!track) return;

    const base = Number(el.dataset.marqueeSpeed ?? 0.45);
    const dir = el.dataset.marqueeDir === 'right' ? 1 : -1;
    const first = track.firstElementChild as HTMLElement | null;
    if (!first) return;

    let offset = 0;
    let boost = 0;
    let lastY = window.scrollY;

    window.addEventListener(
      'scroll',
      () => {
        const y = window.scrollY;
        boost = Math.min(Math.abs(y - lastY) / 8, 6);
        lastY = y;
      },
      { passive: true },
    );

    const tick = (): void => {
      const span = first.offsetWidth;
      if (span > 0) {
        offset += (base + boost) * dir;
        if (offset <= -span) offset += span;
        if (offset >= 0 && dir === 1) offset -= span;
        track.style.transform = `translate3d(${offset}px, 0, 0)`;
      }
      boost *= 0.92;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}
