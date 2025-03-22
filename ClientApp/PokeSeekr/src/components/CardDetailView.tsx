import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/interfaces/Card';
import { Collection } from '@/interfaces/Collection';
import { AddCardToCollection, GetCollections, IsCardInCollection } from '@/services/lsCollectionRepo';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from './ui/select';
import { Card3DEffect } from './Card3DEffect';
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

export function CardDetailView({ card, isOpen, onClose }: CardDetailViewProps) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const lastMoveTime = useRef(0);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>("");
  const [isCardInCollection, setIsCardInCollection] = useState(false);

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

  // Check if the card is already in the selected collection
  useEffect(() => {
    if (card && selectedCollectionId) {
      setIsCardInCollection(IsCardInCollection(card.tcgId, selectedCollectionId));
    }
  }, [card, selectedCollectionId]);

  // Reset position when dialog opens/closes
  useEffect(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
    lastMoveTime.current = 0;
  }, [isOpen]);

  if (!card) return null;
  // Convert average color from [0-1] range to RGB values
  const rgbColor = card.averageColor ?
    `rgb(${Math.round(card.averageColor[0] * 255)}, ${Math.round(card.averageColor[1] * 255)}, ${Math.round(card.averageColor[2] * 255)})` :
    'transparent';

  const AddToCollection = async (collectionId: string) => {
    await AddCardToCollection(card, collectionId);
    setIsCardInCollection(true);
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open: boolean) => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[95vh] flex flex-col md:flex-row overflow-hidden p-0">
        <Button
          variant="ghost"
          className="absolute right-4 top-4 rounded-full p-2 z-50 bg-background/80"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>

        {/* Card Image Container - Using the new Card3DEffect component */}
        <div className="flex-[3]">
          <Card3DEffect 
            imageUrl={card.imageLarge || card.imageUrl}
            altText={`${card.name} Pokemon Card`}
            averageColor={card.averageColor}
            className="h-full p-8"
          />
        </div>

        {/* Card Details */}
        <div className="flex-[2] p-8 overflow-y-auto">
          <DialogHeader className="mb-8">
            <DialogTitle className="text-3xl font-bold">{card.name}</DialogTitle>
            <DialogDescription className="text-xl mt-2">{card.setName} - {card.number}</DialogDescription>
          </DialogHeader>

          <div className="space-y-8">
            {card.flavorText && (
              <div className="italic text-muted-foreground border-l-4 pl-6 py-4 text-lg bg-muted/20 rounded-r-lg">
                {card.flavorText}
              </div>
            )}

            {/* Cardmarket Button */}
            <div className="w-full">
              <a
                href={`https://www.cardmarket.com/en/Pokemon/Products/Singles/${encodeURIComponent(card.setName || '')}/${encodeURIComponent(card.name || '')}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="w-full" variant="outline">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Cardmarket
                </Button>
              </a>
            </div>

            {/* Add to collection Button */}
            <div className="w-full flex gap-2">
              <div className="flex-1">
                <Select value={selectedCollectionId} onValueChange={(value) => {
                  setSelectedCollectionId(value);
                  if (card) {
                    setIsCardInCollection(IsCardInCollection(card.tcgId, value));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Add to Collection" />
                  </SelectTrigger>
                  <SelectContent>
                    {collections.map((collection) => (
                      <SelectItem key={collection.id} value={collection.id}>
                        {collection.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                variant="outline" 
                onClick={() => AddToCollection(selectedCollectionId)}
                disabled={isCardInCollection}
              >
                {isCardInCollection ? 'Added' : 'Add'}
              </Button>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Card Information</h3>
                <DetailItem label="TCG ID" value={card.tcgId} />
                <DetailItem label="Supertype" value={card.supertype} />
                {card.hp && <DetailItem label="HP" value={card.hp} />}
                {card.level && <DetailItem label="Level" value={card.level} />}
                {card.evolvesFrom && <DetailItem label="Evolves From" value={card.evolvesFrom} />}
                {card.evolvesTo && <DetailItem label="Evolves To" value={card.evolvesTo} />}
                {card.regulationMark && <DetailItem label="Regulation Mark" value={card.regulationMark} />}
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-2">Collection Details</h3>
                <DetailItem label="Rarity" value={card.rarity} />
                <DetailItem label="Artist" value={card.artist} />
                <DetailItem label="Set" value={card.setName} />
                <DetailItem label="Number" value={card.number} />

                {/* Average Color Display */}
                {card.averageColor && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Average Color</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-full border"
                        style={{ backgroundColor: rgbColor }}
                      />
                      <p className="text-sm font-mono">
                        RGB({Math.round(card.averageColor[0] * 255)}, {Math.round(card.averageColor[1] * 255)}, {Math.round(card.averageColor[2] * 255)})
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Card Details Sections */}
            {(card.types || card.subtypes || card.rules || card.attacks || card.weaknesses || card.resistances || card.abilities) && (
              <div className="mt-8 space-y-8">
                <h3 className="text-xl font-semibold border-b pb-2">Card Details</h3>

                {/* Types and subtypes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {card.types && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Types</p>
                      <div className="flex flex-wrap gap-2">
                        {safeParseJson(card.types)?.map((type: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full">{type}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.subtypes && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Subtypes</p>
                      <div className="flex flex-wrap gap-2">
                        {safeParseJson(card.subtypes)?.map((subtype: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-secondary/10 text-secondary rounded-full">{subtype}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Rules */}
                {card.rules && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">Rules</p>
                    <ul className="list-disc pl-5 space-y-1">
                      {safeParseJson(card.rules)?.map((rule: string, index: number) => (
                        <li key={index} className="text-base">{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Attacks */}
                {card.attacks && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Attacks</p>
                    <div className="space-y-4">
                      {safeParseJson(card.attacks)?.map((attack: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-muted/5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold">{attack.name}</h4>
                            {attack.damage && <span className="font-mono text-lg">{attack.damage}</span>}
                          </div>
                          {attack.text && <p className="text-muted-foreground">{attack.text}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Abilities */}
                {card.abilities && (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-muted-foreground">Abilities</p>
                    <div className="space-y-4">
                      {safeParseJson(card.abilities)?.map((ability: any, index: number) => (
                        <div key={index} className="p-4 border rounded-lg bg-primary/5">
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold">{ability.name}</h4>
                            {ability.type && <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">{ability.type}</span>}
                          </div>
                          {ability.text && <p className="text-muted-foreground">{ability.text}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Weaknesses and Resistances */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {card.weaknesses && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Weaknesses</p>
                      <div className="space-y-2">
                        {safeParseJson(card.weaknesses)?.map((weakness: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-destructive/10 text-destructive rounded-full">{weakness.type}</span>
                            <span>{weakness.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {card.resistances && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Resistances</p>
                      <div className="space-y-2">
                        {safeParseJson(card.resistances)?.map((resistance: any, index: number) => (
                          <div key={index} className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-accent/10 text-accent rounded-full">{resistance.type}</span>
                            <span>{resistance.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Pricing Information */}
            {(card.tcgPlayerPriceNormal || card.tcgPlayerPriceHolofoil || card.cardMarketPrice) && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold border-b pb-2 mb-4">Pricing Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {card.tcgPlayerPriceNormal && (
                    <div className="p-4 border rounded-lg bg-muted/10">
                      <p className="text-sm font-medium text-muted-foreground mb-1">TCG Player (Normal)</p>
                      <p className="text-2xl font-bold">${card.tcgPlayerPriceNormal.toFixed(2)}</p>
                    </div>
                  )}
                  {card.tcgPlayerPriceHolofoil && (
                    <div className="p-4 border rounded-lg bg-muted/10">
                      <p className="text-sm font-medium text-muted-foreground mb-1">TCG Player (Holofoil)</p>
                      <p className="text-2xl font-bold">${card.tcgPlayerPriceHolofoil.toFixed(2)}</p>
                    </div>
                  )}
                  {card.cardMarketPrice && (
                    <div className="p-4 border rounded-lg bg-muted/10">
                      <p className="text-sm font-medium text-muted-foreground mb-1">Card Market</p>
                      <p className="text-2xl font-bold">${card.cardMarketPrice.toFixed(2)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface DetailItemProps {
  label: string;
  value: string | null | undefined;
}

function DetailItem({ label, value }: DetailItemProps) {
  if (!value) return null;

  return (
    <div className="space-y-1">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-lg">{value}</p>
    </div>
  );
} 