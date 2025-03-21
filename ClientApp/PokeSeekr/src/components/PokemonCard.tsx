import { Card } from './ui/card';
import { Card as CardType } from '../services/cardService';

interface PokemonCardProps {
  card: CardType;
  onClick?: (card: CardType) => void;
}

function AddToFavoritesButton() {
  return (
    <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-6 w-6" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M12 14l9-5-9-5-9 5 9 5z"
        />
      </svg>
    </button>
  );
}

export function PokemonCard({ card, onClick }: PokemonCardProps) {
  return (
    <Card 
      className="overflow-hidden transition-transform hover:scale-105 cursor-pointer"
      onClick={() => onClick && onClick(card)}
    >
      <div className="relative aspect-[63/88]">
        <img
          src={card.imageUrl}
          alt={`${card.name} Pokemon Card`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
    </Card>
  );
} 