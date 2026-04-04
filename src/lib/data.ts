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

export const categories: Category[] = [
  { id: '1', name: 'Oils', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&q=80&w=200' },
  { id: '2', name: 'Flours', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=200' },
  { id: '3', name: 'Dals', image: 'https://images.unsplash.com/photo-1615486171545-21d96b997cb6?auto=format&fit=crop&q=80&w=200' },
  { id: '4', name: 'Honey', image: 'https://images.unsplash.com/photo-1587049352847-8d4c0b4c8109?auto=format&fit=crop&q=80&w=200' },
  { id: '5', name: 'Rice', image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=200' },
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
    image: 'https://images.unsplash.com/photo-1601001831826-613d29a50275?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1555137279-d10af381d604?auto=format&fit=crop&q=80&w=600',
    description: '100% natural, cold-pressed groundnut oil retaining all essential nutrients, perfect for healthy cooking.'
  },
  {
    id: 'p3',
    name: 'Cold Pressed Coconut Oil',
    price: 280,
    stockStatus: 'In Stock',
    category: 'Oils',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1611078440078-deba5136ff93?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1615486171449-014ea487ea0b?auto=format&fit=crop&q=80&w=600',
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
    image: 'https://images.unsplash.com/photo-1587049352847-8d4c0b4c8109?auto=format&fit=crop&q=80&w=600',
    description: 'Raw, unpasteurized natural honey collected from deep forest beehives. No added sugars.'
  },
  {
    id: 'p6',
    name: 'Brown Basmati Rice',
    price: 190,
    stockStatus: 'In Stock',
    category: 'Rice',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e8ac?auto=format&fit=crop&q=80&w=600',
    description: 'Premium quality long-grain brown basmati rice rich in fiber and flavor.'
  },
  {
    id: 'p7',
    name: 'Whole Urad Dal',
    price: 180,
    stockStatus: 'In Stock',
    category: 'Dals',
    rating: 4.3,
    image: 'https://images.unsplash.com/photo-1615486171545-21d96b997cb6?auto=format&fit=crop&q=80&w=600',
    description: 'Unpolished whole urad dal retained with maximum protein and nutrition.'
  },
  {
    id: 'p8',
    name: 'Whole Wheat Flour',
    price: 60,
    stockStatus: 'In Stock',
    category: 'Flours',
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=600',
    description: 'Freshly milled whole wheat chakki atta, making softer and healthier rotis.'
  }
];

export const bestSellers = ['p1', 'p2', 'p5', 'p8'];
