import { type WineNote, type WineFormData } from '../types/wine';

const STORAGE_KEY = 'vinnote_wines';

export function getWines(): WineNote[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveWines(wines: WineNote[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(wines));
}

export function addWine(formData: WineFormData): WineNote {
  const wines = getWines();
  const now = new Date().toISOString();
  const newWine: WineNote = {
    ...formData,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  saveWines([newWine, ...wines]);
  return newWine;
}

export function updateWine(id: string, formData: WineFormData): WineNote | null {
  const wines = getWines();
  const index = wines.findIndex((w) => w.id === id);
  if (index === -1) return null;
  const updated: WineNote = {
    ...formData,
    id,
    createdAt: wines[index].createdAt,
    updatedAt: new Date().toISOString(),
  };
  wines[index] = updated;
  saveWines(wines);
  return updated;
}

export function deleteWine(id: string): void {
  const wines = getWines();
  saveWines(wines.filter((w) => w.id !== id));
}

export function getWineById(id: string): WineNote | undefined {
  return getWines().find((w) => w.id === id);
}
