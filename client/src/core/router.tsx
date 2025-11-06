import { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
// layouts
import { AppLayout, AuthLayout } from "@/layouts";
// UI
import { Loader } from "@/shared/ui";

// pages
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const OffersPage = lazy(() => import("@/pages/OffersPage"));
const SitesPage = lazy(() => import("@/pages/sites/SitesPage"));
const SiteDetailsPage = lazy(() => import("@/pages/sites/SiteDetailsPage"));
const SettingsPage = lazy(() => import("@/pages/SettingsPage"));
const NotFoundPage = lazy(() => import("@/pages/NotFoundPage"));

const CreateRootUserPage = lazy(() => import("@/pages/CreateRootUserPage"));

// =========================
// Helpers
// =========================
export function isAuthenticated() {
  const ready = new Promise<void>((resolve) => setTimeout(resolve, 200));
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
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <Loader />
              </div>
            }
          >
            <LoginPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "create-root-user",
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <Loader />
              </div>
            }
          >
            <CreateRootUserPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/",
    loader: isAuthenticated,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "offers",
        element: <OffersPage />,
      },
      {
        path: "sites",
        children: [
          {
            index: true,
            element: <SitesPage />,
          },
          {
            path: "create",
            element: <SiteDetailsPage />,
          },
          {
            path: ":siteId",
            element: <SiteDetailsPage />,
          },
        ],
      },
      {
        path: "settings",
        element: <SettingsPage />,
      },
    ],
  },
  {
    path: "*",
    element: (
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-screen">
            <Loader />
          </div>
        }
      >
        <NotFoundPage />
      </Suspense>
    ),
  },
]);
