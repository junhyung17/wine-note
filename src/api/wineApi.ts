import { type WineNote, type WineFormData } from '../types/wine';

interface ApiWine {
  id: number;
  producer: string;
  name: string;
  vintage: string;
  color: string;
  region: string;
  country: string;
  grape: string;
  appearance: string;
  nose: string[];
  palate: string[];
  finish: string;
  my_rating: number;
  vivino_rating: string;
  price: string;
  currency: string;
  purchase_location: string;
  wine_searcher_price: string;
  food_pairing: string[];
  photos: string[];
  notes: string;
  date_tasted: string | null;
  created_at: string;
  updated_at: string;
}

function fromApi(d: ApiWine): WineNote {
  return {
    id: d.id,
    producer: d.producer ?? '',
    name: d.name ?? '',
    vintage: d.vintage ?? '',
    color: (d.color ?? 'red') as WineNote['color'],
    region: d.region ?? '',
    country: d.country ?? '',
    grape: d.grape ?? '',
    appearance: d.appearance ?? '',
    nose: d.nose ?? [],
    palate: d.palate ?? [],
    finish: d.finish ?? '',
    myRating: d.my_rating ?? 0,
    vivinoRating: d.vivino_rating ?? '',
    price: d.price ?? '',
    currency: d.currency ?? 'KRW',
    purchaseLocation: d.purchase_location ?? '',
    wineSearcherPrice: d.wine_searcher_price ?? '',
    foodPairing: d.food_pairing ?? [],
    photos: d.photos ?? [],
    notes: d.notes ?? '',
    dateTasted: d.date_tasted ?? '',
    createdAt: d.created_at ?? '',
    updatedAt: d.updated_at ?? '',
  };
}

function toApi(d: WineFormData): Record<string, unknown> {
  return {
    producer: d.producer,
    name: d.name,
    vintage: d.vintage,
    color: d.color,
    region: d.region,
    country: d.country,
    grape: d.grape,
    appearance: d.appearance,
    nose: d.nose,
    palate: d.palate,
    finish: d.finish,
    my_rating: d.myRating,
    vivino_rating: d.vivinoRating,
    price: d.price,
    currency: d.currency,
    purchase_location: d.purchaseLocation,
    wine_searcher_price: d.wineSearcherPrice,
    food_pairing: d.foodPairing,
    photos: d.photos,
    notes: d.notes,
    date_tasted: d.dateTasted || null,
  };
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function fetchWines(): Promise<WineNote[]> {
  const data = await request<{ results: ApiWine[] }>('/api/wines/?ordering=-date_tasted,-created_at');
  return data.results.map(fromApi);
}

export async function fetchWine(id: number): Promise<WineNote> {
  const data = await request<ApiWine>(`/api/wines/${id}/`);
  return fromApi(data);
}

export async function createWine(formData: WineFormData): Promise<WineNote> {
  const data = await request<ApiWine>('/api/wines/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(formData)),
  });
  return fromApi(data);
}

export async function updateWine(id: number, formData: WineFormData): Promise<WineNote> {
  const data = await request<ApiWine>(`/api/wines/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(formData)),
  });
  return fromApi(data);
}

export async function deleteWine(id: number): Promise<void> {
  await request<void>(`/api/wines/${id}/`, { method: 'DELETE' });
}
