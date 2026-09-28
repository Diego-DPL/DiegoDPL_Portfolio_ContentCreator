/**
 * EL VIENTO
 * ---------
 * Sonido ambiente sintetizado en el navegador: no hay archivo de audio que
 * descargar. Dos capas de ruido filtrado:
 *   · el cuerpo — ruido marrón por un paso banda que se abre y se cierra
 *     despacio, como el aire que va y viene sobre las dunas;
 *   · la arena — un siseo agudo que sólo sube con las rachas.
 * El scroll rápido es una ráfaga: sube el siseo y abre el filtro.
 *
 * Apagado siempre al cargar. El navegador exige un clic para sonar y,
 * aunque no lo exigiera, nadie debería encontrarse con ruido sin pedirlo.
 */

export function initWind(): void {
  const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('[data-sound]'));
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!buttons.length) return;
  if (!AC) {
    buttons.forEach((b) => b.remove());
    return;
  }

  let ctx: AudioContext | null = null;
  let master: GainNode;
  let bodyFilter: BiquadFilterNode;
  let bodyGain: GainNode;
  let hissGain: GainNode;
  let on = false;
  let gust = 0;
  let lastY = window.scrollY;
  let raf = 0;
  let t = Math.random() * 100;

  function noiseBuffer(ac: AudioContext, brown: boolean): AudioBuffer {
    const len = ac.sampleRate * 4;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const data = buf.getChannelData(0);
    let last = 0;
    for (let i = 0; i < len; i++) {
      const white = Math.random() * 2 - 1;
      if (brown) {
        last = (last + 0.02 * white) / 1.02;
        data[i] = last * 3.5;
      } else {
        data[i] = white;
      }
    }
    return buf;
  }

  function build(): void {
    ctx = new AC!();
    master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const body = ctx.createBufferSource();
    body.buffer = noiseBuffer(ctx, true);
    body.loop = true;
    bodyFilter = ctx.createBiquadFilter();
    bodyFilter.type = 'bandpass';
    bodyFilter.frequency.value = 420;
    bodyFilter.Q.value = 0.8;
    bodyGain = ctx.createGain();
    bodyGain.gain.value = 0.5;
    body.connect(bodyFilter).connect(bodyGain).connect(master);

    const hiss = ctx.createBufferSource();
    hiss.buffer = noiseBuffer(ctx, false);
    hiss.loop = true;
    const hp = ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 4200;
    hissGain = ctx.createGain();
    hissGain.gain.value = 0.004;
    hiss.connect(hp).connect(hissGain).connect(master);

    body.start();
    hiss.start();
  }

  function modulate(): void {
    if (!ctx || !on) return;
    t += 0.016;
    gust *= 0.965;
    const now = ctx.currentTime;
    // Dos senos lentos y desfasados: el viento nunca repite su frase
    const breath = (Math.sin(t * 0.31) + Math.sin(t * 0.13 + 1.7)) * 0.5; // -1..1
    bodyFilter.frequency.setTargetAtTime(360 + breath * 160 + gust * 700, now, 0.25);
    bodyGain.gain.setTargetAtTime(0.42 + breath * 0.18 + gust * 0.35, now, 0.3);
    hissGain.gain.setTargetAtTime(0.004 + Math.max(0, breath) * 0.006 + gust * 0.05, now, 0.15);
    raf = requestAnimationFrame(modulate);
  }

  function set(next: boolean): void {
    on = next;
    buttons.forEach((b) => {
      b.setAttribute('aria-pressed', String(on));
      b.classList.toggle('is-on', on);
    });

    if (on) {
      if (!ctx) build();
      void ctx!.resume();
      master.gain.cancelScheduledValues(ctx!.currentTime);
      master.gain.setTargetAtTime(0.55, ctx!.currentTime, 0.9);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(modulate);
    } else if (ctx) {
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.35);
      const c = ctx;
      window.setTimeout(() => {
        if (!on) void c.suspend();
      }, 1600);
    }
  }

  buttons.forEach((b) => b.addEventListener('click', () => set(!on)));

  window.addEventListener(
    'scroll',
    () => {
      const y = window.scrollY;
      gust = Math.max(gust, Math.min(Math.abs(y - lastY) / 110, 1));
      lastY = y;
    },
    { passive: true },
  );

  // En otra pestaña, silencio; al volver, el viento sigue donde estaba
  document.addEventListener('visibilitychange', () => {
    if (!ctx || !on) return;
    if (document.hidden) void ctx.suspend();
    else void ctx.resume();
  });
}
