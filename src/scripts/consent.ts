/**
 * ANALÍTICA CON CONSENTIMIENTO
 * ----------------------------
 * Google Analytics 4 no se descarga hasta que el visitante acepta. Si
 * rechaza, no se carga nada; si acepta y luego cambia de idea (enlace
 * «Preferencias de cookies» del pie), se desactiva y se borran sus cookies.
 *
 * La decisión se guarda 12 meses en este navegador. Pasado ese tiempo se
 * vuelve a preguntar, como recomienda la AEPD.
 *
 * `track()` es la única puerta para medir eventos: si no hay consentimiento
 * o no hay Analytics, no hace nada.
 */

type Choice = 'granted' | 'denied';
type Gtag = (...args: unknown[]) => void;

const KEY = 'dpl-consent';
const YEAR = 365 * 24 * 60 * 60 * 1000;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

function read(): Choice | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const { v, t } = JSON.parse(raw) as { v: Choice; t: number };
    return Date.now() - t < YEAR ? v : null;
  } catch {
    return null;
  }
}

function save(v: Choice): void {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v, t: Date.now() }));
  } catch {
    /* sin almacenamiento se volverá a preguntar en la próxima visita */
  }
}

function loadGA(id: string): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = false;
  if (window.gtag) return;
  window.dataLayer = window.dataLayer ?? [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.append(s);
}

/** Retirar el consentimiento: se apaga GA y se borran sus cookies */
function unloadGA(id: string): void {
  (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = true;
  const host = location.hostname.replace(/^www\./, '');
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0]!.trim();
    if (!name.startsWith('_ga')) return;
    for (const domain of ['', `; domain=.${host}`, `; domain=${host}`]) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain}`;
    }
  });
}

let enabled = false;

export function track(name: string, params: Record<string, unknown> = {}): void {
  if (enabled) window.gtag?.('event', name, params);
}

export function initConsent(): void {
  const id = document.documentElement.dataset.ga;
  if (!id) return;

  const banner = document.querySelector<HTMLElement>('[data-consent]');

  const show = (): void => {
    if (!banner) return;
    banner.hidden = false;
    requestAnimationFrame(() => banner.classList.add('is-on'));
  };
  const hide = (): void => {
    if (!banner) return;
    banner.classList.remove('is-on');
    window.setTimeout(() => {
      banner.hidden = true;
    }, 700);
  };

  const apply = (v: Choice): void => {
    enabled = v === 'granted';
    if (enabled) loadGA(id);
    else unloadGA(id);
  };

  const stored = read();
  if (stored) apply(stored);
  // Sin decisión: se pregunta cuando ya ha amanecido, no encima del preloader
  else window.setTimeout(show, document.getElementById('preloader') ? 3200 : 900);

  banner?.querySelectorAll<HTMLButtonElement>('[data-consent-choice]').forEach((b) =>
    b.addEventListener('click', () => {
      const v = b.dataset.consentChoice as Choice;
      save(v);
      apply(v);
      hide();
    }),
  );

  document.querySelectorAll<HTMLElement>('[data-consent-open]').forEach((b) =>
    b.addEventListener('click', (e) => {
      e.preventDefault();
      show();
    }),
  );

  /* — Lo que importa medir: cuándo alguien quiere trabajar contigo — */
  document.addEventListener('click', (e) => {
    const a = (e.target as Element | null)?.closest?.('a');
    if (!a) return;
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('mailto:')) track('contact_email', { location: a.closest('section, footer')?.id || 'footer' });
    else if (a.classList.contains('btn')) track('cta_click', { label: a.textContent?.trim().slice(0, 60), href });
    else if (a.rel.includes('me')) track('social_click', { network: a.textContent?.trim().slice(0, 30) });
  });
}
