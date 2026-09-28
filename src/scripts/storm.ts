/**
 * LA RÁFAGA — transición entre páginas
 * ------------------------------------
 * Al pulsar un enlace interno, un frente de arena cruza la pantalla de
 * izquierda a derecha (la dirección del viento en todo el sitio). Cuando la
 * cubre, se navega. La página nueva arranca cubierta (lo decide un script en
 * el <head>, antes de pintar nada) y la ráfaga sigue su camino hacia la
 * derecha, descubriéndola. Parece una sola ráfaga que atraviesa dos páginas.
 *
 * Sin JavaScript, o con movimiento reducido, los enlaces navegan normal.
 */

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const STORM_KEY = 'dpl-storm';

/** Lo que se lee dentro de la ráfaga, según a dónde vas */
function labelFor(url: URL, lang: string): string {
  const en = lang === 'en';
  const path = url.pathname.replace(/\/+$/, '/') || '/';
  if (path === '/') return 'El camino';
  if (path === '/en/') return 'The road';
  if (path.startsWith('/diario/') && path !== '/diario/') return en ? 'Journal' : 'Diario';
  if (path.startsWith('/diario')) return en ? 'Journal' : 'Notas del camino';
  if (path.startsWith('/media-kit')) return en ? 'Brands' : 'Para marcas';
  return '';
}

function isInternal(a: HTMLAnchorElement, e: MouseEvent): URL | null {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return null;
  if (a.target && a.target !== '_self') return null;
  if (a.hasAttribute('download') || a.dataset.noStorm !== undefined) return null;

  const url = new URL(a.href, location.href);
  if (url.origin !== location.origin) return null;
  // Archivos (el PDF del media kit, el certificado…) no son páginas
  if (/\.[a-z0-9]{2,5}$/i.test(url.pathname) && !url.pathname.endsWith('.html')) return null;
  // Un ancla en esta misma página la gestiona el scroll suave
  if (url.pathname === location.pathname && url.search === location.search) return null;
  return url;
}

export function initStorm(): void {
  const storm = document.getElementById('sandstorm');
  const label = storm?.querySelector<HTMLElement>('[data-storm-label]');
  const root = document.documentElement;
  if (!storm) return;

  /* — Llegada: la ráfaga sigue su camino y descubre la página — */
  if (root.classList.contains('is-arriving')) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        storm.classList.add('is-passing');
        (window as unknown as { dustGust?: (p?: number) => void }).dustGust?.(1);
        window.setTimeout(() => {
          root.classList.remove('is-arriving');
          storm.classList.remove('is-passing');
        }, 1100);
      });
    });
  }

  // Volver atrás puede restaurar la página tal como se fue: cubierta
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) {
      storm.classList.remove('is-covering', 'is-passing');
      root.classList.remove('is-arriving');
    }
  });

  if (REDUCED) return;

  let leaving = false;
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a');
    if (!a || leaving) return;
    const url = isInternal(a as HTMLAnchorElement, e);
    if (!url) return;

    e.preventDefault();
    leaving = true;

    if (label) label.textContent = labelFor(url, root.lang);
    storm.classList.add('is-covering');
    (window as unknown as { dustGust?: (p?: number) => void }).dustGust?.(1);

    try {
      sessionStorage.setItem(STORM_KEY, '1');
    } catch {
      /* sin almacenamiento, la página nueva simplemente no hará la llegada */
    }

    window.setTimeout(() => {
      location.href = url.href;
      // Si la navegación no ocurre (p. ej. se cancela), la ráfaga no puede quedarse puesta
      window.setTimeout(() => {
        leaving = false;
        storm.classList.remove('is-covering');
      }, 4000);
    }, 820);
  });
}
