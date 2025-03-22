import { getCardsByTcgIds } from "@/services/cardService";
import { GetCollection } from "@/services/lsCollectionRepo";
import * as React from "react";
import { useParams } from "react-router-dom";

function CollectionPage() {
  const { collectionId } = useParams<{ collectionId: string }>();
  
  React.useEffect(() => {
    const fetchCardsInCollection = async () => {
      console.log("fetching cards in collection");
      console.log(collectionId);

      if (!collectionId) return;
      let collection = GetCollection(collectionId);
      if (!collection) return;
      let cards = await getCardsByTcgIds(collection.cards.map(c => c.tcgId));
      console.log(cards);
    };

    fetchCardsInCollection();

  }, []); 

  return (
    <div>
      
    </div>
  );
}

export default CollectionPage;