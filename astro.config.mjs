// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync, readFileSync } from 'node:fs';

/**
 * Fecha de cada entrada del diario, leída de su frontmatter, para poder
 * poner un `lastmod` de verdad en el sitemap. Sin esto Google no sabe
 * cuándo cambió cada página.
 */
const fechasDiario = Object.fromEntries(
  readdirSync('./src/content/journal')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const m = readFileSync(`./src/content/journal/${f}`, 'utf-8').match(/^date:\s*(.+)$/m);
      return [f.replace(/\.md$/, ''), m ? new Date(m[1].trim()).toISOString() : undefined];
    }),
);

const ultimaEntrada = Object.values(fechasDiario)
  .filter(Boolean)
  .sort()
  .at(-1);

export default defineConfig({
  site: 'https://diegodpl.com',
  integrations: [
    sitemap({
      // La hoja imprimible es el molde del PDF, no una página del sitio:
      // indexarla sería competir contra /media-kit con contenido calcado.
      filter: (page) => !page.includes('/media-kit/pdf'),
      serialize(item) {
        const ruta = new URL(item.url).pathname;

        const slug = ruta.match(/^\/diario\/([^/]+)\/$/)?.[1];
        if (slug && fechasDiario[slug]) {
          return { ...item, lastmod: fechasDiario[slug], priority: 0.7 };
        }
        if (ruta === '/diario/') {
          return { ...item, lastmod: ultimaEntrada, priority: 0.8 };
        }
        if (ruta === '/') return { ...item, priority: 1.0 };
        if (ruta === '/media-kit/') return { ...item, priority: 0.9 };
        return item;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    // Sitio estático y pequeño: el CSS dentro del HTML evita tres peticiones
    // que bloqueaban el primer pintado (~900 ms en móvil según Lighthouse)
    inlineStylesheets: 'always',
  },
});
