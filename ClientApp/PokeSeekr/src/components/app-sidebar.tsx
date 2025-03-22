import * as React from "react"
import {
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

import { NavFavorites } from "@/components/nav-favorites"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"
import AddCollectionButton from "./add-collection-button"
import { DeleteCollection, GetCollections } from "@/services/lsCollectionRepo"
import { Collection } from "@/interfaces/Collection"
import { NavCollections } from "./nav-collections"

let data: {
  navMain: { name: string; url: string }[];
  favorites: { name: string; url: string; emoji: string }[];
} = {
  navMain: [
    {
      name: "Seekr",
      url: "/seekr"
    },
    {
      name: "Composer",
      url: "/compose"
    }
  ],
  favorites: [
    {
      name: "Poliwhirl",
      url: "/pokemon/poliwhirl",
      emoji: "🐢",
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    setCollections(GetCollections());
  }, []);

  const updateCollections = (collection: Collection) => {
    setCollections([...collections, collection]);
  }

  const deleteCollection = (id: string) => {

    if (!window.confirm("Are you sure you want to delete this collection?")) {
      return;
    }

    DeleteCollection(id);
    setCollections(collections.filter(c => c.id !== id));
  }

  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <ModeToggle />
        <Link to="/">pokeseekricon</Link>
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites title="Search" favorites={data.navMain} />
        <NavCollections title="Collections" onDelete={deleteCollection} collections={collections} endItem={<AddCollectionButton onUpdate={updateCollections}/>} /> 
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
