import { useParams } from 'react-router-dom';

export default function PokemonDetailPage() {
  const { id } = useParams();

  return (
    <>
      <h1 className="text-2xl font-bold">Pokemon Detail: {id}</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">Details for {id}</h2>
          <p className="text-sm text-muted-foreground">
            This is a placeholder for the Pokemon detail page.
          </p>
        </div>
      </div>
    </>
  );
} 