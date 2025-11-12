// UI
import { ConfirmPopover } from "@/shared/ui";
// Components
import { Button, Chip, Tooltip, Switch } from "@heroui/react";
// Icons
import { Edit, Trash2, ExternalLink } from "lucide-react";
// Libs
import { formatDateTime } from "@/shared/lib/date";
// Types
import { IOffer } from "@/features/offer/types";

const PLACEHOLDER_LOGO = "/images/placeholder-logo.webp";

export const offerColumnDefs = [
  {
    headerName: "Enabled",
    field: "isActive",
    minWidth: 90,
    width: 90,
    maxWidth: 90,
    sortable: false,
    lockPosition: true,
    suppressMovable: true,
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    cellRenderer: (params: any) => {
      const isActive = !!params.data?.isActive;
      return (
        <Switch
          size="sm"
          isSelected={isActive}
          onChange={(e) => {
            params.context.onChangeEnable(params.data.id, e.target.checked);
          }}
        />
      );
    },
  },
  {
    headerName: "Offer",
    field: "name",
    minWidth: 300,
    sortable: false,
    lockPosition: true,
    suppressMovable: true,
    cellRenderer: (params: any) => {
      const { name, logoUrl, rating } = params.data || {};
      const src = logoUrl ?? PLACEHOLDER_LOGO;

      const r = Math.max(0, Math.min(5, Number(rating ?? 0)));
      const rounded = Math.round(r);
      const filled = "★".repeat(rounded);
      const empty = "☆".repeat(5 - rounded);

      return (
        <div className="flex items-center gap-3 py-1">
          <img
            src={src}
            alt={name || "Logo"}
            className="h-12 w-12 rounded object-cover bg-black/10"
            onError={(e) => {
              const img = e.currentTarget as HTMLImageElement;
              if (img.src !== location.origin + PLACEHOLDER_LOGO)
                img.src = PLACEHOLDER_LOGO;
            }}
          />
          <div className="flex flex-col gap-1 min-w-0">
            <span className="text-xs font-medium truncate" title={name}>
              {name}
            </span>

            <div
              className="flex items-center gap-2"
              aria-label={`Rating ${r.toFixed(1)} of 5`}
            >
              <span className="text-base leading-none">
                <span className="text-yellow-500 text-xs">{filled}</span>
                <span className="text-gray-400  text-xs">{empty}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({Number(r).toFixed(1)}/5)
              </span>
            </div>
          </div>
        </div>
      );
    },
    tooltipValueGetter: (p: any) => p?.data?.name || "",
  },
  {
    headerName: "Bonus",
    field: "bonus",
    minWidth: 200,
    sortable: false,
    lockPosition: true,
    suppressMovable: true,
    cellStyle: { display: "flex", alignItems: "center" },
    tooltipValueGetter: (p: any) => {
      const hasDesc =
        typeof p?.data?.description === "string" &&
        p.data.description.trim().length > 0;
      return p?.data
        ? hasDesc
          ? `${p.data.bonus} — ${p.data.description}`
          : `Bonus: ${p.data.bonus}`
        : "";
    },
    cellRenderer: (params: any) => {
      const { bonus, description } = params.data || {};
      const bonusText = String(bonus ?? "").trim();
      const text = description ? `${bonusText} — ${description}` : bonusText;
      return (
        <span className="text-xs whitespace-pre-wrap wrap-break-words">
          {text || "—"}
        </span>
      );
    },
  },
  {
    headerName: "Partner URL",
    field: "partnerUrl",
    minWidth: 140,
    sortable: false,
    lockPosition: true,
    suppressMovable: true,
    cellStyle: { display: "flex", alignItems: "center" },
    cellRenderer: (params: any) => {
      const url = params.data?.partnerUrl;
      if (!url)
        return (
          <span className="text-sm text-gray-500 dark:text-gray-400">—</span>
        );
      return (
        <Tooltip content="Open partner link" placement="top">
          <Button
            size="sm"
            variant="flat"
            color="default"
            onPress={() => window.open(url, "_blank", "noopener,noreferrer")}
            className="gap-1"
          >
            <ExternalLink size={16} />
            <span className="text-xs">Open</span>
          </Button>
        </Tooltip>
      );
    },
  },
  {
    headerName: "Status",
    field: "archived",
    minWidth: 120,
    sortable: false,
    lockPosition: true,
    suppressMovable: true,
    cellStyle: { display: "flex", alignItems: "center" },
    cellRenderer: (params: any) => {
      const isActive = params.data?.isActive;

      return (
        <Chip size="sm" variant="flat" color={isActive ? "success" : "default"}>
          {isActive ? "Enabled" : "Disabled"}
        </Chip>
      );
    },
  },
  {
    headerName: "Created At",
    field: "createdAt",
    minWidth: 200,
    sortable: false,
    lockPosition: true,
    suppressMovable: true,
    cellStyle: { display: "flex", alignItems: "center" },
    cellRenderer: (params: any) => (
      <span className="text-sm">
        {params.data?.createdAt
          ? formatDateTime(params.data.createdAt, { full: true })
          : "—"}
      </span>
    ),
  },
  {
    headerName: "Updated At",
    field: "updatedAt",
    minWidth: 200,
    lockPosition: true,
    suppressMovable: true,
    cellStyle: { display: "flex", alignItems: "center" },
    cellRenderer: (params: any) => (
      <span className="text-sm">
        {params.data?.updatedAt
          ? formatDateTime(params.data.updatedAt, { full: true })
          : "—"}
      </span>
    ),
  },
  {
    colId: "actions",
    headerName: "Actions",
    pinned: "right",
    cellStyle: { display: "flex", alignItems: "center" },
    width: 105,
    minWidth: 105,
    maxWidth: 105,
    lockPosition: true,
    suppressMovable: true,
    resizable: false,
    filter: false,
    sortable: false,
    cellRenderer: (params: any) => {
      const id = params.data?._id;
      return (
        <div className="flex items-center gap-2">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="default"
            onPress={() => params.context.onEditRow?.(id)}
            aria-label="Edit offer"
          >
            <Edit size={18} />
          </Button>
          <Tooltip content="Delete Offer">
            <ConfirmPopover
              title="Delete Offer"
              description="Are you sure you want to permanently delete this offer? This action cannot be undone."
              useAlert
              alertColor="danger"
              approveLabel="Yes, Delete"
              cancelLabel="Cancel"
              approveColor="danger"
              onApprove={() => params.context.onDeleteRow?.(id)}
            >
              <Button
                isIconOnly
                size="sm"
                variant="flat"
                color="danger"
                aria-label="Delete offer"
              >
                <Trash2 size={18} />
              </Button>
            </ConfirmPopover>
          </Tooltip>
        </div>
      );
    },
  },
];
