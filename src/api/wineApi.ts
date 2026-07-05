import { type WineNote, type WineFormData } from '../types/wine';

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '';

interface ApiWine {
  id: number;
  producer: string;
  name: string;
  vintage: string;
  color: string;
  region: string;
  country: string;
  grape: string;
  abv: number | null;
  appearance: string;
  appearance_intensity: string;
  appearance_color: string;
  nose_intensity: string;
  nose: string[];
  sweetness: string;
  acidity: string;
  tannin: string;
  alcohol_level: string;
  body: string;
  flavour_intensity: string;
  palate: string[];
  finish_length: string;
  finish: string;
  quality: string;
  ageing: string;
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
    grape: (d.grape ?? '').split(',').map((s) => s.trim()).filter(Boolean),
    abv: d.abv ?? null,
    appearance: d.appearance ?? '',
    appearanceIntensity: (d.appearance_intensity ?? '') as WineNote['appearanceIntensity'],
    appearanceColor: d.appearance_color ?? '',
    noseIntensity: (d.nose_intensity ?? '') as WineNote['noseIntensity'],
    nose: d.nose ?? [],
    sweetness: (d.sweetness ?? '') as WineNote['sweetness'],
    acidity: (d.acidity ?? '') as WineNote['acidity'],
    tannin: (d.tannin ?? '') as WineNote['tannin'],
    alcoholLevel: (d.alcohol_level ?? '') as WineNote['alcoholLevel'],
    body: (d.body ?? '') as WineNote['body'],
    flavourIntensity: (d.flavour_intensity ?? '') as WineNote['flavourIntensity'],
    palate: d.palate ?? [],
    finishLength: (d.finish_length ?? '') as WineNote['finishLength'],
    finish: d.finish ?? '',
    quality: (d.quality ?? '') as WineNote['quality'],
    ageing: d.ageing ?? '',
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
    grape: d.grape.join(', '),
    abv: d.abv,
    appearance: d.appearance,
    appearance_intensity: d.appearanceIntensity,
    appearance_color: d.appearanceColor,
    nose_intensity: d.noseIntensity,
    nose: d.nose,
    sweetness: d.sweetness,
    acidity: d.acidity,
    tannin: d.tannin,
    alcohol_level: d.alcoholLevel,
    body: d.body,
    flavour_intensity: d.flavourIntensity,
    palate: d.palate,
    finish_length: d.finishLength,
    finish: d.finish,
    quality: d.quality,
    ageing: d.ageing,
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
  const res = await fetch(url, { ...options, credentials: 'include' });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.status === 204 ? (undefined as T) : res.json();
}

export async function fetchWines(): Promise<WineNote[]> {
  const data = await request<{ results: ApiWine[] }>(`${API_BASE}/api/wines/?ordering=-date_tasted,-created_at`);
  return data.results.map(fromApi);
}

export async function fetchWine(id: number): Promise<WineNote> {
  const data = await request<ApiWine>(`${API_BASE}/api/wines/${id}/`);
  return fromApi(data);
}

export async function createWine(formData: WineFormData): Promise<WineNote> {
  const data = await request<ApiWine>(`${API_BASE}/api/wines/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(formData)),
  });
  return fromApi(data);
}

export async function updateWine(id: number, formData: WineFormData): Promise<WineNote> {
  const data = await request<ApiWine>(`${API_BASE}/api/wines/${id}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(toApi(formData)),
  });
  return fromApi(data);
}

export async function deleteWine(id: number): Promise<void> {
  await request<void>(`${API_BASE}/api/wines/${id}/`, { method: 'DELETE' });
}
