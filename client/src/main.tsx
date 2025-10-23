import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// core
import { router } from '@/core/router'
// providers
import { AuthProvider, ThemeProvider } from '@/core/providers'
import { RouterProvider } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { HeroUIProvider } from "@heroui/react";
import { Toaster } from 'react-hot-toast';
// ag-grid
import { ModuleRegistry, AllCommunityModule } from 'ag-grid-community';
// clients
import { QueryClient } from '@tanstack/react-query'
// styles
import '@/shared/styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      refetchOnWindowFocus: true,
      retry: 2,
    },
  }
});

ModuleRegistry.registerModules([AllCommunityModule]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster />
      <AuthProvider>
        <ThemeProvider>
          <HeroUIProvider>
            <RouterProvider router={router} />
          </HeroUIProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>,
)
