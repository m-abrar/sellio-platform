import { Property, Event, Auto, Service, Job, Classified, Product } from './types';

export const PROPERTIES: Property[] = [
  {
    id: 'p1',
    title: 'Modern Downtown Loft',
    description: 'Spacious loft with city views and industrial finish.',
    price: 2500,
    image: 'https://picsum.photos/seed/prop1/800/600',
    category: 'Apartment',
    type: 'rent',
    location: 'New York, NY',
    beds: 2,
    baths: 2
  },
  {
    id: 'p2',
    title: 'Cozy Suburban Home',
    description: 'Perfect family home with a large backyard.',
    price: 450000,
    image: 'https://picsum.photos/seed/prop2/800/600',
    category: 'House',
    type: 'sale',
    location: 'Austin, TX',
    beds: 3,
    baths: 2
  }
];

export const EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Tech Conference 2024',
    description: 'The biggest tech event of the year.',
    price: 299,
    image: 'https://picsum.photos/seed/event1/800/600',
    category: 'Conference',
    date: '2024-09-15',
    location: 'San Francisco, CA',
    availableTickets: 500
  },
  {
    id: 'e2',
    title: 'Summer Music Festival',
    description: 'Three days of non-stop music and fun.',
    price: 150,
    image: 'https://picsum.photos/seed/event2/800/600',
    category: 'Music',
    date: '2024-07-20',
    location: 'Chicago, IL',
    availableTickets: 2000
  }
];

export const AUTOS: Auto[] = [
  {
    id: 'a1',
    title: 'Tesla Model 3',
    description: 'Electric performance and luxury.',
    price: 120,
    image: 'https://picsum.photos/seed/auto1/800/600',
    category: 'Electric',
    make: 'Tesla',
    model: 'Model 3',
    year: 2023,
    transmission: 'auto'
  },
  {
    id: 'a2',
    title: 'BMW M4',
    description: 'Ultimate driving machine.',
    price: 250,
    image: 'https://picsum.photos/seed/auto2/800/600',
    category: 'Sports',
    make: 'BMW',
    model: 'M4',
    year: 2022,
    transmission: 'auto'
  }
];

export const SERVICES: Service[] = [
  {
    id: 's1',
    title: 'House Cleaning',
    description: 'Professional deep cleaning for your home.',
    price: 80,
    image: 'https://picsum.photos/seed/service1/800/600',
    category: 'Home',
    provider: 'CleanCo',
    duration: '3 hours',
    rating: 4.8
  }
];

export const JOBS: Job[] = [
  {
    id: 'j1',
    title: 'Senior Frontend Developer',
    description: 'Join our team to build next-gen web apps.',
    price: 0,
    image: 'https://picsum.photos/seed/job1/800/600',
    category: 'Engineering',
    company: 'TechFlow',
    type: 'full-time',
    salaryRange: '$140k - $180k'
  }
];

export const CLASSIFIEDS: Classified[] = [
  {
    id: 'c1',
    title: 'Vintage Camera',
    description: 'Rare 35mm film camera in great condition.',
    price: 450,
    image: 'https://picsum.photos/seed/class1/800/600',
    category: 'Electronics',
    condition: 'used',
    seller: 'John Doe'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'pr1',
    title: 'Ergonomic Chair',
    description: 'Premium office chair for maximum comfort.',
    price: 350,
    image: 'https://picsum.photos/seed/prod1/800/600',
    category: 'Furniture',
    stock: 25,
    brand: 'ComfortMax'
  }
];
