import './App.css'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './app/dashboard/page'
import SeekrPage from './app/dashboard/SeekrPage'
import PokemonDetailPage from './app/pokemon/[id]/page'
import CollectionDetailPage from './app/collections/[id]/page'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from "@/components/theme-provider"

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 px-4 py-4">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/seekr" element={<Dashboard />} />
              <Route path="/pokemon/:id" element={<PokemonDetailPage />} />
              <Route path="/collections/:id" element={<CollectionDetailPage />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
