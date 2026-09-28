/**
 * ENGLISH — one self-contained page for international brands and agencies.
 *
 * This is not a translation of the whole site. It is the pitch: who he is,
 * what he shoots, the audience, what it costs to work together and how to
 * start. Everything an agency needs before writing the first email.
 *
 * Numbers, photos and social links are shared with the Spanish version
 * (imported from site.ts), so there is only ever one place to update them.
 */

export const en = {
  role: 'Content creator',
  nav: [
    { label: 'Who', href: '#who', index: '01' },
    { label: 'Work', href: '#work', index: '02' },
    { label: 'Audience', href: '#audience', index: '03' },
    { label: 'Services', href: '#services', index: '04' },
    { label: 'Contact', href: '#contact', index: '07' },
  ],
  footer: { where: 'Where', index: 'Index', follow: 'Follow', write: 'Write', made: 'Built with dust and patience', by: 'Design and development by' },
  location: 'Murcia, Spain',
  title: 'Running, travel and lifestyle content for brands',
  description:
    'Diego DPL is a running, travel and lifestyle content creator based in Murcia, Spain. He directs, shoots and edits his own work with a documentary, film-grain look. Available for brand campaigns across Europe and beyond.',
  claim:
    'Running, travel and the kind of stories you only tell after you have walked them.',

  intro: [
    'I direct, shoot and edit everything myself. No crew, no agency in the middle — you talk to the person doing the work, and the piece you approve is the piece that ships.',
    'I shoot what I know: empty roads, hard midday light, people who keep going after it stops being fun. Real grain, warm colour, nothing plastic. If the sweat is there, you see it.',
    'I work with brands that understand an audience is not rented for one post. It is built the same way as everything else: by showing up again the next day.',
  ],

  /** Captions for the gallery. Same order as `work` in site.ts. */
  captions: [
    {
      title: 'When it is done',
      caption:
        'The minute after the last kilometre. Nobody films this one, and it is the only one that says anything true.',
      capability: ['Backlight', 'Location portrait'],
      alt: 'Runner lying on his back on the asphalt, catching his breath after a run',
    },
    {
      title: 'Out of breath',
      caption:
        'Low angle against open sky. Good for technical apparel: the garment is worn and under real effort, not hanging in a studio.',
      capability: ['Low angle', 'Product in use'],
      alt: 'Low-angle shot of a runner in a cap, sunglasses and hydration vest breathing against a blue sky',
    },
    {
      title: 'The trail from above',
      caption:
        'Drone at dusk. The scale of the terrain and one small figure — the frame that turns an ordinary run into a story.',
      capability: ['Drone', 'Landscape'],
      alt: 'Aerial view of a dirt trail winding across a scrubland hillside at dusk',
    },
    {
      title: 'When the wind drops',
      caption:
        'Last light on flat water. The clean frame that opens a campaign, or lets a feed breathe between harder pieces.',
      capability: ['Landscape', 'Golden hour'],
      alt: 'Calm sea at sunset, an island on the horizon and clouds tinged pink',
    },
    {
      title: 'Blue hour',
      caption:
        'The twenty minutes before sunrise. Cold light, no hard shadows, and very few people willing to get up for it.',
      capability: ['Blue hour', 'Tracking shot'],
      alt: 'Runner seen from behind on a dirt track before sunrise, with the valley and mountains beyond',
    },
    {
      title: 'Loose ground',
      caption:
        'Handheld, running behind. When a brand wants real movement instead of a pose, this is how it gets shot.',
      capability: ['Handheld', 'Motion'],
      alt: 'Runner seen from behind on a trail through dry scrub, with the sierra in the background',
    },
  ],

  /**
   * Advertising-law credential. Deliberately NOT translated as "state
   * certified": AUTOCONTROL is Spain's advertising self-regulation body,
   * not a public authority. Dates and the PDF live in site.ts.
   */
  cert: {
    fact: 'Certified in Spanish advertising law',
    label: 'AUTOCONTROL certificate',
    name: 'Basic training for influencers on advertising regulation',
    issuer: 'Spanish Association for Advertising Self-Regulation',
    valid: 'Valid until February 2028',
    heading: 'The small print, covered',
    body:
      'I hold AUTOCONTROL certification on advertising regulation for content creators. In practice: your campaign is labelled as advertising from the first frame, in the wording Spanish law expects, with no claim the brand cannot back up if asked.',
  },

  metricLabels: ['Community', 'Views', 'Audience 25–44'],
  metricNotes: ['Instagram + TikTok', 'Last 30 days', 'Core group'],
  audienceTitle: 'Who watches',
  audienceLabels: ['Ages 25–34', 'Ages 35–44', 'Ages 18–24', 'Other ages'],
  audienceNote:
    'The numbers matter less than who is behind them. My community trains, travels and buys gear because they use it — not because they saw it scroll past.',
  audienceSource: 'Instagram Insights and TikTok Analytics · Updated quarterly',

  services: [
    {
      index: '01',
      title: 'Branded content',
      body: 'Vertical pieces for Instagram and TikTok in the documentary look that defines my feed. From the idea to the master, with nobody in between.',
      includes: ['Concept and script', 'Shoot', 'Edit and colour', 'Delivery and copy'],
    },
    {
      index: '02',
      title: 'Campaign and direction',
      body: 'When a brand needs more than a post: one idea strong enough to hold several pieces, and a visual language of its own.',
      includes: ['Creative direction', 'Moodboard', 'Production', 'Multi-format delivery'],
    },
    {
      index: '03',
      title: 'Photography',
      body: 'Product, portrait and landscape in natural light. Real grain, nothing plastic. Images that hold up on a billboard and in a feed.',
      includes: ['Shoot', 'Selection and grade', 'Usage rights', 'Web and print formats'],
    },
    {
      index: '04',
      title: 'Ambassador',
      body: 'A long relationship instead of a one-off hit. Continued presence, product genuinely integrated, and real numbers every month.',
      includes: ['Quarterly plan', 'Recurring content', 'Events and races', 'Results report'],
    },
  ],

  processTitle: 'Few pieces. Made properly.',
  process: [
    { k: 'We talk.', v: 'What you want to say and who to. Half an hour is enough.' },
    { k: 'I propose.', v: 'Concept, references, formats and a fixed quote.' },
    { k: 'We shoot.', v: 'I handle everything. You approve once.' },
    { k: 'I deliver.', v: 'Master, verticals, stills and copy. With clear usage rights.' },
    { k: 'We measure.', v: 'A real report at thirty days. No decoration.' },
  ],

  faqs: [
    {
      q: 'Who shoots and edits?',
      a: 'I do. From the idea to the master: concept, shoot, edit and colour. No crew and no subcontractors, so you always speak to the person doing the work.',
    },
    {
      q: 'What does a collaboration cost?',
      a: 'It depends on the scope — a single piece is not a campaign with several deliverables. Tell me what you need and I will send a fixed quote, with no extras halfway through.',
    },
    {
      q: 'Can we use the content in paid media?',
      a: 'Yes, if we agree it beforehand. Usage rights are set out in writing in the quote: where it runs, for how long and in which formats. No grey areas.',
    },
    {
      q: 'Do you know how advertising must be disclosed in Spain?',
      a: 'Yes, and it is certified: I hold AUTOCONTROL\'s basic training certificate for influencers on advertising regulation. Every paid piece is labelled as advertising from the start, in the format the rules require, with no claims the brand could not defend.',
    },
    {
      q: 'Do you travel to shoot?',
      a: 'Yes, and the further the better. I am based in Murcia but I work across Spain and abroad. Travel costs are itemised separately in the quote.',
    },
    {
      q: 'What do I get at the end?',
      a: 'The horizontal master, vertical cuts for social, the selected stills and the caption copy. Ready to publish, not raw footage for somebody else to edit.',
    },
  ],

  form: {
    name: 'Your name',
    namePh: 'First and last name',
    email: 'Your email',
    emailPh: 'you@brand.com',
    company: 'Brand or project',
    companyPh: 'Optional',
    subject: 'What you need',
    budget: 'Budget',
    message: 'The idea',
    messagePh: 'What you want to say, by when, and where it will live.',
    choose: 'Choose one',
    send: 'Send',
    sending: 'Sending…',
    ok: 'Got it. I will reply within 48 hours.',
    error: 'Could not send. Email me directly instead.',
    mailto: 'Opening your email client…',
    subjects: ['Branded content', 'Campaign', 'Photography', 'Ambassador', 'Something else'],
    budgets: ['< €1,000', '€1,000 – €3,000', '€3,000 – €8,000', '> €8,000', 'Not defined yet'],
  },
} as const;
