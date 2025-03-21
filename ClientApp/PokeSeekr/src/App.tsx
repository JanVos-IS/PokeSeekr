import './App.css'
import { Routes, Route } from 'react-router-dom'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from "@/components/theme-provider"
import SeekrPage from './app/dashboard/SeekrPage'

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 px-4 py-4">
            <Routes>
              <Route path="/" element={<SeekrPage />} />
              <Route path="/seekr" element={<SeekrPage />} />
            </Routes>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  )
}

export default App
