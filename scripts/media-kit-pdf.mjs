/**
 * GENERADOR DEL MEDIA KIT EN PDF
 * ------------------------------
 *   npm run media-kit
 *
 * Coge la hoja imprimible (/media-kit/pdf/), la sirve en local y le pide a
 * Chrome que la imprima en A4. El resultado se guarda en `public/`, así que
 * el siguiente `npm run build` lo publica solo.
 *
 * No hay dependencias nuevas: el servidor son treinta líneas de Node y el
 * motor de impresión es el Chrome que ya tienes instalado. Si algún día
 * mueves esto a un CI, lo único que hace falta allí es un Chrome.
 */
import { createServer } from 'node:http';
import { readFile, copyFile, access, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { extname, join, resolve } from 'node:path';

const RAIZ = resolve(import.meta.dirname, '..');
const DIST = join(RAIZ, 'dist');
const RUTA = '/media-kit/pdf/';
const SALIDA = join(RAIZ, 'public', 'media-kit-diego-dpl.pdf');

/** Dónde vive Chrome según el sistema. El primero que exista, gana. */
const CANDIDATOS = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
};

const existe = (p) => access(p).then(() => true, () => false);

async function buscarChrome() {
  for (const c of CANDIDATOS) if (await existe(c)) return c;
  throw new Error(
    'No encuentro Chrome. Instálalo, o pasa la ruta:\n' +
      '  CHROME_PATH="/ruta/a/chrome" npm run media-kit',
  );
}

/** Servidor estático mínimo sobre dist/. Sólo lee; no escribe nada. */
function servir(dir) {
  const server = createServer(async (req, res) => {
    try {
      const url = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      let archivo = join(dir, url);
      // Evita que un ".." en la URL se salga de dist/
      if (!archivo.startsWith(dir)) return res.writeHead(403).end();
      if (url.endsWith('/')) archivo = join(archivo, 'index.html');

      const cuerpo = await readFile(archivo);
      res.writeHead(200, { 'content-type': TIPOS[extname(archivo)] ?? 'application/octet-stream' });
      res.end(cuerpo);
    } catch {
      res.writeHead(404).end('no encontrado');
    }
  });
  return new Promise((ok) => server.listen(0, '127.0.0.1', () => ok(server)));
}

function imprimir(chrome, url, destino) {
  return new Promise((ok, fallo) => {
    const p = spawn(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--hide-scrollbars',
        '--no-pdf-header-footer',
        // Margen de tiempo para las webfonts y las imágenes
        '--virtual-time-budget=10000',
        `--print-to-pdf=${destino}`,
        url,
      ],
      { stdio: ['ignore', 'ignore', 'pipe'] },
    );
    let err = '';
    p.stderr.on('data', (d) => (err += d));
    p.on('error', fallo);
    p.on('close', (code) =>
      code === 0 ? ok() : fallo(new Error(`Chrome salió con ${code}\n${err.trim()}`)),
    );
  });
}

const kb = (n) => `${Math.round(n / 1024)} KB`;

async function main() {
  if (!(await existe(join(DIST, 'media-kit', 'pdf', 'index.html')))) {
    throw new Error('Falta dist/. Lanza antes:  npm run build');
  }

  const chrome = await buscarChrome();
  const server = await servir(DIST);
  const { port } = server.address();
  const url = `http://127.0.0.1:${port}${RUTA}`;

  console.log(`· Sirviendo dist/ en ${port}`);
  console.log(`· Imprimiendo ${RUTA} con Chrome…`);

  try {
    await mkdir(join(RAIZ, 'public'), { recursive: true });
    await imprimir(chrome, url, SALIDA);
  } finally {
    server.close();
  }

  const { size } = await import('node:fs').then((fs) => fs.promises.stat(SALIDA));
  console.log(`✓ public/media-kit-diego-dpl.pdf  (${kb(size)})`);

  // Copia al dist actual para poder verlo sin reconstruir
  if (await existe(DIST)) {
    await copyFile(SALIDA, join(DIST, 'media-kit-diego-dpl.pdf'));
    console.log('✓ copiado también a dist/ (para el preview)');
  }
}

main().catch((e) => {
  console.error(`\n✗ ${e.message}\n`);
  process.exit(1);
});
