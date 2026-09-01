import { getCollection } from 'astro:content';
import { site, services, metrics, socials } from '~/data/site';
import type { APIContext } from 'astro';

/**
 * llms.txt — resumen del sitio en texto plano para modelos de lenguaje.
 *
 * Es una propuesta reciente y ninguna empresa grande de IA ha confirmado
 * que la lea, así que no esperes tráfico de aquí. Se genera solo a partir
 * de los mismos datos que la web, así que no hay nada que mantener a mano.
 */
export async function GET(context: APIContext) {
  const base = String(context.site ?? site.url).replace(/\/$/, '');

  const posts = (await getCollection('journal', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  const texto = `# ${site.name}

> ${site.role} de running, viajes y estilo de vida, afincado en ${site.location}.
> Dirige, rueda y edita sus propias piezas con una estética documental analógica.

Diego DPL trabaja con marcas de running, outdoor, viajes y lifestyle. Se
encarga del proceso completo —concepto, rodaje, edición y entrega— sin equipo
intermedio. Idiomas: ${site.languages.join(', ')}.

## Audiencia
${metrics.map((m) => `- ${m.label}: ${m.value.toLocaleString('es-ES')}${m.suffix ?? ''}${m.note ? ` (${m.note})` : ''}`).join('\n')}

## Servicios
${services.map((s) => `- ${s.title}: ${s.body}`).join('\n')}

## Páginas
- [Inicio](${base}/): portafolio, manifiesto y galería de encuadres.
- [Media kit](${base}/media-kit): audiencia, servicios y forma de trabajar. Para marcas.
- [Diario](${base}/diario): textos sobre entrenamiento, viajes y oficio.

## Diario
${posts.map((p) => `- [${p.data.title}](${base}/diario/${p.id}/): ${p.data.excerpt}`).join('\n')}

## Contacto
- Email: ${site.email}
${socials.map((s) => `- ${s.label}: ${s.href}`).join('\n')}
`;

  return new Response(texto, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
