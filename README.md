# Diego DPL — Portafolio de creador de contenido

Web personal de Diego DPL: running, viajes y lifestyle con estética
documental analógica. Astro 5 + Tailwind v4, sitio estático.

El hilo conductor de todo el diseño es **el polvo**: la textura del grano
analógico, la partícula que se levanta al correr y la metáfora del camino.
Las secciones alternan **noche** y **día** para que la página respire, y el
recorrido sigue la estructura del viaje del héroe: la llamada, el desierto,
las pruebas, el regreso y la invitación.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # genera dist/
npm run preview  # sirve dist/ para comprobarlo antes de publicar
```

---

## Dónde se edita cada cosa

**Casi todo se cambia en un solo archivo: `src/data/site.ts`.**
No hace falta tocar componentes.

| Qué | Dónde |
| --- | --- |
| Nombre, email, ubicación, coordenadas | `site` |
| Instagram, TikTok, YouTube, Strava | `socials` |
| Menú de navegación | `nav` |
| Manifiesto y los tres actos del camino | `manifesto` |
| Galería de encuadres | `work` |
| Números del media kit | `metrics` y `audience` |
| Servicios para marcas | `services` |
| Etiquetas de la marquesina | `brands` |
| Opciones del formulario | `contact` |

La galería (`work`) **no son encargos ni campañas**: es una selección de
encuadres reales. Cada entrada lleva un `title` corto, un `caption` que
describe qué se ve y qué demuestra que sabes hacer, y unas `capability` que
salen como etiquetas. Está escrita así a propósito: una marca necesita saber
qué le vas a entregar, y eso se enseña mejor con un pie honesto que con un
caso de estudio inventado. Si algún día tienes un trabajo de cliente que
puedas publicar, ese sí merece su propia entrada con nombre y año.

### Poner tus fotos

Las fotos viven en **`src/assets/media/`**. Puestas ahí, Astro las optimiza
sola: genera `webp`, varios tamaños, `srcset` y versión retina, y sirve a cada
móvil sólo lo que necesita. (Una foto de 590 kB acaba pesando 93 kB.)

Ya están puestas nueve:

| Archivo | Dónde sale |
| --- | --- |
| `diego-super8.jpg` | Hero — panel derecho en escritorio, fondo a sangre en móvil |
| `el-desierto.jpg` | Sección «El desierto», a sangre completa |
| `casa-sierra.jpg` | Sobre mí |
| `despues-del-esfuerzo.jpg` | Trabajo — «Kilómetro cero» |
| `a-pulmon.jpg` | Trabajo — «A pulmón» |
| `camino-al-anochecer.jpg` | Trabajo — «La ruta del polvo» |
| `hora-azul.jpg` | Trabajo — «Antes del sol» |
| `sendero.jpg` | Trabajo — «Terreno hostil» |
| `cenital.jpg` | Media kit — «Cómo trabajo» |

Queda **una** tarjeta de trabajo con placeholder («Mediterráneo interior») y
las tres portadas del diario.

> **Sobre el peso.** El archivo que guardas aquí no es el que descarga nadie.
> Astro genera desde él las variantes `webp` y sirve la que toque: la foto de
> «El desierto» pesa 2,4 MB en el repositorio y el visitante recibe **56 kB en
> móvil** o 440 kB en un portátil retina a pantalla completa. Así que guarda
> siempre la mejor calidad que tengas; comprimir el original de más sólo
> empeora el resultado final.

Para añadir una a un **proyecto del portafolio**, en `src/data/site.ts`:

```ts
import salYAsfalto from '~/assets/media/sal-y-asfalto.jpg';   // arriba del archivo

// …y en el proyecto que toque:
{
  title: 'Sal y asfalto',
  image: salYAsfalto,
  position: '50% 35%',   // opcional: encuadre si hay que recortar
  …
}
```

Para el **hero** y **«Sobre mí»**, cambia el `import` de arriba de
`src/components/sections/Hero.astro` y `About.astro`.

El marco recorta con `object-fit: cover` según `format`: `portrait` (4:5),
`landscape` (16:10), `square` (1:1) y `tall` (3:4.6). Si el recorte deja fuera
lo importante, ajusta `position` (`'50% 30%'` sube el encuadre, `'50% 70%'` lo
baja).

> También puedes dejar una foto en `public/media/` y apuntar con una cadena
> (`image: '/media/foto.jpg'`), pero entonces **no se optimiza**. Úsalo sólo
> para pruebas rápidas.

### Versión en inglés

`/en/` es **una sola página** para marcas y agencias internacionales: quién
eres, el trabajo, la audiencia, los servicios, cómo trabajas, dudas y
formulario. No es una traducción del sitio entero, y es a propósito: una
página buena convierte más que cinco a medias.

- Los textos están en `src/data/en.ts`. Las fotos, métricas y redes se
  importan de `site.ts`, así que **sólo se actualizan en un sitio**.
- El menú y el pie cambian de idioma solos con la prop `lang` del layout.
- `hreflang` enlaza `/` y `/en/` en ambas direcciones, con `x-default` al
  español. Sin esto Google podría tomar una por copia de la otra.
- El formulario es el mismo componente: los mensajes de estado ("Enviando…",
  "Recibido") vienen de atributos `data-msg-*` del marcado, no del script.

Si algún día quieres más páginas en inglés, el patrón ya está: `lang="en"`,
`alternates` con su pareja, y los textos en `en.ts`.

## SEO y visibilidad

Lo que hay montado, para que sepas qué tocar:

| Qué | Dónde | Se actualiza |
| --- | --- | --- |
| Datos estructurados | `src/layouts/Base.astro` + cada página | Solos |
| Sitemap con fechas y prioridades | `astro.config.mjs` | Solo, leyendo el frontmatter del diario |
| `robots.txt` | `public/robots.txt` | A mano |
| `llms.txt` | `src/pages/llms.txt.ts` | Solo, desde `site.ts` y el diario |
| Feed RSS | `src/pages/rss.xml.ts` | Solo |
| Imagen al compartir | `public/og*.jpg` + prop `image` del layout | A mano |
| Preguntas frecuentes | `faqs` en `src/data/site.ts` | A mano |

**Imagen al compartir.** Cada página puede llevar la suya con la prop
`image` del layout: `<Base image="/og-media-kit.jpg">`. Las entradas del
diario usan su portada si la tienen, y si no la del diario. Es la superficie
que más se ve de la web, porque aparece cada vez que compartes un enlace por
WhatsApp o por DM.

**Rastreadores de IA.** `robots.txt` les da paso explícito (GPTBot,
ClaudeBot, PerplexityBot, Google-Extended, CCBot…). Es una decisión: permite
que tu trabajo se use para entrenar modelos, a cambio de que te conozcan. Si
algún día cambias de opinión, se bloquean ahí mismo con `Disallow: /`.

**Preguntas frecuentes.** Están escritas sin cifras ni plazos concretos a
propósito: describen cómo trabajas sin comprometerte. Si prefieres dar
precios o tiempos de entrega cerrados, cámbialos — pero entonces cúmplelos.

## Publicar en Vercel

Sitio estático: no hace falta adaptador ni servidor.

1. Sube el proyecto a un repositorio de GitHub.
2. En Vercel, **Add New → Project** y elige el repositorio. Detecta Astro solo:
   build `npm run build`, salida `dist`. No toques nada.
3. En **Settings → Environment Variables** añade `PUBLIC_WEB3FORMS_KEY` con tu
   clave (ver más arriba). Si no la pones, el formulario sigue funcionando pero
   abre el cliente de correo del visitante en vez de enviártelo.
4. En **Settings → Domains** añade `diegodpl.com` y `www.diegodpl.com`, y
   apunta los DNS donde tengas el dominio a lo que te indique Vercel.

El `vercel.json` del proyecto ya deja las imágenes y el JS cacheados un año
(llevan hash en el nombre, así que se renuevan solos al desplegar) y añade dos
cabeceras de seguridad básicas.

Antes de publicar, comprueba que las **métricas del media kit** siguen al día
en `src/data/site.ts`.
