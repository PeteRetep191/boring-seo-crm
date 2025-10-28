// UI Components
import { Card, CardHeader, CardBody, Skeleton } from "@heroui/react";

const KpiCard: React.FC<{
  title: string;
  value?: number;
  icon: React.ReactNode;
  loading?: boolean;
}> = ({ title, value, icon, loading }) => {
  return (
    <Card radius="sm" shadow="sm">
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
          <div className="text-2xl font-semibold leading-none pl-1">{value ?? 0}</div>
        )}
      </CardBody>
    </Card>
  );
};

export default KpiCard;