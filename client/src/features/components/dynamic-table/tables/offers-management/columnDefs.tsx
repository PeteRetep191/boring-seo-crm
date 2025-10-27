// UI
import { ConfirmPopover } from "@/shared/ui";
// Components
import { Button, Chip, Tooltip } from "@heroui/react";
// Icons
import { Edit, Trash2, Archive, ArchiveRestore, ExternalLink } from "lucide-react";
// Libs
import { formatDateTime } from "@/shared/lib/date";

export const offerColumnDefs = [
  {
    colId: "checkbox",
    headerName: "",
    checkboxSelection: true,
    headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true,
    pinned: "left",
    width: 56,
    maxWidth: 56,
    lockPosition: true,
    suppressMovable: true,
    resizable: false,
    sortable: false,
    filter: false,
  },
  {
    headerName: "Offer",
    field: "name",
    minWidth: 280,
    tooltipField: "name",
    cellRenderer: (params: any) => {
      const { name, logoUrl } = params.data || {};
      return (
        <div className="flex items-center gap-3 py-1">
          <img
            src={`${logoUrl}` || "/images/placeholder-logo.webp"}
            alt={name}
            className="h-8 w-8 rounded object-cover bg-black/10"
          />
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium truncate">{name}</span>
            {params.data?.brandAdvantages?.length ? (
              <div className="flex items-center gap-1 flex-wrap">
                {params.data.brandAdvantages.slice(0, 2).map((adv: string, i: number) => (
                  <Chip key={i} size="sm" variant="flat" color="default" className="h-5">
                    {adv}
                  </Chip>
                ))}
                {params.data.brandAdvantages.length > 2 && (
                  <Chip size="sm" variant="flat" color="default" className="h-5">
                    +{params.data.brandAdvantages.length - 2}
                  </Chip>
                )}
              </div>
            ) : (
              <span className="text-xs text-gray-500 dark:text-gray-400">—</span>
            )}
          </div>
        </div>
      );
    },
    tooltipValueGetter: (p: any) =>
      p?.data?.brandAdvantages?.length
        ? `${p.data.name}\n${p.data.brandAdvantages.join(", ")}`
        : p?.data?.name || "",
  },
  {
    headerName: "Bonus",
    field: "bonus",
    minWidth: 220,
    cellStyle: { display: "flex", alignItems: "center" },
    tooltipValueGetter: (p: any) =>
      p?.data?.bonusDescription || (p?.data ? `Bonus: ${p.data.bonus} ${p.data.bonusCurrency}` : ""),
    cellRenderer: (params: any) => {
      const { bonus, bonusCurrency, bonusDescription } = params.data || {};
      const num = typeof bonus === "number" ? bonus : 0;
      const formatted = new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(num);
      return (
        <Chip size="sm" variant="flat" color="success" className="w-fit">
          +{formatted} {bonusCurrency} {bonusDescription || "—"}
        </Chip>
      );
    },
  },
  {
    headerName: "Rating",
    field: "rating",
    minWidth: 200,
    tooltipField: "rating",
    cellStyle: { display: "flex", alignItems: "center" },
    cellRenderer: (params: any) => {
      const r = Math.max(0, Math.min(5, Number(params.data?.rating ?? 0)));
      const filled = "★".repeat(Math.round(r));
      const empty = "☆".repeat(5 - Math.round(r));
      return (
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">
            <span className="text-yellow-500">{filled}</span>
            <span className="text-gray-400">{empty}</span>
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">({Number(r).toFixed(1)}/5)</span>
        </div>
      );
    },
  },
  {
    headerName: "Partner",
    field: "partnerUrl",
    minWidth: 140,
    tooltipField: "partnerUrl",
    cellRenderer: (params: any) => {
      const url = params.data?.partnerUrl;
      if (!url) return <span className="text-sm text-gray-500 dark:text-gray-400">—</span>;
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
    tooltipField: "archived",
    cellRenderer: (params: any) => {
      const archived = !!params.data?.archived;
      return (
        <Chip size="sm" variant="flat" color={archived ? "danger" : "success"}>
          {archived ? "Archived" : "Active"}
        </Chip>
      );
    },
  },
  {
    headerName: "Created At",
    field: "createdAt",
    minWidth: 220,
    tooltipField: "createdAt",
    cellRenderer: (params: any) => (
      <span className="text-sm">
        {params.data?.createdAt ? formatDateTime(params.data.createdAt, { full: true }) : "—"}
      </span>
    ),
  },
  {
    headerName: "Updated At",
    field: "updatedAt",
    minWidth: 220,
    tooltipField: "updatedAt",
    cellRenderer: (params: any) => (
      <span className="text-sm">
        {params.data?.updatedAt ? formatDateTime(params.data.updatedAt, { full: true }) : "—"}
      </span>
    ),
  },
  {
    colId: "actions",
    headerName: "Actions",
    pinned: "right",
    width: 160,
    minWidth: 160,
    maxWidth: 160,
    lockPosition: true,
    suppressMovable: true,
    resizable: false,
    filter: false,
    sortable: false,
    cellRenderer: (params: any) => {
      const id = params.data?._id;
      const archived = !!params.data?.archived;

      return (
        <div className="flex items-center gap-2 pt-2">
          <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="default"
            onPress={() => params.context.onEditRow?.(params.data?._id)}
            aria-label="Edit offer"
          >
            <Edit size={18} />
          </Button>

          <ConfirmPopover
            title={archived ? "Unarchive Offer" : "Archive Offer"}
            description={
              archived
                ? "Return this offer to Active?"
                : "Move this offer to Archive? You can restore it later."
            }
            approveLabel={archived ? "Unarchive" : "Archive"}
            cancelLabel="Cancel"
            approveColor={archived ? "success" : "default"}
            onApprove={() => params.context.onToggleArchive?.(params.data?._id, !archived)}
          >
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color={archived ? "success" : "default"}
              aria-label={archived ? "Unarchive offer" : "Archive offer"}
            >
              {archived ? <ArchiveRestore size={18} /> : <Archive size={18} />}
            </Button>
          </ConfirmPopover>

          <Tooltip content="Delete Offer">
            <ConfirmPopover
              title="Delete Offer"
              description="Are you sure you want to permanently delete this offer? This action cannot be undone."
              useAlert
              alertColor="danger"
              approveLabel="Yes, Delete"
              cancelLabel="Cancel"
              approveColor="danger"
              onApprove={() => params.context.onDeleteRow?.(params.data?._id)}
            >
              <Button isIconOnly size="sm" variant="flat" color="danger" aria-label="Delete offer">
                <Trash2 size={18} />
              </Button>
            </ConfirmPopover>
          </Tooltip>
        </div>
      );
    },
  },
];