import { PokemonCard } from '../types/pokemon';

export const RARITY_OPTIONS = [
  'Common',
  'Uncommon',
  'Rare',
  'Rare Holo',
  'Rare Ultra',
  'Rare Secret'
] as const;

export const pokemonCards: PokemonCard[] = [
  {
    id: '1',
    name: 'Charizard',
    rarity: 'Rare Holo',
    artist: 'Mitsuhiro Arita',
    imageUrl: 'https://images.pokemontcg.io/base1/4_hires.png'
  },
  {
    id: '2',
    name: 'Pikachu',
    rarity: 'Common',
    artist: 'Atsuko Nishida',
    imageUrl: 'https://images.pokemontcg.io/base1/58_hires.png'
  },
  {
    id: '3',
    name: 'Mewtwo',
    rarity: 'Rare Holo',
    artist: 'Ken Sugimori',
    imageUrl: 'https://images.pokemontcg.io/base1/10_hires.png'
  },
  {
    id: '4',
    name: 'Blastoise',
    rarity: 'Rare Holo',
    artist: 'Ken Sugimori',
    imageUrl: 'https://images.pokemontcg.io/base1/2_hires.png'
  },
  {
    id: '5',
    name: 'Venusaur',
    rarity: 'Rare Holo',
    artist: 'Mitsuhiro Arita',
    imageUrl: 'https://images.pokemontcg.io/base1/15_hires.png'
  }
]; 