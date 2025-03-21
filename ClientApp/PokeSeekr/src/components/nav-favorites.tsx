import React from "react"
import { Link } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { CircleXIcon  } from "lucide-react"

export function NavFavorites({
  favorites,
  title,
  endItem
}: {
  favorites: {
    name: string
    url: string
  }[]
  title: string
  endItem?: React.ReactNode
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link to={item.url} title={item.name}>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        {endItem}
      </SidebarMenu>
    </SidebarGroup>
  )
}
