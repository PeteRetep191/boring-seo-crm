import React, { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useImmer } from "use-immer";
import { useNavigate } from "react-router-dom";
// Context
import { useAuthContext } from "@/core/providers/AuthProvider";
// UI
import {
  Button,
  Input,
  Pagination,
  Divider,
  SelectItem,
  Select,
} from "@heroui/react";
import {
  ScalablePanel,
  ScalablePanelHeader,
  ScalablePanelFooter,
  ScalablePanelBody,
} from "@/features/components/scalable-panel/ui";
import {
  DynamicTable,
  DynamicTableBody,
  DynamicTableFooter,
  DynamicTableHeader,
} from "@/features/components/dynamic-table/ui";
// Icons
import { Plus, RefreshCcw, Search } from "lucide-react";
// Table
import { WebsitesManagementTable } from "@/features/components/dynamic-table/tables";
// Utils
import toast from "react-hot-toast";
import { useDebounce } from "@/shared/hooks/useDebounce";
// Libs
import { formatPaginationStatus } from "@/shared/lib/pagination";

const MOCK_SITES: any[] = [];

const INITIAL_STATE = {
  search: "",
  pagination: {
    page: 1,
    pages: 1,
    totalRows: 0,
    limit: {
      default: 50,
      current: 50,
      options: ["10", "25", "50", "100"],
    },
  },
  filters: [] as any[],
  selectedRows: [] as any[],
  isFilterChanged: false,
  modals: {
    showCreateOfferModal: false,
    showEditModal: false,
  },
  editing: {
    offerId: null as string | null,
    logoUrl: null as string | null,
  },
};

const SitesPage: React.FC = () => {
  // Contexts
  const authContext = useAuthContext();

  // States
  const [state, update] = useImmer(INITIAL_STATE);
  const [searchInput, setSearchInput] = useState(state.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // Hooks
  const navigate = useNavigate();

  // -------------------------
  // Data fetching
  // -------------------------

  // ----------------------------
  // Handlers
  // ----------------------------

  // -------------------------
  // Actions
  // -------------------------
  const handleEditRow = (offerId: string) => {
    const row = ([] as any[] | undefined)?.find((o) => o._id === offerId);
    update((d) => {
      d.editing.offerId = offerId;
      d.editing.logoUrl = row?.logoUrl ?? null;
      d.modals.showEditModal = true;
    });
  };

  const handleDeleteRow = async (offerId: string) => {
    try {
      // await deleteOfferById(offerId);
      toast.success("Offer deleted");
      // refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete offer");
    }
  };

  // ----------------------------
  // Effects
  // ----------------------------

  // ----------------------------
  // Render
  // ----------------------------
  return (
    <>
      <DynamicTable className="h-full">
        <DynamicTableHeader className="flex justify-between items-center gap-2">
          <div className="flex flex-1 items-center justify-start gap-2">
            <Input
              type="search"
              placeholder="Search websites by name, domain, description or tags..."
              className="w-full"
              variant="flat"
              startContent={<Search size={16} className="text-gray-500" />}
              size="md"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>

          <Divider className="flex-1" />

          <div className="flex items-center justify-end gap-2">
            <Button
              radius="sm"
              variant="flat"
              color="primary"
              startContent={<Plus size={16} />}
              onPress={() => navigate("/sites/create")}
            >
              Add New Website
            </Button>
            <Button
              isIconOnly
              radius="sm"
              color="primary"
              variant="flat"
              // onPress={() => refetch()}
              // isDisabled={isFetching}
              aria-label="Refresh"
              className="w-[50px]"
            >
              <RefreshCcw size={20} />
            </Button>
          </div>
        </DynamicTableHeader>
        <DynamicTableBody className="flex flex-row gap-2 h-full">
          <div className="flex-3">
            <WebsitesManagementTable
              rowData={(MOCK_SITES as any) || []}
              // isLoading={isFetching}
              onSelectionChanged={(selected) =>
                update((draft) => {
                  draft.selectedRows = selected;
                })
              }
              context={{
                user: authContext.user,
                onEditRow: handleEditRow,
                onDeleteRow: handleDeleteRow,
                // onToggleArchive: handleToggleArchive,
              }}
            />
          </div>

          <ScalablePanel maxWidth={300} title="Quick Filters">
            <ScalablePanelHeader className="w-full">
              <div className="flex items-center justify-end pr-2">
                <h3 className="text-md truncate">Quick Filters</h3>
              </div>
            </ScalablePanelHeader>
            <ScalablePanelBody>
              <></>
            </ScalablePanelBody>
            <ScalablePanelFooter className="flex-1">
              <Button
                variant="flat"
                color="primary"
                fullWidth
                isDisabled={!state.isFilterChanged}
                onPress={() => {
                  // refetch();
                  update((d) => {
                    d.isFilterChanged = false;
                  });
                }}
              >
                Apply Filters
              </Button>
            </ScalablePanelFooter>
          </ScalablePanel>
        </DynamicTableBody>
        <DynamicTableFooter className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground mr-4">
            {formatPaginationStatus(
              state.pagination.page,
              state.pagination.limit.current,
              state.pagination.totalRows,
              {
                locale: "en",
              },
            )}
          </span>
          <div className="flex items-center gap-4">
            <Select
              aria-label="Select page size"
              selectionMode="single"
              selectedKeys={[state.pagination.limit.current.toString()]}
              onSelectionChange={(sel) => {
                const [first] = Array.from(sel as Set<string>);
                const v = Number(first);
                update((d) => {
                  d.pagination.page = 1;
                  d.pagination.limit.current = Number.isFinite(v) ? v : 50;
                });
              }}
              className="w-24"
            >
              {state.pagination.limit.options.map((option) => (
                <SelectItem key={option} textValue={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </Select>
            <Pagination
              total={state.pagination.pages}
              page={state.pagination.page}
              onChange={(page) =>
                update((d) => {
                  d.pagination.page = page;
                })
              }
              showControls
            />
          </div>
        </DynamicTableFooter>
      </DynamicTable>
    </>
  );
};

export default SitesPage;
