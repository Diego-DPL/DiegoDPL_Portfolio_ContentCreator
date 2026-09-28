/**
 * EL POLVO
 * --------
 * El leitmotiv del sitio. Un sistema de partículas en canvas 2D que:
 *   · lo arrastra un viento lateral (el desierto nunca está quieto),
 *   · a ras de suelo corre una capa de arena más rápida, como en las dunas,
 *   · cada grano se estira en la dirección en la que viaja: arena, no estrellas,
 *   · se levanta cuando haces scroll rápido (una ráfaga),
 *   · se aparta del cursor,
 *   · cambia de color cuando entras en una sección de día o de noche.
 *
 * Está pensado para ser barato: sprites pre-renderizados, una sola pasada
 * de dibujo por frame, y se apaga solo si la pestaña no está visible.
 */

type Tone = { r: number; g: number; b: number };

interface Mote {
  x: number;
  y: number;
  /** profundidad 0.15 (lejos) → 1 (cerca). Gobierna tamaño, alfa y parallax */
  z: number;
  size: number;
  alpha: number;
  vx: number;
  vy: number;
  /** fase del bamboleo, para que ninguna partícula se mueva igual que otra */
  phase: number;
  spin: number;
  /** grano a ras de suelo: rápido, pequeño, vive en la franja inferior */
  ground: boolean;
  haze: boolean;
}

const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initDust(canvas: HTMLCanvasElement): void {
  if (REDUCED) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const BASE_COUNT = coarse ? 80 : 210;

  let width = 0;
  let height = 0;
  let dpr = 1;

  const motes: Mote[] = [];

  /* — Color activo, interpolado suavemente entre día y noche — */
  const tone: Tone = { r: 230, g: 190, b: 140 };
  const toneTarget: Tone = { ...tone };
  let sprite: HTMLCanvasElement | null = null;
  let spriteKey = '';

  /* — Estado de interacción — */
  let lastScrollY = window.scrollY;
  let gust = 0; // 0..1, cuánta ráfaga hay ahora mismo
  let gustDir = 0; // signo de la ráfaga: hacia dónde empuja el polvo
  let wind = 0; // deriva base, oscila muy lento
  const pointer = { x: -9999, y: -9999, active: false };
  let raf = 0;
  let running = true;
  let t = 0;

  /* ---------------------------------------------------------------- */
  /* Sprite: un disco con desvanecido radial, pintado una sola vez     */
  /* ---------------------------------------------------------------- */

  function buildSprite(): void {
    const key = `${Math.round(tone.r)}-${Math.round(tone.g)}-${Math.round(tone.b)}`;
    if (key === spriteKey && sprite) return;
    spriteKey = key;

    const s = 64;
    const c = document.createElement('canvas');
    c.width = s;
    c.height = s;
    const cx = c.getContext('2d');
    if (!cx) return;

    const g = cx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    const rgb = `${Math.round(tone.r)}, ${Math.round(tone.g)}, ${Math.round(tone.b)}`;
    // Caída muy suave: si el borde es duro, el polvo parece un cielo estrellado
    g.addColorStop(0, `rgba(${rgb}, 0.85)`);
    g.addColorStop(0.22, `rgba(${rgb}, 0.4)`);
    g.addColorStop(0.5, `rgba(${rgb}, 0.12)`);
    g.addColorStop(1, `rgba(${rgb}, 0)`);
    cx.fillStyle = g;
    cx.fillRect(0, 0, s, s);

    sprite = c;
  }

  /* ---------------------------------------------------------------- */
  /* Partículas                                                        */
  /* ---------------------------------------------------------------- */

  /** La franja de suelo: el cuarto inferior de la pantalla */
  const groundTop = (): number => height * 0.74;

  function spawn(seedY?: number): Mote {
    const z = 0.15 + Math.pow(Math.random(), 1.6) * 0.85;

    // Una de cada cinco partículas es "bruma": enorme y casi invisible.
    // Son las que hacen que el aire tenga cuerpo.
    const haze = Math.random() < 0.2;
    // Un tercio del resto es arena rasante, la que el viento peina sobre la duna
    const ground = !haze && Math.random() < 0.34;

    return {
      x: Math.random() * width,
      y: seedY ?? (ground ? groundTop() + Math.random() * (height - groundTop()) : Math.random() * height),
      z,
      size: haze
        ? (10 + Math.random() * 22) * z * dpr
        : (0.6 + Math.random() * (ground ? 1.4 : 2)) * z * dpr,
      alpha: haze
        ? (0.012 + Math.random() * 0.03) * z
        : (0.04 + Math.random() * (ground ? 0.22 : 0.16)) * z,
      // El viento sopla de izquierda a derecha, hacia donde se pone el sol
      vx: haze ? 0.04 + Math.random() * 0.08 : ground ? 0.5 + Math.random() * 0.9 : 0.08 + Math.random() * 0.22,
      vy: (Math.random() - 0.55) * (haze ? 0.04 : ground ? 0.05 : 0.1),
      phase: Math.random() * Math.PI * 2,
      spin: haze ? 0.05 + Math.random() * 0.15 : 0.15 + Math.random() * 0.5,
      ground,
      haze,
    };
  }

  function populate(): void {
    motes.length = 0;
    const count = Math.round(BASE_COUNT * Math.min(1.6, (width * height) / (1440 * 900 * dpr * dpr)));
    for (let i = 0; i < Math.max(40, count); i++) motes.push(spawn());
  }

  function resize(): void {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = Math.floor(window.innerWidth * dpr);
    height = Math.floor(window.innerHeight * dpr);
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    populate();
  }

  /* ---------------------------------------------------------------- */
  /* Bucle                                                             */
  /* ---------------------------------------------------------------- */

  function frame(): void {
    if (!running) return;
    t += 0.006;

    // El color persigue al del tono activo, sin saltos
    tone.r += (toneTarget.r - tone.r) * 0.05;
    tone.g += (toneTarget.g - tone.g) * 0.05;
    tone.b += (toneTarget.b - tone.b) * 0.05;
    buildSprite();

    // Viento base: sopla siempre hacia el mismo lado y respira en rachas
    wind = 0.12 + Math.sin(t * 0.7) * 0.1 + Math.max(0, Math.sin(t * 0.23)) * 0.16;

    // La ráfaga se disipa sola
    gust *= 0.94;

    ctx!.clearRect(0, 0, width, height);
    if (!sprite) {
      raf = requestAnimationFrame(frame);
      return;
    }

    const turbulence = 1 + gust * 5;
    const push = gust * gustDir * 7;
    const gTop = groundTop();

    for (let i = 0; i < motes.length; i++) {
      const m = motes[i]!;

      // Bamboleo individual: nadie flota igual
      m.phase += 0.008 * m.spin;
      const sway = Math.sin(m.phase) * 0.35 * m.z * turbulence;

      // La arena rasante acelera mucho más con las rachas que el aire de arriba
      const drift = m.ground ? m.vx * (1 + wind * 4 + gust * 6) : m.vx + wind * m.z;
      const dx = (drift + gust * 4 * m.z + sway) * dpr;
      const dy = (m.vy * turbulence - push * m.z * (m.ground ? 0.3 : 1)) * dpr;
      m.x += dx;
      m.y += dy;

      // El cursor aparta el polvo
      if (pointer.active) {
        const px = m.x - pointer.x;
        const py = m.y - pointer.y;
        const d2 = px * px + py * py;
        const radius = 150 * dpr;
        if (d2 < radius * radius && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const force = (1 - d / radius) * 2.2 * m.z;
          m.x += (px / d) * force;
          m.y += (py / d) * force;
        }
      }

      // Envolvente: el polvo nunca se agota
      const margin = 60 * dpr;
      if (m.x < -margin) m.x = width + margin;
      else if (m.x > width + margin) m.x = -margin;
      if (m.ground) {
        // La arena rasante no sube al cielo: rebota dentro de su franja
        if (m.y < gTop - margin) m.y = height;
        else if (m.y > height + margin) m.y = gTop;
      } else if (m.y < -margin) m.y = height + margin;
      else if (m.y > height + margin) m.y = -margin;

      const s = m.size * (1 + gust * 0.7);
      // Más densa cuanto más cerca del suelo
      const floor = m.ground ? 0.5 + ((m.y - gTop) / (height - gTop)) * 0.8 : 1;
      ctx!.globalAlpha = Math.min(1, m.alpha * floor * (1 + gust * 1.3));

      if (m.haze) {
        ctx!.drawImage(sprite, m.x - s, m.y - s, s * 2, s * 2);
      } else {
        // El grano se estira en la dirección del viaje: una estela, no un punto
        const speed = Math.hypot(dx, dy) / dpr;
        // Sólo la arena rasante se alarga de verdad; la del aire apenas,
        // o el cielo parece lluvia
        const stretch = m.ground ? 1 + Math.min(speed * 1.4, 6) : 1 + Math.min(speed * 0.6, 1.4);
        const a = Math.atan2(dy, dx);
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        ctx!.setTransform(cos * stretch, sin * stretch, -sin, cos, m.x, m.y);
        ctx!.drawImage(sprite, -s, -s, s * 2, s * 2);
        ctx!.setTransform(1, 0, 0, 1, 0, 0);
      }
    }

    ctx!.globalAlpha = 1;
    raf = requestAnimationFrame(frame);
  }

  /* ---------------------------------------------------------------- */
  /* Entradas                                                          */
  /* ---------------------------------------------------------------- */

  function onScroll(): void {
    const y = window.scrollY;
    const delta = y - lastScrollY;
    lastScrollY = y;
    const speed = Math.min(Math.abs(delta) / 90, 1);
    if (speed > gust) {
      gust = speed;
      gustDir = Math.sign(delta);
    }
  }

  function onPointerMove(e: PointerEvent): void {
    pointer.x = e.clientX * dpr;
    pointer.y = e.clientY * dpr;
    pointer.active = true;
  }

  function onPointerLeave(): void {
    pointer.active = false;
  }

  function onVisibility(): void {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      lastScrollY = window.scrollY;
      raf = requestAnimationFrame(frame);
    }
  }

  /* ---------------------------------------------------------------- */
  /* El tono: qué sección manda ahora mismo                            */
  /* ---------------------------------------------------------------- */

  function watchTone(): void {
    const sections = document.querySelectorAll<HTMLElement>('[data-tone]');
    if (!sections.length) return;

    const readTone = (el: HTMLElement): void => {
      const raw = getComputedStyle(el).getPropertyValue('--dust-rgb').trim();
      const parts = raw.split(/[\s,]+/).map(Number);
      if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) {
        toneTarget.r = parts[0]!;
        toneTarget.g = parts[1]!;
        toneTarget.b = parts[2]!;
      }
      document.documentElement.dataset.activeTone = el.dataset.tone ?? 'night';
    };

    // La sección que cruza el centro de la pantalla es la que manda
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) readTone(entry.target as HTMLElement);
        }
      },
      { rootMargin: '-50% 0px -50% 0px', threshold: 0 },
    );
    sections.forEach((s) => io.observe(s));
    readTone(sections[0]!);
  }

  /* ---------------------------------------------------------------- */

  resize();
  buildSprite();
  watchTone();

  let resizeTimer = 0;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(resize, 180);
  });
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('pointerleave', onPointerLeave);
  document.addEventListener('visibilitychange', onVisibility);

  raf = requestAnimationFrame(frame);
  canvas.classList.add('is-ready');

  /** Ráfaga a demanda: la usa el hero al terminar de cargar */
  (window as unknown as { dustGust?: (power?: number) => void }).dustGust = (power = 1) => {
    gust = Math.max(gust, Math.min(power, 1));
    gustDir = -1;
  };
}
