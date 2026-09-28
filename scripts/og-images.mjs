/**
 * IMÁGENES PARA COMPARTIR (Open Graph)
 * ------------------------------------
 *   npm run og
 *
 * Genera public/og.jpg, og-diario.jpg y og-media-kit.jpg (1200×630): el
 * mismo horizonte del hero, con el sol y el corredor, y el texto con las
 * fuentes reales de la web.
 *
 * El horizonte se copia de dist/index.html (así nunca se desincroniza del
 * hero) y las cifras del media kit se leen de src/data/site.ts. Hace falta
 * un `astro build` previo — `npm run og` ya lo lanza.
 *
 * Usa el Chrome instalado para la captura y `sips` (macOS) para pasar a JPG.
 */
import { readFile, writeFile, mkdir, rm, access } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const RAIZ = resolve(import.meta.dirname, '..');
const TMP = join(RAIZ, 'node_modules', '.og-tmp');
const FUENTES = join(RAIZ, 'node_modules', '@fontsource');

const CHROMES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/usr/bin/google-chrome',
].filter(Boolean);

async function existe(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function chrome() {
  for (const c of CHROMES) if (await existe(c)) return c;
  throw new Error('No encuentro Chrome. Indica la ruta con CHROME_PATH=…');
}

/** El SVG del horizonte, tal cual lo pinta el hero */
async function horizonte() {
  const html = await readFile(join(RAIZ, 'dist', 'index.html'), 'utf-8');
  const svg = html.match(/<svg class="hz__svg"[\s\S]*?<\/svg>/)?.[0];
  if (!svg) throw new Error('No encuentro el horizonte en dist/index.html. ¿Has hecho build?');
  // Sin animaciones SMIL: es una foto fija
  return svg.replace(/<animate(Transform)?\b[^>]*\/>/g, '');
}

/** Las cifras del media kit, desde la fuente única de verdad */
async function cifras() {
  const ts = await readFile(join(RAIZ, 'src', 'data', 'site.ts'), 'utf-8');
  const bloque = ts.match(/export const metrics[\s\S]*?\];/)?.[0] ?? '';
  return [...bloque.matchAll(/value:\s*([\d.]+)(?:,\s*suffix:\s*'([^']*)')?,\s*label:\s*'([^']+)'/g)].map(
    ([, v, suf, label]) => ({
      valor: Number(v).toLocaleString('es-ES') + (suf ? ` ${suf}` : ''),
      label,
    }),
  );
}

function pagina(svg, { kicker, titulo, pie }) {
  const f = (p) => pathToFileURL(join(FUENTES, p)).href;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:IS;src:url(${f('instrument-serif/files/instrument-serif-latin-400-normal.woff2')})}
@font-face{font-family:IS;font-style:italic;src:url(${f('instrument-serif/files/instrument-serif-latin-400-italic.woff2')})}
@font-face{font-family:SM;src:url(${f('space-mono/files/space-mono-latin-400-normal.woff2')})}
*{box-sizing:border-box}
html,body{margin:0;width:1200px;height:630px;overflow:hidden;background:#0B0907}
.hz{position:absolute;inset:0}
.hz svg{width:100%;height:100%;display:block}
.veil{position:absolute;inset:0;background:radial-gradient(70% 90% at 10% 45%,rgb(11 9 7/.75),rgb(11 9 7/.25) 55%,transparent 80%)}
.grain{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.86' numOctaves='4' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='220' height='220' filter='url(%23n)'/></svg>")}
.t{position:absolute;inset:0;padding:78px 84px 56px;display:flex;flex-direction:column;color:#EFE7D9}
.k{font:400 17px SM;letter-spacing:.42em;text-transform:uppercase;color:#CBB89D}
h1{margin:auto 0 0;font:400 150px/0.9 IS;letter-spacing:-.02em;color:#F7F2E9}
h1 em{display:block;margin-left:.2em;font-style:italic;color:#E0D3BF}
h1 em.o{color:#E89A55}
.pie{margin-top:44px;display:flex;justify-content:space-between;align-items:flex-end;gap:2rem;font:400 17px SM;letter-spacing:.08em;text-transform:uppercase;color:#CBB89D}
.pie b{font-weight:400;color:#F2A864;text-transform:none;letter-spacing:.02em}
.n{display:flex;gap:64px}
.n div{display:grid;gap:6px}
.n span{font:400 58px/1 IS;color:#F7F2E9;text-transform:none;letter-spacing:0}
</style></head><body>
<div class="hz">${svg}</div><div class="veil"></div><div class="grain"></div>
<div class="t"><div class="k">${kicker}</div><h1>${titulo}</h1><div class="pie">${pie}</div></div>
<script>
  // El corredor, posado sobre la cresta como lo hace horizon.ts
  const path = document.querySelector('[data-hz-path]');
  const runner = document.querySelector('[data-hz-runner]');
  if (path && runner) {
    const total = path.getTotalLength();
    let best = path.getPointAtLength(0);
    for (let l = 0; l <= total; l += 2) {
      const p = path.getPointAtLength(l);
      if (Math.abs(p.x - 1040) < Math.abs(best.x - 1040)) best = p;
    }
    runner.setAttribute('transform', 'translate(' + best.x + ' ' + best.y + ')');
  }
</script>
</body></html>`;
}

const svg = await horizonte();
const n = await cifras();
const bin = await chrome();
await mkdir(TMP, { recursive: true });

const tarjetas = [
  {
    salida: 'og.jpg',
    kicker: 'Creador de contenido',
    titulo: 'Diego<em>DPL</em>',
    pie: '<span>Running · Viajes · Lifestyle</span><b>diegodpl.com</b>',
  },
  {
    salida: 'og-diario.jpg',
    kicker: 'Diario',
    titulo: 'Notas del<em class="o">camino</em>',
    pie: '<span>Running · Viajes · Oficio</span><b>diegodpl.com</b>',
  },
  {
    salida: 'og-media-kit.jpg',
    kicker: 'Media kit',
    titulo: 'Diego<em>DPL</em>',
    pie: `<div class="n">${n.map((m) => `<div><span>${m.valor}</span>${m.label}</div>`).join('')}</div><b>diegodpl.com</b>`,
  },
];

for (const t of tarjetas) {
  const html = join(TMP, `${t.salida}.html`);
  const png = join(TMP, `${t.salida}.png`);
  await writeFile(html, pagina(svg, t));
  const r = spawnSync(bin, [
    '--headless=new',
    '--disable-gpu',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1200,630',
    '--virtual-time-budget=4000',
    '--allow-file-access-from-files',
    `--screenshot=${png}`,
    pathToFileURL(html).href,
  ]);
  if (r.status !== 0) throw new Error(`Chrome falló con ${t.salida}: ${r.stderr}`);
  const out = join(RAIZ, 'public', t.salida);
  const j = spawnSync('sips', ['-s', 'format', 'jpeg', '-s', 'formatOptions', '82', png, '--out', out]);
  if (j.status !== 0) throw new Error(`sips falló con ${t.salida}: ${j.stderr}`);
  console.log(`✓ public/${t.salida}`);
}

await rm(TMP, { recursive: true, force: true });
