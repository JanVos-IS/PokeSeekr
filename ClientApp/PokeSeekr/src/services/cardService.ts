// Backend response type
interface CardResponse {
  pokemonCardId: number;
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

// Frontend card type
export interface Card {
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
  imageUrl: string;
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

interface SearchParams {
  name: string | null;
  rarity: string | null;
  artist: string | null;
  set: string | null;
  color: [number, number, number] | null;
}

const API_BASE_URL = 'https://pokeseekr.azurewebsites.net';

export const searchCards = async (params: SearchParams): Promise<Card[]> => {
  const response = await fetch(`${API_BASE_URL}/query/search`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name: params.name || null,
      rarity: params.rarity === 'all' ? null : params.rarity,
      artist: params.artist === 'all' ? null : params.artist,
      set: params.set === 'all' ? null : params.set,
      color: params.color || null,
    }),
  });

  if (!response.ok) {
    throw new Error('Search failed');
  }

  const data: CardResponse[] = await response.json();
  
  // Map the backend response to the frontend card format
  return data.map(card => ({
    id: card.pokemonCardId,
    tcgId: card.tcgId,
    name: card.name,
    supertype: card.supertype,
    level: card.level,
    hp: card.hp,
    evolvesFrom: card.evolvesFrom,
    number: card.number,
    artist: card.artist,
    rarity: card.rarity,
    flavorText: card.flavorText,
    imageSmall: card.imageSmall,
    imageLarge: card.imageLarge,
    downloaded: card.downloaded,
    averageColor: card.averageColor,
    setName: card.setName,
    imageUrl: card.imageLarge || card.imageSmall, // Prefer large image if available
    evolvesTo: card.evolvesTo,
    regulationMark: card.regulationMark,
    types: card.types,
    subtypes: card.subtypes,
    rules: card.rules,
    legalities: card.legalities,
    attacks: card.attacks,
    weaknesses: card.weaknesses,
    resistances: card.resistances,
    abilities: card.abilities,
    tcgUrl: card.tcgUrl,
    cardMarket: card.cardMarket,
    tcgPlayerPriceNormal: card.tcgPlayerPriceNormal,
    tcgPlayerPriceHolofoil: card.tcgPlayerPriceHolofoil,
    cardMarketPrice: card.cardMarketPrice,
  }));
};

export const getArtists = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/query/artists`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch artists');
  }

  return response.json();
};

export const getRarities = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/query/rarities`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch rarities');
  }

  return response.json();
};

export const getSets = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/query/sets`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch sets');
  }

  // The API returns Set objects, but we only need the names for the dropdown
  const sets = await response.json();
  return sets.map((set: { name: string }) => set.name);
}; 