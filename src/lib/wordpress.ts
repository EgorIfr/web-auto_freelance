interface WP_Rendered {
  rendered: string;
}

export interface WP_Image {
  source_url: string;
  alt_text: string;
}

export interface WP_Post {
  id: number;
  date: string;
  slug: string;
  title: WP_Rendered;
  content: WP_Rendered;
  excerpt: WP_Rendered;
  _embedded?: {
    'wp:featuredmedia'?: WP_Image[];
  };
}

export interface Service_ACF {
  price?: string;
  short_description?: string;
}

export interface Testimonial_ACF {
  rating?: string; // ACF often returns numbers as strings
  car_model?: string;
  client_name?: string;
}

export interface WP_Service extends WP_Post {
  acf?: Service_ACF;
}

export interface WP_Testimonial extends WP_Post {
  acf?: Testimonial_ACF;
}

const API_URL =
  import.meta.env.WORDPRESS_API_URL ||
  'http://localhost/wordpress/wp-json/wp/v2';

async function fetchAPI<T>(endpoint: string): Promise<T[]> {
  const url = `${API_URL}/${endpoint}?_embed&per_page=100`;

  try {
    const res = await fetch(url);

    if (!res.ok) {
      console.error(`Failed to fetch ${url}: ${res.status} ${res.statusText}`);
      return [];
    }

    const data = await res.json();
    return data as T[];
  } catch (err) {
    console.error(`Error fetching from WordPress at ${url}:`, err);
    return [];
  }
}

export async function getServices(): Promise<WP_Service[]> {
  return fetchAPI<WP_Service>('services');
}

export async function getTestimonials(): Promise<WP_Testimonial[]> {
  return fetchAPI<WP_Testimonial>('testimonials');
}

export function getFeaturedImage(post: WP_Post): string {
  if (
    post._embedded &&
    post._embedded['wp:featuredmedia'] &&
    post._embedded['wp:featuredmedia'][0]
  ) {
    return post._embedded['wp:featuredmedia'][0].source_url;
  }
  return '';
}
