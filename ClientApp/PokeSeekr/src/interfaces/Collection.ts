import { Card } from "./Card";

export interface Collection {  
    id: string; 
    name: string; 
    cards: Card[];
}