import React from "react";
// API
import { fetchDashboard } from "@/api/backend/routes/dashboard.api";
// Hooks
import { useImmer } from "use-immer";
import { useQuery } from "@tanstack/react-query";
// UI
import { KpiCard } from "@/features/dashboard/ui";
// UI Components
import { Button, Tooltip, Link } from "@heroui/react";
// Icons
import { RefreshCcw, Globe, Tags, Activity, CheckCircle2 } from "lucide-react";

// ==============================
// Constants
// ==============================
const INITIAL_DASHBOARD_STATE = {
  sites: {
    total: 0,
    active: 0,
    archived: 0,
  },
  offers: {
    total: 0,
    active: 0,
    archived: 0,
  }
};

// ==============================
// DashboardPage
// ==============================
const DashboardPage: React.FC = () => {

  const [dashboardState, updateDashboardState] = useImmer(INITIAL_DASHBOARD_STATE)

  const { data: dashboardData, refetch, isFetching } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      try {
        const response = await fetchDashboard();
        
        console.log("Dashboard data fetched:", response.data);

        updateDashboardState(draft => {
          draft.sites = response.data.result.sites;
          draft.offers = response.data.result.offers;
        });

        return response.data.result;
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="mx-auto w-full px-3 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Welcome 👋</h1>
          <p className="text-sm text-foreground-500">Summary and quick access to sections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Refresh dashboard data">
            <Button size="md" variant="flat" isIconOnly onPress={() => refetch()} isLoading={isFetching}>
              <RefreshCcw size={20} />
            </Button>
          </Tooltip>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Sites"
          icon={<Globe size={16} />}
          value={dashboardData?.sites.total}
          loading={isFetching}
        />
        <KpiCard
          title="Offers"
          icon={<Tags size={16} />}
          value={dashboardData?.offers.total}
          loading={isFetching}
        />
        <KpiCard
          title="Active Sites"
          icon={<CheckCircle2 size={16} />}
          value={dashboardData?.sites.active}
          loading={isFetching}
        />
        <KpiCard
          title="Active Offers"
          icon={<Activity size={16} />}
          value={dashboardData?.offers.active}
          loading={isFetching}
        />
      </div>
    </div>
  );
};

export default DashboardPage;
