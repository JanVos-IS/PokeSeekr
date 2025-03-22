import { useState, useEffect, useRef, useCallback } from 'react';
import { PokemonCard } from '../components/PokemonCard';
import { SearchFilters } from '../components/SearchFilters';
import { CardDetailView } from '../components/CardDetailView';
import { Card } from '@/interfaces/Card';
import { searchCards } from '@/services/cardService';

export default function SeekrPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [rarityFilter, setRarityFilter] = useState('Illustration Rare');
  const [artistFilter, setArtistFilter] = useState('all');
  const [setFilter, setSetFilter] = useState('all');
  const [colorFilter, setColorFilter] = useState<[number, number, number] | null>(null);
  const [allCards, setAllCards] = useState<Card[]>([]);
  const [visibleCards, setVisibleCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const CARDS_PER_PAGE = 20;

  useEffect(() => {
    // Reset visible cards and pagination when allCards change
    if (allCards.length > 0) {
      setVisibleCards(allCards.slice(0, CARDS_PER_PAGE));
      setPage(1); // Explicitly reset page to 1
      setHasMore(allCards.length > CARDS_PER_PAGE);
    } else {
      setVisibleCards([]);
      setHasMore(false);
    }
  }, [allCards]);

  const loadMoreCards = useCallback(() => {
    if (!hasMore || isLoading) return;
    
    setIsLoading(true);
    
    // Use current state values to calculate the next batch
    const startIndex = page * CARDS_PER_PAGE;
    const endIndex = startIndex + CARDS_PER_PAGE;
    const nextBatch = allCards.slice(startIndex, endIndex);
    
    if (nextBatch.length > 0) {
      // Update state in a specific order for predictable behavior
      setVisibleCards(prev => [...prev, ...nextBatch]);
      setPage(prevPage => prevPage + 1);
      // Only set hasMore to true if there are more cards after this batch
      setHasMore(endIndex < allCards.length);
    } else {
      // No more cards to load
      setHasMore(false);
    }
    
    setIsLoading(false);
  }, [allCards, hasMore, isLoading, page, CARDS_PER_PAGE]);

  const lastCardElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMoreCards();
      }
    });
    if (node) observer.current.observe(node);
  }, [isLoading, hasMore, loadMoreCards, page]);

  const handleSearch = async () => {

    // Ensure at least one search property is filled
    if (!nameFilter.trim() && rarityFilter === 'all' && artistFilter === 'all' && setFilter === 'all' && !colorFilter) {
      alert('Please fill at least one search property.');
      return;
    }

    setIsLoading(true);
    // Clear existing results before making a new search
    setVisibleCards([]);
    setAllCards([]);
    setPage(1);
    
    try {
      const searchResults = await searchCards({
        name: nameFilter,
        rarity: rarityFilter,
        artist: artistFilter,
        set: setFilter,
        color: colorFilter,
      });
      
      setAllCards(searchResults);
      // Show first page of results
      setVisibleCards(searchResults.slice(0, CARDS_PER_PAGE));
      setHasMore(searchResults.length > CARDS_PER_PAGE);
    } catch (error) {
      console.error('Search error:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = (card: Card) => {
    setSelectedCard(card);
    setIsDetailViewOpen(true);
  };

  const handleCloseDetailView = () => {
    setIsDetailViewOpen(false);
  };

  const renderEndMessage = () => {
    if (isLoading && page > 1) {
      return <div className="col-span-full text-center py-4">Loading more...</div>;
    }
    
    if (visibleCards.length > 0 && !hasMore) {
      return <div className="col-span-full text-center py-4">End of results</div>;
    }
    
    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <SearchFilters
        nameFilter={nameFilter}
        setNameFilter={setNameFilter}
        rarityFilter={rarityFilter}
        setRarityFilter={setRarityFilter}
        artistFilter={artistFilter}
        setArtistFilter={setArtistFilter}
        setFilter={setFilter}
        setSetFilter={setSetFilter}
        colorFilter={colorFilter}
        setColorFilter={setColorFilter}
        onSearch={handleSearch}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {isLoading && page === 1 ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : visibleCards.length > 0 ? (
          visibleCards.map((card, index) => (
            <div 
              key={`${card.tcgId}`} 
              ref={index === visibleCards.length - 1 ? lastCardElementRef : undefined}
            >
              <PokemonCard card={card} onClick={handleCardClick} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center">No cards found. Try a different search.</div>
        )}
        {renderEndMessage()}
      </div>

      <CardDetailView 
        card={selectedCard} 
        isOpen={isDetailViewOpen} 
        onClose={handleCloseDetailView} 
      />
    </div>
  );
}