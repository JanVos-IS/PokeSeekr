import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { X, ExternalLink } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Card } from '@/interfaces/Card';


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
  
  // Reset position when dialog opens/closes
  useEffect(() => {
    setRotateX(0);
    setRotateY(0);
    setIsHovering(false);
    lastMoveTime.current = 0;
  }, [isOpen]);
  
  if (!card) return null;
  
  const THROTTLE_MS = 16; // Throttle to ~60fps
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardContainerRef.current || !isHovering) return;
    
    const now = Date.now();
    // Throttle updates to maintain performance
    if (now - lastMoveTime.current < THROTTLE_MS) return;
    lastMoveTime.current = now;
    
    const rect = cardContainerRef.current.getBoundingClientRect();
    
    // Find the middle of the element
    const middleX = rect.width / 2;
    const middleY = rect.height / 2;
    
    // Get mouse position relative to the card
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Get offset from middle as a percentage and tone it down
    const offsetX = ((x - middleX) / middleX) * 20; // Reduced to 20 for less extreme rotation
    const offsetY = ((y - middleY) / middleY) * 20;
    
    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      setRotateY(offsetX);
      setRotateX(-1 * offsetY);
    });
  };

  // Calculate lighting values based on mouse position and rotation
  const shineX = 50 + rotateY * 3;
  const shineY = 50 + rotateX * 3;
  const gradientRotation = 135 + rotateY;
  const gradientPositionX = 50 + rotateY * 3;
  const gradientPositionY = 50 + rotateX * 3;

  // Convert average color from [0-1] range to RGB values
  const rgbColor = card.averageColor ? 
    `rgb(${Math.round(card.averageColor[0] * 255)}, ${Math.round(card.averageColor[1] * 255)}, ${Math.round(card.averageColor[2] * 255)})` : 
    'transparent';

  //const collections = GetCollections();

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
        
        {/* Card Image Container */}
        <div 
          ref={cardContainerRef}
          className="flex-[3] flex items-center justify-center p-8 overflow-hidden"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => {
            setIsHovering(false);
            setRotateX(0);
            setRotateY(0);
          }}
          style={{
            perspective: '1000px',
            background: `linear-gradient(to bottom, ${rgbColor}22, transparent)`,
          }}
        >
          {/* Card Wrapper */}
          <div 
            className="relative max-h-full max-w-full transform-gpu"
            style={{
              transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              transformStyle: 'preserve-3d',
              transition: isHovering ? 'transform 0.1s cubic-bezier(0.33, 1, 0.68, 1)' : 'transform 0.5s ease-out',
              willChange: 'transform',
            }}
          >
            {/* Card Image */}
            <img 
              src={card.imageLarge || card.imageUrl} 
              alt={`${card.name} Pokemon Card`}
              className="max-h-[85vh] object-contain shadow-xl rounded-lg"
            />
            
            {/* Primary shine effect overlay */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${shineX}% ${shineY}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
                mixBlendMode: 'overlay',
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }}
            />
            
            {/* Secondary edge highlight */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none"
              style={{
                boxShadow: `inset 0 0 20px 5px rgba(255,255,255,0.3), 0 0 10px 2px rgba(255,255,255,0.2)`,
                opacity: isHovering ? 1 : 0,
                transition: 'opacity 0.2s ease',
              }}
            />
            
            {/* Holographic effect */}
            <div 
              className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden"
              style={{
                opacity: isHovering ? 0.5 : 0,
                transition: 'opacity 0.2s ease',
                backgroundImage: `linear-gradient(
                  ${gradientRotation}deg, 
                  rgba(255,0,0,0) 0%, 
                  rgba(255,0,0,0.2) 25%, 
                  rgba(0,255,0,0.2) 50%, 
                  rgba(0,0,255,0.2) 75%, 
                  rgba(255,0,0,0) 100%
                )`,
                backgroundSize: '400% 400%',
                backgroundPosition: `${gradientPositionX}% ${gradientPositionY}%`,
                mixBlendMode: 'color-dodge',
              }}
            />
          </div>
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