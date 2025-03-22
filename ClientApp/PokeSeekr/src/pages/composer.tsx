import { getCardsByTcgIds } from "@/services/cardService";
import { GetCollection } from "@/services/lsCollectionRepo";
import * as React from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/interfaces/Card";
import { PokemonCard } from "@/components/PokemonCard";
import { CardCollectionDetailView } from "@/components/CardCollectionDetailView";

function ComposerPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  const [cards, setCards] = React.useState<Card[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedCard, setSelectedCard] = React.useState<Card | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = React.useState(false);
  
  React.useEffect(() => {
    const fetchCardsInCollection = async () => {
      if (!collectionId) return;
      let collection = GetCollection(collectionId);
      if (!collection) return;
      
      setIsLoading(true);
      try {
        let fetchedCards = await getCardsByTcgIds(collection.cards.map(c => c.tcgId));
        setCards(fetchedCards);
      } catch (error) {
        console.error("Error fetching collection cards:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCardsInCollection();
  }, [collectionId]); 

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {GetCollection(collectionId || "")?.name || "Collection"}
      </h1>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : cards.length > 0 ? (
          cards.map((card) => (
            <div key={card.tcgId}>
              <PokemonCard card={card} onClick={handleCardClick} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">No cards in this collection yet.</div>
        )}
      </div>

      <CardCollectionDetailView 
        card={selectedCard} 
        isOpen={isDetailViewOpen} 
        onClose={handleCloseDetailView} 
      />
    </div>
  );
}

export default ComposerPage;