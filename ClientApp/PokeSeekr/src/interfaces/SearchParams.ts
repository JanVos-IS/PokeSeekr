export interface SearchParams {
  name: string | null;
  rarity: string | null;
  artist: string | null;
  set: string | null;
  color: [number, number, number] | null;
}
