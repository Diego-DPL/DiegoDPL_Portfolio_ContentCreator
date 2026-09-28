import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { initDust } from './dust';
import { initReveals, initCounters, initMarquees } from './scroll';
import { initHorizon } from './horizon';
import { initJourney } from './journey';
import { initWind } from './wind';
import { initStorm } from './storm';
import { initConsent, track } from './consent';

gsap.registerPlugin(ScrollTrigger);
// En móvil la barra del navegador aparece y desaparece al hacer scroll y
// cambia el alto de la ventana: sin esto ScrollTrigger recalcula los
// anclajes a mitad de gesto y la sección fija del desierto da saltos.
ScrollTrigger.config({ ignoreMobileResize: true });

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ================================================================== */
/* SCROLL SUAVE                                                        */
/* ================================================================== */

function initSmoothScroll(): Lenis | null {
  if (REDUCED) return null;

  const lenis = new Lenis({
    lerp: 0.085,
    wheelMultiplier: 1,
    touchMultiplier: 1.6,
  });

  // En desarrollo queda accesible para poder posicionar la página a mano
  if (import.meta.env.DEV) {
    (window as unknown as { lenis?: Lenis }).lenis = lenis;
  }

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Anclas internas con easing propio
  document.querySelectorAll<HTMLAnchorElement>('a[href*="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || !url.hash) return;
      const target = document.querySelector(url.hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.5 });
      history.pushState(null, '', url.hash);
    });
  });

  return lenis;
}

/* ================================================================== */
/* PRELOADER — el polvo se posa y entonces empieza el viaje            */
/* ================================================================== */

function initPreloader(onDone: () => void): void {
  const el = document.getElementById('preloader');
  if (!el) {
    document.documentElement.classList.remove('is-loading');
    onDone();
    return;
  }

  const num = el.querySelector<HTMLElement>('[data-preload-num]');

  let done = false;
  const finish = (): void => {
    if (done) return;
    done = true;
    el.classList.add('is-done');
    document.documentElement.classList.remove('is-loading');
    window.setTimeout(() => el.remove(), 1100);
    onDone();
  };

  // Si llegas desde otra página del sitio, ya amaneció: nada de repetirlo
  if (REDUCED || document.documentElement.classList.contains('is-arriving')) {
    finish();
    return;
  }

  const duration = 2100;

  // Red de seguridad: requestAnimationFrame se congela en pestañas de fondo,
  // así que un temporizador garantiza que la web nunca se quede bloqueada
  // detrás del preloader.
  window.setTimeout(finish, duration + 900);

  const start = performance.now();
  const step = (now: number): void => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.style.setProperty('--p', eased.toFixed(3));
    // De 05:30 a 06:00: la media hora en la que ya estás en la calle y aún no hay nadie
    if (num) num.textContent = eased >= 1 ? '06:00' : `05:${String(30 + Math.floor(eased * 30)).padStart(2, '0')}`;
    if (p < 1) requestAnimationFrame(step);
    else window.setTimeout(finish, 220);
  };
  requestAnimationFrame(step);
}

/* ================================================================== */
/* CURSOR — un grano de polvo que te sigue                             */
/* ================================================================== */

function initCursor(): void {
  if (REDUCED || window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector<HTMLElement>('.cursor');
  const ring = cursor?.querySelector<HTMLElement>('.cursor__ring');
  const dot = cursor?.querySelector<HTMLElement>('.cursor__dot');
  if (!cursor || !ring || !dot) return;

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { ...mouse };

  window.addEventListener(
    'pointermove',
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      cursor.classList.add('is-active');
      dot.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0)`;
    },
    { passive: true },
  );

  document.addEventListener('pointerleave', () => cursor.classList.remove('is-active'));

  const tick = (): void => {
    ringPos.x += (mouse.x - ringPos.x) * 0.14;
    ringPos.y += (mouse.y - ringPos.y) * 0.14;
    ring.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  const hoverables = 'a, button, [data-cursor="grow"]';
  document.querySelectorAll<HTMLElement>(hoverables).forEach((el) => {
    el.addEventListener('pointerenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('pointerleave', () => cursor.classList.remove('is-hovering'));
  });
}

/* ================================================================== */
/* NAVEGACIÓN — se esconde al bajar, vuelve al subir                   */
/* ================================================================== */

function initNav(): void {
  const nav = document.querySelector<HTMLElement>('[data-nav]');
  if (!nav) return;

  let last = window.scrollY;
  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      nav.classList.toggle('is-scrolled', y > 40);
      if (y > last && y > 220) nav.classList.add('is-hidden');
      else nav.classList.remove('is-hidden');
      last = y;
    },
    { passive: true },
  );

  const toggle = document.querySelector<HTMLElement>('[data-menu-toggle]');
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  if (!toggle || !menu) return;

  const setOpen = (open: boolean): void => {
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('is-menu-open', open);
  };

  toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setOpen(false);
  });
}

/* ================================================================== */
/* COREOGRAFÍA DE SCROLL (GSAP)                                        */
/* ================================================================== */

function initChoreography(): void {
  if (REDUCED) return;

  /* — Hero: el título se hunde en el polvo al bajar — */
  const hero = document.querySelector<HTMLElement>('[data-hero]');
  if (hero) {
    const title = hero.querySelector<HTMLElement>('[data-hero-title]');
    const meta = hero.querySelectorAll<HTMLElement>('[data-hero-fade]');

    if (title) {
      gsap.to(title, {
        yPercent: -22,
        scale: 0.94,
        filter: 'blur(14px)',
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 },
      });
    }
    if (meta.length) {
      gsap.to(meta, {
        opacity: 0,
        y: -30,
        ease: 'none',
        scrollTrigger: { trigger: hero, start: 'top top', end: '55% top', scrub: 0.6 },
      });
    }
  }

  /* — Amanecer: el sol sube mientras cruzas la noche — */
  document.querySelectorAll<HTMLElement>('[data-dawn]').forEach((dawn) => {
    const sun = dawn.querySelector('[data-dawn-sun]');
    if (!sun) return;
    gsap.fromTo(
      sun,
      { yPercent: 55, scale: 0.8 },
      {
        yPercent: -35,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: dawn, start: 'top bottom', end: 'bottom top', scrub: 0.8 },
      },
    );
  });

  /* — Manifiesto: el texto se revela palabra a palabra con el scroll — */
  document.querySelectorAll<HTMLElement>('[data-split="scrub"]').forEach((el) => {
    const units = el.querySelectorAll<HTMLElement>('.split-unit');
    if (!units.length) return;
    gsap.set(units, { opacity: 0.06, filter: 'blur(5px)', y: '0.35em' });
    gsap.to(units, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      ease: 'none',
      stagger: 0.4,
      scrollTrigger: { trigger: el, start: 'top 78%', end: 'bottom 55%', scrub: 0.8 },
    });
  });

  /* — El desierto: se queda fijo y la frase se enfoca palabra a palabra —
     Va antes que el carril horizontal: los anclajes se calculan en el orden
     en que se crean, y este está más arriba en la página. */
  const desert = document.querySelector<HTMLElement>('[data-desert]');
  if (desert) {
    const media = desert.querySelector<HTMLElement>('.dst__media');
    const img = desert.querySelector<HTMLElement>('.dst__media img');
    const words = desert.querySelectorAll<HTMLElement>('[data-word]');
    const after = desert.querySelector<HTMLElement>('[data-desert-after]');

    // Al acercarte, la foto viene hacia ti
    if (media) {
      gsap.fromTo(
        media,
        { scale: 1.1 },
        {
          scale: 1,
          ease: 'none',
          scrollTrigger: { trigger: desert, start: 'top bottom', end: 'top top', scrub: 1 },
        },
      );
    }

    // GSAP escribe el transform en cada frame: una transición CSS sobre él lo emborronaría
    if (img) img.style.transition = 'clip-path 1.25s var(--ease-dust)';

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: desert,
        start: 'top top',
        end: '+=120%',
        pin: true,
        scrub: 1,
        anticipatePin: 1,
      },
    });
    // En móvil la figura sale diminuta: se acerca hacia ella en vez de al centro
    const narrow = window.matchMedia('(max-width: 899px)').matches;
    if (img) {
      if (narrow) img.style.transformOrigin = '40% 64%';
      tl.fromTo(
        img,
        { scale: narrow ? 1.5 : 1.12 },
        { scale: narrow ? 1.28 : 1, ease: 'none', duration: 5 },
        0,
      );
    }
    if (words.length) {
      tl.fromTo(
        words,
        { opacity: 0.08, filter: 'blur(10px)', y: '0.3em' },
        { opacity: 1, filter: 'blur(0px)', y: 0, ease: 'power2.out', duration: 1, stagger: 0.45 },
        0.2,
      );
    }
    if (after) tl.fromTo(after, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.8 }, '>-0.1');
  }

  /* — Galería horizontal anclada: el trabajo desfila lateralmente — */
  const rail = document.querySelector<HTMLElement>('[data-rail]');
  const railTrack = rail?.querySelector<HTMLElement>('[data-rail-track]');

  // Su contenido se revela en cascada cuando la sección entra: al desfilar
  // lateralmente ya llegan descubiertas, y el propio movimiento es la entrada.
  if (rail) {
    ScrollTrigger.create({
      trigger: rail,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        rail.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el, i) => {
          el.style.setProperty('--rv-delay', `${i * 60}ms`);
          el.classList.add('is-in');
        });
      },
    });
  }

  // matchMedia: si se redimensiona la ventana entre móvil y escritorio,
  // GSAP monta y desmonta el anclaje solo. Sin esto quedaría fijado al
  // tamaño que tuviera la ventana al cargar.
  if (rail && railTrack) {
    const mm = gsap.matchMedia();

    mm.add('(min-width: 900px)', () => {
      const distance = (): number => railTrack.scrollWidth - window.innerWidth;

      gsap.to(railTrack, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: rail,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.7,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Las tarjetas se inclinan un poco según su posición: profundidad real
      railTrack.querySelectorAll<HTMLElement>('[data-rail-item]').forEach((card, i) => {
        gsap.fromTo(
          card,
          { y: i % 2 === 0 ? 34 : -22 },
          {
            y: i % 2 === 0 ? -34 : 22,
            ease: 'none',
            scrollTrigger: {
              trigger: rail,
              start: 'top top',
              end: () => `+=${distance()}`,
              scrub: 1,
              invalidateOnRefresh: true,
            },
          },
        );
      });
    });
  }

  /* — Parallax suelto: cualquier elemento con data-parallax — */
  document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
    const strength = Number(el.dataset.parallax || 12);
    gsap.fromTo(
      el,
      { yPercent: strength },
      {
        yPercent: -strength,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
      },
    );
  });

  /* — Barras de audiencia del media kit — */
  document.querySelectorAll<HTMLElement>('[data-bar]').forEach((el) => {
    gsap.fromTo(
      el,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      },
    );
  });
}

/* ================================================================== */
/* BOTONES MAGNÉTICOS                                                  */
/* ================================================================== */

function initMagnetic(): void {
  if (REDUCED || window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    const strength = Number(el.dataset.magnetic || 0.32);

    el.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) * strength;
      const y = (e.clientY - (r.top + r.height / 2)) * strength;
      gsap.to(el, { x, y, duration: 0.5, ease: 'power3.out' });
    });

    el.addEventListener('pointerleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' });
    });
  });
}

/* ================================================================== */
/* FORMULARIO DE CONTACTO                                              */
/* ================================================================== */

function initContactForm(): void {
  const form = document.querySelector<HTMLFormElement>('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector<HTMLElement>('[data-form-status]');
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]');
  const key = form.dataset.accessKey ?? '';
  const endpoint = form.action;

  // Los textos vienen del marcado para que la versión en inglés no necesite
  // otra copia de esta función.
  const t = {
    sending: form.dataset.msgSending ?? 'Enviando…',
    ok: form.dataset.msgOk ?? 'Recibido. Te contesto en menos de 48 horas.',
    error: form.dataset.msgError ?? 'No se ha podido enviar. Escríbeme directamente por email.',
    mailto: form.dataset.msgMailto ?? 'Abriendo tu cliente de correo…',
  };

  const say = (message: string, kind: 'ok' | 'error' | 'busy'): void => {
    if (!status) return;
    status.textContent = message;
    status.dataset.kind = kind;
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Trampa para bots: una casilla oculta que sólo marcaría un robot. Si está
    // marcada, fingimos éxito y no enviamos nada. OJO: hay que mirar `checked`,
    // no `value` — una casilla siempre vale "on" aunque esté sin marcar, y eso
    // hacía que TODOS los envíos se tomaran por bots y no saliera ninguno.
    const honey = form.querySelector<HTMLInputElement>('input[name="botcheck"]');
    if (honey?.checked) {
      say(t.ok, 'ok');
      return;
    }

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const data = new FormData(form);

    // Sin clave configurada: caemos a un correo prerredactado
    if (!key) {
      const to = form.dataset.mailto ?? '';
      const subject = encodeURIComponent(`Colaboración — ${data.get('subject') ?? ''}`);
      const body = encodeURIComponent(
        `Nombre: ${data.get('name')}\nEmail: ${data.get('email')}\n` +
          `Marca: ${data.get('company') ?? '—'}\nPresupuesto: ${data.get('budget') ?? '—'}\n\n` +
          `${data.get('message')}`,
      );
      track('generate_lead', { method: 'mailto', subject: String(data.get('subject') ?? '') });
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      say(t.mailto, 'ok');
      return;
    }

    submit?.setAttribute('disabled', 'true');
    say(t.sending, 'busy');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: data,
      });
      const json = (await res.json()) as { success?: boolean };

      if (res.ok && json.success) {
        // El evento que más importa: una marca ha escrito
        track('generate_lead', { method: 'form', subject: String(data.get('subject') ?? '') });
        form.reset();
        say(t.ok, 'ok');
      } else {
        say(t.error, 'error');
      }
    } catch {
      say(t.error, 'error');
    } finally {
      submit?.removeAttribute('disabled');
    }
  });
}

/* ================================================================== */
/* ARRANQUE                                                            */
/* ================================================================== */

function boot(): void {
  const canvas = document.getElementById('dust-canvas') as HTMLCanvasElement | null;
  if (canvas) initDust(canvas);

  initSmoothScroll();
  initNav();
  initCursor();
  initMagnetic();
  initContactForm();
  initCounters();
  initMarquees();
  initJourney();
  initWind();
  initStorm();
  initConsent();

  initPreloader(() => {
    document.body.classList.add('is-ready');
    initReveals();
    initChoreography();
    initHorizon();
    ScrollTrigger.refresh();
    // El polvo se levanta al empezar el viaje
    (window as unknown as { dustGust?: (p?: number) => void }).dustGust?.(0.85);
  });

  // Las fuentes cambian métricas: recalculamos los anclajes cuando cargan
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
