import { Card } from "./cardService";

interface Collection {  
    id: number; 
    name: string; 
    cards: Card[];
}

// Function to get all collections from localStorage
function getCollections(): Collection[] {
    const collections = localStorage.getItem('collections');
    return collections ? JSON.parse(collections) : [];
}

// Function to get a collection by id
function getCollectionById(id: number): Collection | undefined {
    const collections = getCollections();
    return collections.find(collection => collection.id === id);
}

// Function to add a new collection
function addCollection(collection: Collection): void {
    const collections = getCollections();
    collections.push(collection);
    localStorage.setItem('collections', JSON.stringify(collections));
}

// Function to update an existing collection
function updateCollection(updatedCollection: Collection): void {
    let collections = getCollections();
    collections = collections.map(collection => 
        collection.id === updatedCollection.id ? updatedCollection : collection
    );
    localStorage.setItem('collections', JSON.stringify(collections));
}

// Function to delete a collection by id
function deleteCollection(id: number): void {
    let collections = getCollections();
    collections = collections.filter(collection => collection.id !== id);
    localStorage.setItem('collections', JSON.stringify(collections));
}
