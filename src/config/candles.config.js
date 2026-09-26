// Everything a candle shop needs to make this template its own.
// Swap image URLs for real product photography before launch.
export default {
  brand: {
    name: 'Wick & Ember',
    logoInitial: 'W',
  },
  theme: {
    accent: '#B4791F',
    accentSoft: '#EFDCB8',
  },
  nav: [
    { label: 'Shop', href: '#products' },
    { label: 'Collections', href: '#categories' },
    { label: 'Our story', href: '#about' },
    { label: 'Journal', href: '#' },
  ],
  hero: {
    headline: 'Slow-burning candles, poured by hand',
    subhead:
      'Small batches, natural soy wax, and scents built around the way a room actually feels in the evening.',
    ctaLabel: 'Shop the collection',
    ctaHref: '#products',
    image: 'https://picsum.photos/seed/candle-hero/1000/1200',
  },
  categories: [
    { name: 'Signature scents', image: 'https://picsum.photos/seed/candle-cat1/700/900', href: '#', size: 'large' },
    { name: 'Unscented + minimal', image: 'https://picsum.photos/seed/candle-cat2/700/500', href: '#', size: 'small' },
    { name: 'Gift sets', image: 'https://picsum.photos/seed/candle-cat3/700/500', href: '#', size: 'small' },
  ],
  products: [
    { name: 'Amber & Oak', price: '$34', tag: 'Best seller', image: 'https://picsum.photos/seed/candle-p1/600/700' },
    { name: 'Fig Leaf', price: '$32', tag: null, image: 'https://picsum.photos/seed/candle-p2/600/700' },
    { name: 'Salt Air', price: '$32', tag: 'New', image: 'https://picsum.photos/seed/candle-p3/600/700' },
    { name: 'Quiet Pine', price: '$36', tag: null, image: 'https://picsum.photos/seed/candle-p4/600/700' },
  ],
  about: {
    heading: 'Poured in small batches, twelve at a time',
    body: 'We started in a two-burner kitchen testing wax blends until the scent throw was right without being loud. Every candle is still poured, labeled, and packed by the same small team, which is the only way we know to keep it consistent.',
    image: 'https://picsum.photos/seed/candle-about/900/1100',
  },
  testimonial: {
    quote:
      'The scent fills the room without taking it over, and mine have burned evenly right down to the bottom of the jar.',
    author: 'Priya N.',
    role: 'Repeat customer',
  },
  newsletter: {
    heading: 'New scents, twice a season',
    subhead: 'No spam — just a note when something new is ready to pour.',
    ctaLabel: 'Sign up',
  },
  footer: {
    columns: [
      { heading: 'Shop', links: ['Signature scents', 'Gift sets', 'Refill program'] },
      { heading: 'Company', links: ['Our story', 'Wholesale', 'Journal'] },
      { heading: 'Support', links: ['Shipping', 'Returns', 'Contact'] },
    ],
  },
}
