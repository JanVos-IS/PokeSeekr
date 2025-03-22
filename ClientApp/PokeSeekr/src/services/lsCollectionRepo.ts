import { Card } from "@/interfaces/Card";
import { Collection } from "@/interfaces/Collection";

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