import React from "react";
import {useImmer} from "use-immer";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Skeleton,
  Tooltip,
  Link
} from "@heroui/react";
import {
  RefreshCcw,
  Globe,
  Tags,
  Activity,
  CheckCircle2
} from "lucide-react";

// ==============================
// Mock API
// ==============================

type Summary = {
  sites: number;
  offers: number;
  activeSites: number;
  activeOffers: number;
};

type TopItem = {
  id: string;
  title: string;
  ctr: number; // 0..1
  clicks: number;
  status: "active" | "paused";
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function fetchSummary(): Promise<Summary> {
  await sleep(700);
  // any numbers here — replace with real API later
  return { sites: 42, offers: 128, activeSites: 31, activeOffers: 76 };
}

async function fetchTopOffers(): Promise<TopItem[]> {
  await sleep(900);
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `offer-${i + 1}`,
    title: `Offer #${i + 1}`,
    ctr: 0.05 + i * 0.012,
    clicks: 1200 - i * 73,
    status: i % 3 === 0 ? "paused" : "active",
  }));
}

async function fetchTopSites(): Promise<TopItem[]> {
  await sleep(1000);
  return Array.from({ length: 6 }).map((_, i) => ({
    id: `site-${i + 1}`,
    title: `site-${i + 1}.example.com`,
    ctr: 0.08 + i * 0.01,
    clicks: 2200 - i * 111,
    status: i % 4 === 0 ? "paused" : "active",
  }));
}

// ==============================
// Page
// ==============================

const DashboardPage: React.FC = () => {
  const queryClient = useQueryClient();

  const [state, update] = useImmer({
    summary: null as Summary | null,
    topOffers: [] as TopItem[],
    topSites: [] as TopItem[],
  });

  // queries
  const summaryQ = useQuery({
    queryKey: ["summary"],
    queryFn: fetchSummary,
    staleTime: 60_000,
  });

  const topOffersQ = useQuery({
    queryKey: ["topOffers"],
    queryFn: fetchTopOffers,
    staleTime: 60_000,
  });

  const topSitesQ = useQuery({
    queryKey: ["topSites"],
    queryFn: fetchTopSites,
    staleTime: 60_000,
  });

  // sync into immer state (single source for UI widgets)
  React.useEffect(() => {
    if (summaryQ.data) update((d) => void (d.summary = summaryQ.data));
  }, [summaryQ.data, update]);

  React.useEffect(() => {
    if (topOffersQ.data) update((d) => void (d.topOffers = topOffersQ.data));
  }, [topOffersQ.data, update]);

  React.useEffect(() => {
    if (topSitesQ.data) update((d) => void (d.topSites = topSitesQ.data));
  }, [topSitesQ.data, update]);

  const isLoadingAny = summaryQ.isLoading || topOffersQ.isLoading || topSitesQ.isLoading;

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["summary"] });
    queryClient.invalidateQueries({ queryKey: ["topOffers"] });
    queryClient.invalidateQueries({ queryKey: ["topSites"] });
  };

  return (
    <div className="mx-auto w-full px-3 py-4">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Welcome 👋</h1>
          <p className="text-sm text-foreground-500">Summary and quick access to sections.</p>
        </div>
        <div className="flex items-center gap-2">
          <Tooltip content="Refresh data">
            <Button size="sm" variant="flat" isIconOnly onPress={handleRefresh} isLoading={isLoadingAny}>
              <RefreshCcw size={16} />
            </Button>
          </Tooltip>
          <Button as={Link} href="/sites" size="sm" color="default" variant="flat" startContent={<Globe size={16} />}>Sites</Button>
          <Button as={Link} href="/offers" size="sm" color="primary" variant="flat" startContent={<Tags size={16} />}>Offers</Button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Sites"
          icon={<Globe size={16} />}
          value={state.summary?.sites}
          loading={summaryQ.isLoading}
        />
        <KpiCard
          title="Offers"
          icon={<Tags size={16} />}
          value={state.summary?.offers}
          loading={summaryQ.isLoading}
        />
        <KpiCard
          title="Active Sites"
          icon={<CheckCircle2 size={16} />}
          value={state.summary?.activeSites}
          loading={summaryQ.isLoading}
        />
        <KpiCard
          title="Active Offers"
          icon={<Activity size={16} />}
          value={state.summary?.activeOffers}
          loading={summaryQ.isLoading}
        />
      </div>
    </div>
  );
};

// ==============================
// Small building blocks
// ==============================

const KpiCard: React.FC<{
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading?: boolean;
}> = ({ title, value, icon, loading }) => {
  return (
    <Card radius="sm" className="shadow-none">
      <CardHeader className="flex items-center gap-2 px-3 py-2">
        <div className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-default-200">
          {icon}
        </div>
        <span className="text-xs text-foreground-500">{title}</span>
      </CardHeader>
      <CardBody className="px-3 pb-3 pt-0">
        {loading ? (
          <Skeleton className="h-7 w-16 rounded" />
        ) : (
          <div className="text-2xl font-semibold leading-none">{value ?? 0}</div>
        )}
      </CardBody>
    </Card>
  );
};

export default DashboardPage;
