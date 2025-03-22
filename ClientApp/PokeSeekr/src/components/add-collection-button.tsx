import React from 'react';
import { SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import { Button } from './ui/button';
import { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogOverlay, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { createCollection } from '@/services/lsCollectionRepo';
import { Collection } from '@/interfaces/Collection';       

const AddCollectionButton: React.FC<{ onUpdate: (collection: Collection) => void }> = ({ onUpdate }) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [collectionName, setCollectionName] = useState('');

    const handleConfirm = () => {
        setIsDialogOpen(false);
        let collection: Collection = createCollection(collectionName);
        onUpdate(collection);
    };

    return (
        <>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogOverlay />
                <DialogContent>
                    <DialogTitle>
                        Add New Collection
                        <button onClick={() => setIsDialogOpen(false)} className="close-button">X</button>
                    </DialogTitle>
                    <Input
                        type="text"
                        value={collectionName}
                        onChange={(e) => setCollectionName(e.target.value)}
                        placeholder="Collection Name"
                    />
                    <DialogFooter>
                        <Button onClick={handleConfirm} disabled={collectionName.length === 0}>Confirm</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <SidebarMenuItem>
                <SidebarMenuButton asChild>
                    <Button variant="secondary" onClick={() => setIsDialogOpen(true)}>Add Collection</Button>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </>
    );
};

export default AddCollectionButton;