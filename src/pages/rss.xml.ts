import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { site } from '~/data/site';
import type { APIContext } from 'astro';

/**
 * Feed del diario. Sirve para lectores RSS, agregadores y algunos
 * rastreadores. Se genera solo a partir de las entradas publicadas.
 */
export async function GET(context: APIContext) {
  const posts = (await getCollection('journal', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: `Diario — ${site.name}`,
    description:
      'Notas del camino: entrenamiento, viajes, oficio y la parte del trabajo que nadie ve.',
    site: context.site ?? site.url,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.excerpt,
      pubDate: post.data.date,
      link: `/diario/${post.id}/`,
      categories: [...post.data.tags],
    })),
    customData: '<language>es-ES</language>',
  });
}
