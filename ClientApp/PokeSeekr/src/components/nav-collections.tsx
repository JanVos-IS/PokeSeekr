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
import { Collection } from "@/interfaces/Collection"
import { DeleteCollection } from "@/services/lsCollectionRepo"

export function NavCollections({
  collections,
  title,
  endItem,
  onDelete
}: {
  collections: Collection[]
  title: string
  endItem?: React.ReactNode,
  onDelete: (id: string) => void
}) {
  const { isMobile } = useSidebar()
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {collections.map((c) => (
          <SidebarMenuItem key={c.name}>
            <SidebarMenuButton asChild>
              <Link to={`/collection/${c.id}`} title={c.name}>
                <span>{c.name}</span>
              </Link>
            </SidebarMenuButton>
            <SidebarMenuAction>
            <CircleXIcon onClick={() => onDelete(c.id)}>
            </CircleXIcon>
            </SidebarMenuAction>
          </SidebarMenuItem>
        ))}
        {endItem}
      </SidebarMenu>
    </SidebarGroup>
  )
}
