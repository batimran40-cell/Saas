// Same components as the candle config — only content, imagery and
// the accent color change. This is the whole point of the template.
export default {
  brand: {
    name: 'Fleet Trail',
    logoInitial: 'F',
  },
  theme: {
    accent: '#2447C4',
    accentSoft: '#D6DFFA',
  },
  nav: [
    { label: 'Shop', href: '#products' },
    { label: 'Categories', href: '#categories' },
    { label: 'About us', href: '#about' },
    { label: 'Support', href: '#' },
  ],
  hero: {
    headline: 'Running shoes built for real miles',
    subhead:
      'Tested on gravel, pavement and everything in between, by a team that runs the product before it ships.',
    ctaLabel: 'Shop running shoes',
    ctaHref: '#products',
    image: 'https://picsum.photos/seed/shoe-hero/1000/1200',
  },
  categories: [
    { name: 'Road running', image: 'https://picsum.photos/seed/shoe-cat1/700/900', href: '#', size: 'large' },
    { name: 'Trail', image: 'https://picsum.photos/seed/shoe-cat2/700/500', href: '#', size: 'small' },
    { name: 'Everyday', image: 'https://picsum.photos/seed/shoe-cat3/700/500', href: '#', size: 'small' },
  ],
  products: [
    { name: 'Trailmark 2', price: '$129', tag: 'Best seller', image: 'https://picsum.photos/seed/shoe-p1/600/700' },
    { name: 'Roadline', price: '$119', tag: null, image: 'https://picsum.photos/seed/shoe-p2/600/700' },
    { name: 'Glide Low', price: '$139', tag: 'New', image: 'https://picsum.photos/seed/shoe-p3/600/700' },
    { name: 'Pace Knit', price: '$109', tag: null, image: 'https://picsum.photos/seed/shoe-p4/600/700' },
  ],
  about: {
    heading: 'Built by people who run before work',
    body: 'Every prototype does at least fifty miles on our own feet before it moves forward. That is slower than most shoe companies would like, but it is why the fit holds up past the first few runs, not just in the box.',
    image: 'https://picsum.photos/seed/shoe-about/900/1100',
  },
  testimonial: {
    quote:
      'First pair that did not need a break-in period — laced up and ran twelve miles the same day.',
    author: 'Marcus T.',
    role: 'Marathon runner',
  },
  newsletter: {
    heading: 'Get early access to new releases',
    subhead: 'A short note before each drop, nothing in between.',
    ctaLabel: 'Notify me',
  },
  footer: {
    columns: [
      { heading: 'Shop', links: ['Road running', 'Trail', 'Sale'] },
      { heading: 'Company', links: ['About us', 'Careers', 'Sustainability'] },
      { heading: 'Support', links: ['Sizing guide', 'Returns', 'Contact'] },
    ],
  },
}
