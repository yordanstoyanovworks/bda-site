import { createClient } from '@sanity/client';

export const client = createClient({
  projectId: 'dq09sslz',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: true,
});

export interface Category {
  _id: string;
  name: string;
  slug: { current: string };
}

export interface City {
  _id: string;
  name: string;
  slug: { current: string };
}

export interface Agency {
  _id: string;
  name: string;
  slug: { current: string };
  website: string;
  categories: Category[];
  cities: City[];
  description?: string;
}

export async function getAgencies(): Promise<Agency[]> {
  return client.fetch(`
    *[_type == "agency"] | order(name asc) {
      _id,
      name,
      slug,
      website,
      "categories": categories[]->{ _id, name, slug },
      "cities": cities[]->{ _id, name, slug },
      description
    }
  `);
}

export async function getCategories(): Promise<Category[]> {
  return client.fetch(`
    *[_type == "category"] | order(name asc) {
      _id,
      name,
      slug
    }
  `);
}

export async function getCities(): Promise<City[]> {
  return client.fetch(`
    *[_type == "city"] | order(name asc) {
      _id,
      name,
      slug
    }
  `);
}
