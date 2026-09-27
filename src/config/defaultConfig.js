export default function defaultConfig() {
  return {
    brand: { name: 'Your Shop Name', logoInitial: 'Y' },
    theme: { accent: '#2447C4', accentSoft: '#D6DFFA', layout: 'split', preset: 'editorial' },
    nav: [
      { label: 'Shop', href: '#products' },
      { label: 'Collections', href: '#categories' },
      { label: 'About', href: '#about' },
    ],
    hero: {
      headline: 'Your headline goes here',
      subhead: 'A short line about what you sell and why it is worth buying, in your own words.',
      ctaLabel: 'Shop now',
      ctaHref: '#products',
      image: 'https://picsum.photos/seed/new-shop-hero/1000/1200',
    },
    categories: [
      { name: 'Category one', image: 'https://picsum.photos/seed/new-shop-cat1/700/900', href: '#', size: 'large' },
      { name: 'Category two', image: 'https://picsum.photos/seed/new-shop-cat2/700/500', href: '#', size: 'small' },
    ],
    products: [
      { name: 'Product one', price: '$0', tag: null, image: 'https://picsum.photos/seed/new-shop-p1/600/700', description: 'Say a little about this product — materials, size, or what makes it worth buying.' },
      { name: 'Product two', price: '$0', tag: null, image: 'https://picsum.photos/seed/new-shop-p2/600/700', description: 'Say a little about this product — materials, size, or what makes it worth buying.' },
    ],
    about: {
      heading: 'Your story',
      body: 'Say a little about how this shop started and what makes it different. Edit this from your dashboard.',
      image: 'https://picsum.photos/seed/new-shop-about/900/1100',
    },
    testimonial: {
      quote: 'Add a real customer quote here once you have one.',
      author: 'Customer name',
      role: 'Customer',
    },
    newsletter: {
      heading: 'Stay in the loop',
      subhead: 'Add a short reason someone should sign up.',
      ctaLabel: 'Sign up',
    },
    footer: {
      columns: [
        { heading: 'Shop', links: ['Category one', 'Category two'] },
        { heading: 'Company', links: ['About', 'Contact'] },
      ],
    },
  }
}
