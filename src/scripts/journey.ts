/**
 * EL RECORRIDO — la página como maratón
 * Mapea el scroll a 0 → 42,195 km y nombra el tramo en el que estás.
 */
const MARATHON = 42.195;

export function initJourney(): void {
  const el = document.querySelector<HTMLElement>('[data-journey]');
  const chapters = Array.from(document.querySelectorAll<HTMLElement>('[data-chapter]'));
  if (!el || !chapters.length) {
    el?.remove();
    return;
  }

  const trail = el.querySelector<HTMLElement>('[data-journey-trail]');
  const runner = el.querySelector<HTMLElement>('[data-journey-runner]');
  const km = el.querySelector<HTMLElement>('[data-journey-km]');
  const label = el.querySelector<HTMLElement>('[data-journey-chapter]');
  const track = runner?.parentElement;
  const goal = el.dataset.goal ?? 'Meta';

  const fmt = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

  let current = '';
  let swapTimer = 0;
  const setChapter = (name: string): void => {
    if (!label || name === current) return;
    current = name;
    label.classList.add('is-changing');
    clearTimeout(swapTimer);
    swapTimer = window.setTimeout(() => {
      label.textContent = name;
      label.classList.remove('is-changing');
    }, 380);
  };

  // El tramo es la sección que cruza el centro de la pantalla
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) setChapter((entry.target as HTMLElement).dataset.chapter ?? '');
      }
    },
    { rootMargin: '-50% 0px -50% 0px' },
  );
  chapters.forEach((c) => io.observe(c));

  let shown = -1;
  let raf = 0;
  const update = (): void => {
    raf = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;

    // Aparece al salir de la primera pantalla: el hero ya tiene su propio indicador
    el.classList.toggle('is-on', window.scrollY > window.innerHeight * 0.35);

    const length = track?.clientHeight ?? 0;
    if (trail) trail.style.transform = `scaleY(${p})`;
    if (runner) runner.style.transform = `translate3d(0, ${(p * length).toFixed(1)}px, 0)`;

    const value = Math.round(p * MARATHON * 10);
    if (value !== shown && km) {
      shown = value;
      km.textContent = p >= 0.998 ? '42,195' : fmt.format(value / 10).padStart(4, '0');
    }
    if (p >= 0.998) setChapter(goal);
    else if (current === goal) {
      const mid = chapters.find((c) => {
        const r = c.getBoundingClientRect();
        return r.top <= window.innerHeight / 2 && r.bottom >= window.innerHeight / 2;
      });
      if (mid) setChapter(mid.dataset.chapter ?? '');
    }
  };

  const schedule = (): void => {
    if (!raf) raf = requestAnimationFrame(update);
  };
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  update();
}
