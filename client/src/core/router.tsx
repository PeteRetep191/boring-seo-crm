import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
// layouts
import { AppLayout, AuthLayout } from "@/layouts";
// UI
import { Loader } from '@/shared/ui';

// pages
const LoginPage = lazy( () => import("@/pages/LoginPage"));
const DashboardPage = lazy( () => import("@/pages/DashboardPage"));
const OffersPage = lazy( () => import("@/pages/OffersPage"));
const SitesPage = lazy( () => import("@/pages/sites/SitesPage"));
const SiteManagementPage = lazy( () => import("@/pages/sites/SiteManagementPage"));
const SettingsPage = lazy( () => import("@/pages/SettingsPage"));
const NotFoundPage = lazy( () => import("@/pages/NotFoundPage"));

// =========================
// Helpers
// =========================
export function isAuthenticated() {
  const ready = new Promise<void>(resolve => setTimeout(resolve, 500));
  return { ready };
}

// =========================
// ROUTER
// =========================
export const router = createBrowserRouter([
    {
        path: "/login",
        element: <AuthLayout />,
        children: [
            {
                index: true,
                element: (
                    <Suspense fallback={<Loader />}>
                        <LoginPage />
                    </Suspense>
                )
            }
        ]
    },
    {
        path: "/",
        loader: isAuthenticated,
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <DashboardPage />
            },
            {
                path: "offers",
                element: <OffersPage />
            },
            {
                path: "sites",
                children: [
                    {
                        index: true,
                        element: <SitesPage />
                    },
                    {
                        path: "create-new",
                        element: <SiteManagementPage />
                    },
                    {
                        path: ":siteId",
                        element: <SiteManagementPage />
                    }
                ]
            },
            {
                path: "settings",
                element: <SettingsPage />
            }
        ]

    },
    {
        path: "*",
        element: (
            <Suspense fallback={<Loader />}>
                <NotFoundPage />
            </Suspense>
        ),
    }
])