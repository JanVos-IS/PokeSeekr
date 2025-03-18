import { Input } from './ui/input';
import { Button } from './ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useCallback, useState, useMemo, useRef, useEffect } from 'react';
import { getArtists, getRarities, getSets } from '../services/cardService';
import { SearchableMultiSelect } from './ui/searchable-multi-select';

interface SearchFiltersProps {
  nameFilter: string;
  setNameFilter: (value: string) => void;
  rarityFilter: string;
  setRarityFilter: (value: string) => void;
  artistFilter: string;
  setArtistFilter: (value: string) => void;
  setFilter: string;
  setSetFilter: (value: string) => void;
  colorFilter: [number, number, number] | null;
  setColorFilter: (value: [number, number, number] | null) => void;
  onSearch: () => void;
}

export function SearchFilters({
  nameFilter,
  setNameFilter,
  rarityFilter,
  setRarityFilter,
  artistFilter,
  setArtistFilter,
  setFilter,
  setSetFilter,
  colorFilter,
  setColorFilter,
  onSearch,
}: SearchFiltersProps) {
  const [colorInputValue, setColorInputValue] = useState('#000000');
  const [rarities, setRarities] = useState<string[]>([]);
  const [artists, setArtists] = useState<string[]>([]);
  const [sets, setSets] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [raritiesData, artistsData, setsData] = await Promise.all([
          getRarities(),
          getArtists(),
          getSets()
        ]);
        raritiesData.sort();
        artistsData.sort();
        setsData.sort();
        
        setRarities(raritiesData);
        setArtists(artistsData);
        setSets(setsData);
      } catch (err) {
        setError('Failed to load filters');
        console.error('Error fetching filter data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClearColor = useCallback(() => {
    setColorInputValue('#000000');
    setColorFilter(null);
  }, [setColorFilter]);

  if (loading) {
    return <div className="mb-8 text-center">Loading filters...</div>;
  }

  if (error) {
    return <div className="mb-8 text-center text-red-500">{error}</div>;
  }

  function handleColorComplete(event: React.FocusEvent<HTMLInputElement>): void {
    const newColor = event.target.value;

    setColorInputValue(newColor);

    console.log(newColor);
    
    // Convert hex to RGB only when selection is complete
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(newColor);
    if (result) {
      const r = parseInt(result[1], 16) / 255;
      const g = parseInt(result[2], 16) / 255;
      const b = parseInt(result[3], 16) / 255;
      setColorFilter([r, g, b]);
    }
  }

  return (
    <div className="mb-8 space-y-4 md:flex md:space-x-4 md:space-y-0">
      <Input
        placeholder="Search by name..."
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
        className="md:w-1/5"
      />
      <SearchableMultiSelect
        value={rarityFilter}
        onValueChange={setRarityFilter}
        placeholder="Select rarity"
        options={rarities}
        allOptionLabel="All rarities"
        className="md:w-1/5"
      />
      <SearchableMultiSelect
        value={artistFilter}
        onValueChange={setArtistFilter}
        placeholder="Select artist"
        options={artists}
        allOptionLabel="All artists"
        className="md:w-1/5"
      />
      <SearchableMultiSelect
        value={setFilter}
        onValueChange={setSetFilter}
        placeholder="Select set"
        options={sets}
        allOptionLabel="All sets"
        className="md:w-1/5"
      />
      <div className="flex items-center gap-2 md:w-1/5">
        <div className="relative flex items-center gap-2 w-full">
          <Input
            type="color"
            onChange={() => {}}
            onBlur={handleColorComplete}
            className="h-8 w-12 !p-0.5 cursor-pointer rounded-full overflow-hidden"
            title="Select average card color"
          />
          {colorFilter && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleClearColor}
              title="Clear color filter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      <Button 
        onClick={onSearch}
        className="w-full md:w-1/5"
      >
        Search
      </Button>
    </div>
  );
} 