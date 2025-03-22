import apiConfig from '../config/apiConfig'; // Adjust the import path as necessary
import { mapCardResponseToCard } from './cardMapper'; // Adjust the import path as necessary
import { CardResponse } from '../interfaces/CardResponse'; // Adjust the import path as necessary
import { Card } from '../interfaces/Card'; // Adjust the import path as necessary
import { SearchParams } from '../interfaces/SearchParams'; // Adjust the import path as necessary

const API_BASE_URL = apiConfig.baseUrl;

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
  return data.map(mapCardResponseToCard);
};

export const getCardsByTcgIds = async (tcgIds: string[]): Promise<Card[]> => {
  const response = await fetch(`${API_BASE_URL}/query/cards/tcgids`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([...tcgIds]),
  });

  if (!response.ok) { 
    throw new Error('Failed to fetch cards by tcgids');
  }

  const data: CardResponse[] = await response.json();
  return data.map(mapCardResponseToCard);
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