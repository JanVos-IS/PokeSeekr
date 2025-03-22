import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X, ExternalLink, MoreHorizontal, Info, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Card } from '@/interfaces/Card';
import { Collection } from '@/interfaces/Collection';
import { AddCardToCollection, GetCollections, RemoveCardFromCollection } from '@/services/lsCollectionRepo';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Card3DEffect } from './Card3DEffect';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from './ui/dropdown-menu';

const safeParseJson = (jsonString: string | null): any => {
  if (!jsonString) return null;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return null;
  }
};

interface CardDetailViewProps {
  card: Card | null;
  isOpen: boolean;
  onClose: () => void;
}

export function CardCollectionDetailView({ card, isOpen, onClose }: CardDetailViewProps) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");

  useEffect(() => {
    const fetchCollections = async () => {
      const collections = await GetCollections();
      setCollections(collections);
      if (collections.length > 0) {
        setSelectedCollectionId(collections[0].id);
      }
    };
    fetchCollections();
  }, []);

  if (!card) return null;

  const AddToCollection = async (collectionId: string) => {
    await AddCardToCollection(card, collectionId);
  }
  
  const handleMoreInfo = () => {
    window.open(`https://www.pokemon.com/us/pokemon-tcg/pokemon-cards/?cardName=${card.name}`, '_blank');
  }
  
  const handleRemoveFromCollection = async () => {
    await RemoveCardFromCollection(card, selectedCollectionId);
    onClose();
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] flex flex-col md:flex-row overflow-hidden p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>{card.name} Card Details</DialogTitle>
          <DialogDescription>View details about {card.name} Pokemon card</DialogDescription>
        </DialogHeader>
        
        <Button
          variant="ghost"
          className="absolute right-4 top-4 rounded-full p-2 z-50 bg-background/80"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className="absolute right-14 top-4 rounded-full p-2 z-50 bg-background/80"
            >
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleMoreInfo}>
              <Info className="mr-2 h-4 w-4" />
              <span>More Info</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={handleRemoveFromCollection}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Remove from Collection</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Card Image Container - Using the new Card3DEffect component */}
        <div className="flex-[4]">
          <Card3DEffect 
            imageUrl={card.imageLarge || card.imageUrl}
            altText={`${card.name} Pokemon Card`}
            averageColor={card.averageColor}
            className="h-full p-6"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}