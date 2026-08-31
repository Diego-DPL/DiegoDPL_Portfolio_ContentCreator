import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * EL DIARIO
 * Notas del camino. Cada entrada es un .md en src/content/journal/.
 * Para publicar una nueva sólo tienes que crear el archivo.
 */
const journal = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/journal' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Bajada que se ve en el listado */
      excerpt: z.string(),
      date: z.coerce.date(),
      /** Dónde estabas. Sale bajo el título. */
      place: z.string().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      /**
       * Portada. Guarda la foto en src/assets/media/ y apunta aquí con una
       * ruta relativa desde este archivo .md:
       *
       *   cover: ../../assets/media/mi-foto.jpg
       *
       * Astro la optimiza sola. Sin portada se dibuja el placeholder de polvo.
       */
      cover: image().nullable().default(null),
    }),
});

export const collections = { journal };
