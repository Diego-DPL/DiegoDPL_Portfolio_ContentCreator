/**
 * EL HORIZONTE EN MOVIMIENTO
 * --------------------------
 *   · Cada capa de dunas se desplaza según su profundidad (ratón y scroll):
 *     las cercanas mucho, las lejanas casi nada. Eso da la distancia.
 *   · Al bajar, el sol se hunde y cae la noche sobre el paisaje.
 *   · El corredor avanza por la cresta, pegado a su curva exacta. Corre
 *     solo, despacio, y el scroll le empuja un poco más.
 */
import { gsap } from 'gsap';

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initHorizon(): void {
  const root = document.querySelector<HTMLElement>('[data-horizon]');
  const svg = root?.querySelector<SVGSVGElement>('[data-horizon-svg]');
  if (!root || !svg) return;

  const hero = root.closest<HTMLElement>('[data-hero]') ?? root;
  const layers = Array.from(svg.querySelectorAll<SVGGElement>('[data-hz-layer]'));
  const sun = svg.querySelector<SVGGElement>('[data-hz-sun]');
  const dusk = svg.querySelector<SVGRectElement>('[data-hz-dusk]');
  const runner = svg.querySelector<SVGGElement>('[data-hz-runner]');
  const path = svg.querySelector<SVGPathElement>('[data-hz-path]');

  /* — Encuadre: en vertical el sol tiene que seguir dentro del plano — */
  const portrait = window.matchMedia('(max-aspect-ratio: 1/1)');
  const frame = (): void => {
    svg.setAttribute('preserveAspectRatio', portrait.matches ? 'xMaxYMax slice' : 'xMidYMax slice');
  };
  frame();
  portrait.addEventListener('change', frame);

  /* — Corredor: su x avanza, su y la dicta la cresta — */
  const total = path?.getTotalLength() ?? 0;
  // La cresta empieza en x=-120: buscamos la longitud de cada x una vez
  const lookup: Array<{ x: number; y: number }> = [];
  if (path && total) {
    for (let l = 0; l <= total; l += 4) {
      const p = path.getPointAtLength(l);
      lookup.push({ x: p.x, y: p.y });
    }
  }
  const yAt = (x: number): number => {
    if (!lookup.length) return 690;
    let lo = 0;
    let hi = lookup.length - 1;
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1;
      if (lookup[mid]!.x < x) lo = mid;
      else hi = mid;
    }
    const a = lookup[lo]!;
    const b = lookup[hi]!;
    const k = b.x === a.x ? 0 : (x - a.x) / (b.x - a.x);
    return a.y + (b.y - a.y) * k;
  };

  const START = 760;
  const END = 1540;
  let runX = 930;
  let scrollPush = 0;

  const placeRunner = (): void => {
    if (!runner) return;
    const x = runX + scrollPush;
    const y = yAt(x);
    // Se inclina con la pendiente: sube encorvado, baja erguido
    const slope = Math.atan2(yAt(x + 6) - y, 6) * (180 / Math.PI) * 0.5;
    runner.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${slope.toFixed(1)})`);
    // Al llegar al borde se funde, y vuelve a aparecer lejos: otro día, otra salida
    const fade = Math.min(1, (x - START) / 60, (END - x) / 60);
    runner.style.opacity = String(Math.max(0, fade));
  };
  placeRunner();

  if (REDUCED) return;

  /* — Ratón: cada capa se mueve según su profundidad — */
  const mouse = { x: 0, y: 0 };
  const eased = { x: 0, y: 0 };
  const fine = window.matchMedia('(pointer: fine)').matches;
  if (fine) {
    window.addEventListener(
      'pointermove',
      (e) => {
        mouse.x = e.clientX / window.innerWidth - 0.5;
        mouse.y = e.clientY / window.innerHeight - 0.5;
      },
      { passive: true },
    );
  }

  /* — Scroll: el sol se pone, la noche cae, las dunas se levantan — */
  const state = { p: 0 };
  gsap.to(state, {
    p: 1,
    ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.8 },
  });

  let visible = true;
  new IntersectionObserver(([entry]) => {
    visible = !!entry?.isIntersecting;
    // La calima (SMIL) y el corredor siguen animándose fuera de pantalla si no se paran
    if (visible) svg.unpauseAnimations();
    else svg.pauseAnimations();
  }).observe(hero);

  let last = performance.now();
  const tick = (now: number): void => {
    const dt = Math.min(now - last, 64);
    last = now;

    if (visible && !document.hidden) {
      eased.x += (mouse.x - eased.x) * 0.045;
      eased.y += (mouse.y - eased.y) * 0.045;

      const p = state.p;
      for (const layer of layers) {
        const depth = Number(layer.dataset.depth ?? 0);
        const tx = -eased.x * 46 * depth;
        const ty = -eased.y * 10 * depth - p * 150 * depth;
        layer.setAttribute('transform', `translate(${tx.toFixed(2)} ${ty.toFixed(2)})`);
      }
      if (sun) {
        sun.setAttribute('transform', `translate(${(-eased.x * 3).toFixed(2)} ${(p * 90).toFixed(2)})`);
        sun.style.opacity = String(1 - p * 0.55);
      }
      if (dusk) dusk.setAttribute('opacity', (p * 0.72).toFixed(3));

      // ~1 unidad de paisaje por cada 90 ms: un trote lejano, sin prisa
      runX += dt / 90;
      scrollPush = p * 140;
      if (runX + scrollPush > END) runX = START - scrollPush;
      placeRunner();
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}
