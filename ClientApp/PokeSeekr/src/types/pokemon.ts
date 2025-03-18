export interface PokemonCard {
  id: number;
  tcgId: string;
  name: string;
  supertype: string;
  level: string | null;
  hp: string | null;
  evolvesFrom: string | null;
  number: string;
  artist: string;
  rarity: string;
  flavorText: string | null;
  imageSmall: string;
  imageLarge: string;
  downloaded: boolean | null;
  averageColor: [number, number, number];
  setName: string;
  imageUrl: string; // For backward compatibility
  // Additional properties from PokemonTcgSdk
  evolvesTo: string | null;
  regulationMark: string | null;
  types: string | null;
  subtypes: string | null;
  rules: string | null;
  legalities: string | null;
  attacks: string | null;
  weaknesses: string | null;
  resistances: string | null;
  abilities: string | null;
  tcgUrl: string | null;
  cardMarket: string | null;
  tcgPlayerPriceNormal: number | null;
  tcgPlayerPriceHolofoil: number | null;
  cardMarketPrice: number | null;
} 