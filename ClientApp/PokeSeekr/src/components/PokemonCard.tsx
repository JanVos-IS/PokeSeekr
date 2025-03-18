import { Card } from './ui/card';
import { Card as CardType } from '../services/cardService';

interface PokemonCardProps {
  card: CardType;
  onClick?: (card: CardType) => void;
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