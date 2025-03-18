import * as React from "react"
import {
  Sparkles,
} from "lucide-react"
import { Link } from "react-router-dom"

import { NavFavorites } from "@/components/nav-favorites"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import { ModeToggle } from "./mode-toggle"

// This is sample data.
const data = {
  navMain: [
    {
      name: "Seekr",
      url: "/seekr",
      emoji: "🔍",
    }
  ],
  favorites: [
    {
      name: "Poliwhirl",
      url: "/pokemon/poliwhirl",
      emoji: "🐢",
    },
  ],
  collections: [
    {
      name: "Forest Theme",
      url: "/collections/forest",
      emoji: "🌳",
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r-0" {...props}>
      <SidebarHeader>
        <ModeToggle />
        <Link to="/">pokeseekricon</Link>
      </SidebarHeader>
      <SidebarContent>
        <NavFavorites title="Search" favorites={data.navMain} />
        <NavFavorites title="Collections" favorites={data.collections} />
        <NavFavorites title="Favorites" favorites={data.favorites} />
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
