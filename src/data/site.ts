import type { ImageMetadata } from 'astro';

// Fotos del portafolio. Guárdalas en src/assets/media/ e impórtalas aquí.
import despuesDelEsfuerzo from '~/assets/media/despues-del-esfuerzo.jpg';
import sendero from '~/assets/media/sendero.jpg';
import aPulmon from '~/assets/media/a-pulmon.jpg';
import caminoAlAnochecer from '~/assets/media/camino-al-anochecer.jpg';
import horaAzul from '~/assets/media/hora-azul.jpg';
import bajaElViento from '~/assets/media/baja-el-viento.jpg';

/**
 * FUENTE ÚNICA DE VERDAD
 * ----------------------
 * Todo el contenido editable de la web vive aquí. Si cambias algo en este
 * archivo, cambia en toda la web. No hace falta tocar ningún componente.
 */

export const site = {
  name: 'Diego DPL',
  handle: '@diegodpl',
  role: 'Creador de contenido',
  domain: 'diegodpl.com',
  url: 'https://diegodpl.com',
  email: 'info@diegodpl.com',
  location: 'Murcia, España',
  coords: '37°59′N 1°07′O',
  /** Idiomas en los que trabajas, para el media kit */
  languages: ['Español', 'Inglés'],
  description:
    'Portafolio de Diego DPL, creador de contenido de running, viajes y lifestyle. Dirección, fotografía y edición con estética documental analógica para marcas.',
  tagline: 'El camino se hace levantando polvo.',
  /** Título de la portada en Google: qué haces y dónde, no sólo el nombre */
  homeTitle: 'Diego DPL — Creador de contenido de running y viajes en Murcia',
  /**
   * Código de Google Search Console. Sólo hace falta si verificas por
   * etiqueta HTML; si verificas por DNS (recomendado) déjalo vacío.
   * Se pone en .env como PUBLIC_GOOGLE_SITE_VERIFICATION.
   */
  googleVerification: import.meta.env.PUBLIC_GOOGLE_SITE_VERIFICATION ?? '',
} as const;

/* ------------------------------------------------------------------ */
/* DATOS LEGALES — para /privacidad                                    */
/* ------------------------------------------------------------------ */

/**
 * La ley (RGPD y LSSI) pide identificar al responsable de la web con su
 * nombre legal y NIF. Mientras estén vacíos, /privacidad muestra el nombre
 * comercial y el email, que no basta del todo: rellénalos.
 */
export const legal = {
  owner: '',
  nif: '',
  updated: '28 de septiembre de 2026',
} as const;

/* ------------------------------------------------------------------ */
/* CERTIFICACIÓN PUBLICITARIA                                          */
/* ------------------------------------------------------------------ */

/**
 * Certificado de capacitación básica para influencers sobre normativa
 * publicitaria, emitido por AUTOCONTROL (la asociación española de
 * autorregulación de la comunicación comercial) dentro del programa
 * influencert / AdEthics.
 *
 * OJO con cómo se redacta: AUTOCONTROL no es un organismo público. Es el
 * certificado de referencia del sector y va ligado al Código de Conducta
 * sobre el uso de influencers en la publicidad, pero no se puede llamar
 * "certificado estatal" — sería justo el tipo de afirmación que el propio
 * curso enseña a no hacer.
 *
 * Caduca a los dos años. Cuando renueves, actualiza `issued` y `expires`.
 */
/**
 * El media kit en PDF, para la agencia que lo archiva y lo reenvía por
 * dentro. Se regenera desde los mismos datos con `npm run media-kit`.
 */
export const mediaKitPdf = {
  file: '/media-kit-diego-dpl.pdf',
  label: 'Descargar en PDF',
  note: '3 páginas · A4',
} as const;

export const certification = {
  name: 'Capacitación básica para influencers sobre normativa publicitaria',
  short: 'Certificado AUTOCONTROL',
  issuer: 'AUTOCONTROL',
  issuerFull: 'Asociación para la Autorregulación de la Comunicación Comercial',
  programme: 'influencert · AdEthics',
  holder: 'Diego Miguel Pérez Lorente',
  /** ISO, para el schema. */
  issued: '2026-02-26',
  expires: '2028-02-26',
  /** Cómo se lee en pantalla. */
  issuedLabel: 'Febrero 2026',
  validLabel: 'Válido hasta febrero de 2028',
  file: '/certificado-autocontrol-influencers.pdf',
  issuerUrl: 'https://www.autocontrol.es',
  /** Una línea para la ficha de "Sobre mí". */
  claim: 'Formación acreditada en normativa publicitaria',
  /** El porqué, para la marca que lo lee. */
  body:
    'Estoy certificado por AUTOCONTROL en normativa publicitaria para creadores de contenido. En la práctica significa que tu campaña sale identificada como publicidad desde el primer fotograma, con el lenguaje correcto y sin afirmaciones que no se puedan sostener. Ni sustos con la marca ni con la ley.',
} as const;

/* ------------------------------------------------------------------ */
/* REDES                                                               */
/* ------------------------------------------------------------------ */

export const socials = [
  { label: 'Instagram', handle: '@diegodpl', href: 'https://instagram.com/diegodpl' },
  { label: 'TikTok', handle: '@diegodpl_', href: 'https://tiktok.com/@diegodpl_' },
  { label: 'Strava', handle: 'Diego DPL', href: 'https://strava.app.link/giTZK7vy35b' },
] as const;

/* ------------------------------------------------------------------ */
/* NAVEGACIÓN                                                          */
/* ------------------------------------------------------------------ */

export const nav = [
  { label: 'El camino', href: '/#manifiesto', index: '01' },
  { label: 'Trabajo', href: '/#trabajo', index: '02' },
  { label: 'Sobre mí', href: '/#sobre-mi', index: '03' },
  // `cta` lo pinta destacado: es la única entrada comercial del menú
  { label: 'Marcas', href: '/media-kit', index: '04', cta: true },
  // El diario ya no va en el menú: sus entradas están para el buscador, no
  // para quien llega a la portada. Se enlaza desde el pie (Footer.astro).
  { label: 'Contacto', href: '/#contacto', index: '05' },
] as const;

/* ------------------------------------------------------------------ */
/* EL MANIFIESTO — los tres actos del camino                           */
/* ------------------------------------------------------------------ */

export const manifesto = {
  /** Se revela palabra a palabra saliendo del polvo */
  statement:
    'El camino hacia lo que quieres es duro y es solitario. Nadie te va a acompañar a las seis de la mañana. Nadie va a correr el kilómetro que te falta. La meta nunca fue el otro lado — la meta es en quién te conviertes mientras cruzas.',
  acts: [
    {
      index: 'I',
      title: 'La llamada',
      body: 'Todo empieza con una incomodidad. Una versión de ti que sabes que existe y todavía no has conocido. La mayoría la silencia. Yo decidí seguirla.',
    },
    {
      index: 'II',
      title: 'El desierto',
      body: 'Aquí es donde se cae casi todo el mundo. Los días en que no hay resultados, ni público, ni ganas. Sólo el trabajo, repetido, sin testigos. Es la única parte que importa.',
    },
    {
      index: 'III',
      title: 'El regreso',
      body: 'No vuelves con un trofeo. Vuelves con algo mejor: la certeza tranquila de que puedes. Y entonces empiezas otra vez, un poco más lejos.',
    },
  ],
} as const;

/* ------------------------------------------------------------------ */
/* TRABAJO — sustituye por tus proyectos reales                        */
/* ------------------------------------------------------------------ */

export type WorkItem = {
  slug: string;
  /** Título del encuadre. Corto. */
  title: string;
  /** Pie de foto: qué se ve y, sobre todo, qué demuestra que sabes hacer. */
  caption: string;
  /** Qué técnica o recurso enseña la imagen. Sale como etiquetas. */
  capability: string[];
  /**
   * Qué se ve en la foto, para quien no puede verla y para Google Imágenes.
   * Describe la escena, no la intención: eso ya lo cuenta `caption`.
   */
  alt: string;
  /** Ratio del marco: 'portrait' 4:5 · 'landscape' 16:10 · 'square' 1:1 */
  format: 'portrait' | 'landscape' | 'square';
  /**
   * Deja `null` para el placeholder de polvo.
   *
   * Para poner una foto, guárdala en `src/assets/media/` e impórtala arriba
   * del todo de este archivo. Astro genera webp, srcset y retina sola:
   *
   *   import salYAsfalto from '~/assets/media/sal-y-asfalto.jpg';
   *   …
   *   image: salYAsfalto,
   */
  image: ImageMetadata | string | null;
  /** Encuadre si la foto no tiene la proporción del marco. Ej: '50% 30%' */
  position?: string;
};

/**
 * LA GALERÍA
 * ----------
 * No son campañas ni encargos: son encuadres reales. Cada pie describe lo
 * que se ve y qué demuestra que sabes hacer, que es lo que una marca
 * necesita saber antes de escribirte. Si algún día haces un trabajo de
 * cliente que puedas enseñar, ese sí merece su propia entrada.
 */
export const work: WorkItem[] = [
  {
    slug: 'cuando-ya-esta-hecho',
    alt:
      'Corredor tumbado boca arriba sobre el asfalto, recuperando el aliento al terminar de correr',
    title: 'Cuando ya está hecho',
    caption:
      'El minuto después del último kilómetro. Es el momento que casi nadie graba y el único que cuenta algo de verdad.',
    capability: ['Contraluz', 'Retrato en exteriores'],
    format: 'portrait',
    image: despuesDelEsfuerzo,
    position: '50% 38%',
  },
  {
    slug: 'a-pulmon',
    alt:
      'Contrapicado de un corredor con gorra, gafas de sol y chaleco de hidratación respirando contra el cielo azul',
    title: 'A pulmón',
    caption:
      'Contrapicado contra el cielo abierto. Sirve para prenda técnica: se ve puesta y en esfuerzo real, no colgada en un estudio.',
    capability: ['Contrapicado', 'Producto en uso'],
    format: 'portrait',
    image: aPulmon,
    position: '50% 42%',
  },
  {
    slug: 'el-camino-desde-arriba',
    alt:
      'Vista aérea de un sendero de tierra serpenteando por una ladera de monte bajo al anochecer',
    title: 'El camino, desde arriba',
    caption:
      'Dron al anochecer. La escala del terreno y una figura diminuta: es el encuadre que convierte una salida cualquiera en una historia.',
    capability: ['Dron', 'Paisaje'],
    format: 'landscape',
    image: caminoAlAnochecer,
    position: '50% 28%',
  },
  {
    slug: 'cuando-baja-el-viento',
    alt:
      'Mar en calma al atardecer, con una isla en el horizonte y las nubes teñidas de rosa',
    title: 'Cuando baja el viento',
    caption:
      'Última luz sobre el agua, sin una sola onda. El plano limpio que abre una campaña o deja respirar un feed entre piezas de esfuerzo.',
    capability: ['Paisaje', 'Última luz'],
    format: 'square',
    image: bajaElViento,
  },
  {
    slug: 'hora-azul',
    alt:
      'Corredor de espaldas en un camino de tierra antes del amanecer, con el valle y la sierra al fondo',
    title: 'Hora azul',
    caption:
      'Los veinte minutos antes de que salga el sol. Luz fría, sin sombras duras y muy poca gente dispuesta a madrugar para cogerla.',
    capability: ['Hora azul', 'Seguimiento'],
    format: 'portrait',
    image: horaAzul,
    position: '50% 62%',
  },
  {
    slug: 'terreno-suelto',
    alt:
      'Corredor de espaldas avanzando por un sendero entre matorral seco, con la sierra al fondo',
    title: 'Terreno suelto',
    caption:
      'Cámara en mano, corriendo detrás. Cuando la marca quiere movimiento de verdad y no una pose, se rueda así.',
    capability: ['Cámara en mano', 'Movimiento'],
    format: 'portrait',
    image: sendero,
    position: '50% 45%',
  },
];

/* ------------------------------------------------------------------ */
/* MEDIA KIT — números y servicios para marcas                         */
/* ------------------------------------------------------------------ */

export type Metric = { value: number; suffix?: string; label: string; note?: string };

/**
 * Datos reales. Revísalos cada trimestre en Instagram Insights y TikTok
 * Analytics. Los números se animan solos desde cero al entrar en pantalla;
 * los decimales se detectan automáticamente.
 */
export const metrics: Metric[] = [
  { value: 2600, label: 'Comunidad', note: 'Instagram + TikTok' },
  { value: 12000, label: 'Reproducciones', note: 'Últimos 30 días' },
  { value: 78.4, suffix: '%', label: 'Audiencia 25–44', note: 'Núcleo principal' },
];

/** Reparto por edad. Debe sumar 100. */
export const audience = [
  { label: '25 – 34 años', value: 57.5 },
  { label: '35 – 44 años', value: 20.9 },
  { label: '18 – 24 años', value: 9.2 },
  { label: 'Otras edades', value: 12.4 },
] as const;

export type Service = {
  index: string;
  title: string;
  body: string;
  includes: string[];
};

export const services: Service[] = [
  {
    index: '01',
    title: 'Contenido de marca',
    body:
      'Piezas verticales para Instagram y TikTok con la estética documental que define mi feed. De la idea al máster, sin intermediarios.',
    includes: ['Concepto y guion', 'Rodaje', 'Edición y color', 'Publicación y copy'],
  },
  {
    index: '02',
    title: 'Campaña y dirección',
    body:
      'Cuando la marca necesita algo más que un post: una idea que sostenga varias piezas y un lenguaje visual propio.',
    includes: ['Dirección creativa', 'Moodboard y referencias', 'Producción', 'Entrega multiformato'],
  },
  {
    index: '03',
    title: 'Fotografía',
    body:
      'Producto, retrato y paisaje con luz natural. Grano real, sin plástico. Imágenes que aguantan una valla y un feed.',
    includes: ['Sesión', 'Selección y revelado', 'Cesión de derechos', 'Formatos web y print'],
  },
  {
    index: '04',
    title: 'Embajador',
    body:
      'Relación larga en lugar de un impacto suelto. Presencia continuada, producto integrado de verdad y datos cada mes.',
    includes: ['Plan trimestral', 'Contenido recurrente', 'Eventos y carreras', 'Informe de resultados'],
  },
];

/**
 * PREGUNTAS FRECUENTES
 * --------------------
 * Están escritas a propósito sin cifras ni plazos concretos: describen cómo
 * trabajas, no te comprometen a nada. Repásalas, y si prefieres dar precios
 * o tiempos de entrega cerrados, cámbialas — pero entonces cúmplelos.
 */
export const faqs = [
  {
    q: '¿Quién rueda y edita?',
    a: 'Yo. De la idea al máster: concepto, rodaje, edición y color. No hay equipo intermedio ni subcontratas, así que hablas siempre con la persona que hace el trabajo.',
  },
  {
    q: '¿Cuánto cuesta una colaboración?',
    a: 'Depende del alcance: no es lo mismo una pieza suelta que una campaña con varias entregas. Cuéntame qué necesitas y te paso un presupuesto cerrado, sin extras a mitad de camino.',
  },
  {
    q: '¿Puedo usar el contenido en publicidad de pago?',
    a: 'Sí, si lo acordamos antes. Los derechos de uso se cierran por escrito en el presupuesto: dónde se publica, durante cuánto tiempo y en qué formatos. Nada de zonas grises.',
  },
  {
    q: '¿Sabes cómo hay que identificar la publicidad?',
    a: 'Sí, y está acreditado: tengo el certificado de capacitación básica para influencers sobre normativa publicitaria de AUTOCONTROL. Cada pieza pagada sale marcada como publicidad desde el principio, con el formato que exige la normativa y sin afirmaciones que la marca no pueda sostener si se las piden.',
  },
  {
    q: '¿Viajas para rodar?',
    a: 'Sí, y cuanto más lejos mejor. Trabajo desde Murcia pero me muevo por toda España y fuera. Los gastos de desplazamiento van desglosados aparte en el presupuesto.',
  },
  {
    q: '¿Qué me entregas al final?',
    a: 'El máster en horizontal, las versiones verticales para redes, las fotos seleccionadas y el texto de publicación. Todo listo para subir, no material en bruto para que lo edite otro.',
  },
] as const;

/**
 * La marquesina. Antes decía "Disponible para colaboraciones" seguido de
 * categorías sueltas: ocupaba el sitio donde el ojo busca logos de clientes
 * y lo que leía era que no los hay. Ahora enumera lo que sabes entregar,
 * que es cierto hoy y no suena a hueco por llenar.
 *
 * Cuando tengas clientes reales, sustitúyelos aquí por sus nombres: es el
 * único cambio que hace falta, la marquesina sale sola en dos sitios.
 */
export const brands = [
  'Dirección creativa',
  'Rodaje en exteriores',
  'Edición y color',
  'Fotografía de producto',
  'Vertical para redes',
  'Dron',
  'Campañas de running',
  'Outdoor y viajes',
] as const;

/* ------------------------------------------------------------------ */
/* CONTACTO                                                            */
/* ------------------------------------------------------------------ */

export const contact = {
  /**
   * Formulario real, sin backend propio.
   * 1. Entra en https://web3forms.com, pon tu email y copia la Access Key.
   * 2. Pégala aquí (o en .env como PUBLIC_WEB3FORMS_KEY).
   * Mientras esté vacío, el formulario cae elegantemente a un mailto.
   */
  formAccessKey: import.meta.env.PUBLIC_WEB3FORMS_KEY ?? '',
  endpoint: 'https://api.web3forms.com/submit',
  budgets: ['< 1.000 €', '1.000 – 3.000 €', '3.000 – 8.000 €', '> 8.000 €', 'Aún por definir'],
  subjects: ['Contenido de marca', 'Campaña', 'Fotografía', 'Embajador', 'Otra cosa'],
} as const;
