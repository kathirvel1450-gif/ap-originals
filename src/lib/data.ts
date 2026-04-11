export type Category = {
  id: string;
  name: string;
  image: string;
};

export type Product = {
  id: string;
  name: string;
  price: number;
  discountPercentage?: number;
  stockStatus: 'In Stock' | 'Out of Stock' | 'Low Stock';
  category: string;
  rating: number;
  image: string;
  description: string;
};

export const seedCategories: Category[] = [
  { id: '1', name: 'Oils', image: '/images/categories/oils.jpg' },
  { id: '2', name: 'Flours', image: '/images/categories/flours.jpg' },
  { id: '3', name: 'Dals', image: '/images/categories/dals.jpg' },
  { id: '4', name: 'Honey', image: '/images/categories/honey.jpg' },
  { id: '5', name: 'Rice', image: '/images/categories/rice.jpg' },
];

export const seedProducts: Product[] = [
  {
    id: 'p1',
    name: 'Pure Cow Ghee',
    price: 800,
    discountPercentage: 18,
    stockStatus: 'In Stock',
    category: 'Oils',
    rating: 4.9,
    image: '/images/products/pure-cow-ghee.jpg',
    description: 'Authentic pure cow ghee made completely from A2 milk using the traditional bilona method.'
  },
  {
    id: 'p2',
    name: 'Cold Pressed Groundnut Oil',
    price: 350,
    discountPercentage: 8,
    stockStatus: 'In Stock',
    category: 'Oils',
    rating: 4.8,
    image: '/images/products/groundnut-oil.jpg',
    description: '100% natural, cold-pressed groundnut oil retaining all essential nutrients, perfect for healthy cooking.'
  },
  {
    id: 'p3',
    name: 'Cold Pressed Coconut Oil',
    price: 280,
    stockStatus: 'In Stock',
    category: 'Oils',
    rating: 4.7,
    image: '/images/products/coconut-oil.jpg',
    description: 'Premium quality cold-pressed coconut oil, naturally extracted, unrefined, and perfect for diet and hair care.'
  },
  {
    id: 'p4',
    name: 'Organic Turmeric Powder',
    price: 200,
    discountPercentage: 25,
    stockStatus: 'In Stock',
    category: 'Flours',
    rating: 4.9,
    image: '/images/products/turmeric-powder.jpg',
    description: 'Bright, pure, and aromatic organic turmeric powder containing high curcumin.'
  },
  {
    id: 'p5',
    name: 'Forest Honey',
    price: 500,
    discountPercentage: 10,
    stockStatus: 'Low Stock',
    category: 'Honey',
    rating: 5.0,
    image: '/images/products/forest-honey.jpg',
    description: 'Raw, unpasteurized natural honey collected from deep forest beehives. No added sugars.'
  },
  {
    id: 'p6',
    name: 'Brown Basmati Rice',
    price: 190,
    stockStatus: 'In Stock',
    category: 'Rice',
    rating: 4.6,
    image: '/images/products/brown-basmati-rice.jpg',
    description: 'Premium quality long-grain brown basmati rice rich in fiber and flavor.'
  },
  {
    id: 'p7',
    name: 'Whole Urad Dal',
    price: 180,
    stockStatus: 'In Stock',
    category: 'Dals',
    rating: 4.3,
    image: '/images/products/whole-urad-dal.jpg',
    description: 'Unpolished whole urad dal retained with maximum protein and nutrition.'
  },
  {
    id: 'p8',
    name: 'Whole Wheat Flour',
    price: 60,
    stockStatus: 'In Stock',
    category: 'Flours',
    rating: 4.5,
    image: '/images/products/whole-wheat-flour.jpg',
    description: 'Freshly milled whole wheat chakki atta, making softer and healthier rotis.'
  }
];

export const bestSellers = ['p1', 'p2', 'p5', 'p8'];
