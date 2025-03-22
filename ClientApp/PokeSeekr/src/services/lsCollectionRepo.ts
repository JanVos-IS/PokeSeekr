import { Card } from "@/interfaces/Card";
import { Collection } from "@/interfaces/Collection";
import { PokemonCard } from "@/types/pokemon";

export function createCollection(name: string): Collection {
    let collection: Collection = {
        id: crypto.randomUUID(),
        name: name,
        cards: []
    };

    // Save the collection to local storage
    localStorage.setItem(`collection_${collection.id}`, JSON.stringify(collection));

    return collection;
}

export function GetCollection(collectionId: string): Collection | null {
    let collection = localStorage.getItem(`collection_${collectionId}`);

    if (collection) {
        return JSON.parse(collection);
    }

    return null;
}

export function DeleteCollection(collectionId: string): void {
    localStorage.removeItem(`collection_${collectionId}`);
}

export function AddCardToCollection(card: PokemonCard, collectionId: string): void {
    let collection = GetCollection(collectionId);

    if (collection) {
        collection.cards.push(card);
        localStorage.setItem(`collection_${collectionId}`, JSON.stringify(collection));
    }
}

export function RemoveCardFromCollection(card: PokemonCard, collectionId: string): void {
    let collection = GetCollection(collectionId);

    if (collection) {
        collection.cards = collection.cards.filter(c => c.tcgId !== card.tcgId);
        localStorage.setItem(`collection_${collectionId}`, JSON.stringify(collection));
    }
}

export function GetCollections(): Collection[] {
    let collections: Collection[] = [];

    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);

        if (key && key.startsWith("collection_")) {
            let collection = localStorage.getItem(key);

            if (collection) {
                collections.push(JSON.parse(collection));
            }
        }
    }

    return collections;
}

export function IsCardInCollection(tcgId: string, collectionId: string): boolean {
    const collection = GetCollection(collectionId);
    if (!collection) return false;
    
    return collection.cards.some(card => card.tcgId === tcgId);
}   