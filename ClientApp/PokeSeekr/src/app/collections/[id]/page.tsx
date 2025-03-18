import { useParams } from 'react-router-dom';

export default function CollectionDetailPage() {
  const { id } = useParams();

  return (
    <>
      <h1 className="text-2xl font-bold">Collection: {id}</h1>
      <div className="grid gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold">{id} Collection</h2>
          <p className="text-sm text-muted-foreground">
            This is a placeholder for the collection detail page.
          </p>
        </div>
      </div>
    </>
  );
} 