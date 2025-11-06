import React, { useEffect, useMemo, useState } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { useImmer } from "use-immer";
// Context
import { useAuthContext } from "@/core/providers/AuthProvider";
// API
import {
  fetchOffers,
  updateOffer,
  patchOffer,
  deleteOfferById,
} from "@/api/backend/routes/offer.api";
import {
  Button,
  Input,
  Divider,
  Pagination,
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import {
  DynamicTable,
  DynamicTableBody,
  DynamicTableFooter,
  DynamicTableHeader,
} from "@/features/components/dynamic-table/ui";
import {
  ScalablePanel,
  ScalablePanelHeader,
  ScalablePanelFooter,
  ScalablePanelBody,
} from "@/features/components/scalable-panel/ui";
// Icons
import { Search, RefreshCcw, Plus } from "lucide-react";
// Table
import { OffersManagementTable } from "@/features/components/dynamic-table/tables";
// Forms
import DetailsOfferForm from "@/features/offer/forms/DetailsOfferForm";
// Utils
import toast from "react-hot-toast";
import { useDebounce } from "@/shared/hooks/useDebounce";
// DTOs
import { FetchOffersDTO } from "@/api/backend/contracts/offer.dto";
// Libs
import { formatPaginationStatus } from "@/shared/lib/pagination";

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

const OffersPage: React.FC = () => {
  const { user } = useAuthContext();
  const [state, update] = useImmer(INITIAL_STATE);
  const [searchInput, setSearchInput] = useState(state.search);
  const debouncedSearch = useDebounce(searchInput, 400);

  // -------------------------
  // Data fetching
  // -------------------------
  const queryParams: FetchOffersDTO = useMemo(
    () => ({
      page: state.pagination.page,
      limit: state.pagination.limit.current,
      search: state.search,
      filters: state.filters,
    }),
    [
      state.pagination.page,
      state.pagination.limit.current,
      state.search,
      state.filters,
    ],
  );

  const {
    data: offers,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: [
      "offers",
      queryParams.page,
      queryParams.limit,
      queryParams.search,
    ],
    queryFn: async () => {
      const res = await fetchOffers(queryParams);
      if (!res?.data?.result) throw new Error("No data");
      const { pagination } = res.data.result;

      update((d) => {
        d.pagination.pages = pagination?.pages ?? 1;
        d.pagination.page = pagination?.page ?? 1;
        d.pagination.limit.current =
          pagination?.limit ?? INITIAL_STATE.pagination.limit.default;
        // d.pagination.total = pagination?.total ?? 0;
      });

      return res.data.result;
    },
    select: (result) => result.offers ?? [],
    staleTime: 0,
    gcTime: 0,
    placeholderData: keepPreviousData,
  });

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    update((d) => {
      d.search = debouncedSearch;
      d.pagination.page = 1;
    });
  }, [debouncedSearch, update]);

  useEffect(() => {
    update((d) => {
      d.isFilterChanged = true;
    });
  }, [state.filters, update]);

  // -------------------------
  // Actions
  // -------------------------
  const handleChangeEnabled = async (
    offerId: string,
    newActiveStatus: boolean,
  ) => {
    try {
      await patchOffer({
        offerId,
        updatedOfferData: { isActive: newActiveStatus } as any,
      });
      toast.success(newActiveStatus ? "Offer activated" : "Offer deactivated");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  const handleEditRow = (offerId: string) => {
    const row = (offers as any[] | undefined)?.find((o) => o._id === offerId);
    update((d) => {
      d.editing.offerId = offerId;
      d.editing.logoUrl = row?.logoUrl ?? null;
      d.modals.showEditModal = true;
    });
  };

  const handleDeleteRow = async (offerId: string) => {
    try {
      await deleteOfferById(offerId);
      toast.success("Offer deleted");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete offer");
    }
  };

  const handleToggleArchive = async (offerId: string, archived: boolean) => {
    try {
      await updateOffer({ offerId, updatedOfferData: { archived } as any });
      toast.success(archived ? "Offer archived" : "Offer unarchived");
      refetch();
    } catch (e) {
      console.error(e);
      toast.error("Failed to update status");
    }
  };

  return (
    <>
      <DynamicTable className="h-full">
        <DynamicTableHeader className="flex justify-between items-center gap-2">
          <div className="flex flex-1 items-center justify-start gap-2">
            <Input
              type="search"
              placeholder="Search offers..."
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
              onPress={() =>
                update((d) => {
                  d.modals.showCreateOfferModal = true;
                })
              }
            >
              Add New Offer
            </Button>
            <Button
              isIconOnly
              radius="sm"
              color="primary"
              variant="flat"
              onPress={() => refetch()}
              isDisabled={isFetching}
              aria-label="Refresh"
              className="w-[50px]"
            >
              <RefreshCcw size={20} />
            </Button>
          </div>
        </DynamicTableHeader>

        <DynamicTableBody className="flex flex-row gap-2 h-full">
          <div className="flex-3">
            <OffersManagementTable
              rowData={(offers as any) || []}
              isLoading={isFetching}
              onSelectionChanged={(selected) =>
                update((draft) => {
                  draft.selectedRows = selected;
                })
              }
              context={{
                user,
                onChangeEnable: handleChangeEnabled,
                onEditRow: handleEditRow,
                onDeleteRow: handleDeleteRow,
                onToggleArchive: handleToggleArchive,
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
                  refetch();
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

      {/* Create Offer Modal */}
      <Modal
        size="3xl"
        scrollBehavior="inside"
        placement="top"
        isOpen={state.modals.showCreateOfferModal}
        onOpenChange={(isOpen) =>
          update((d) => {
            d.modals.showCreateOfferModal = isOpen;
          })
        }
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create new offer
              </ModalHeader>
              <ModalBody className="p-0">
                <DetailsOfferForm
                  onClose={onClose}
                  onSaved={() => {
                    onClose();
                    refetch();
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Edit Offer Modal */}
      <Modal
        size="3xl"
        scrollBehavior="inside"
        placement="top"
        isOpen={state.modals.showEditModal}
        onOpenChange={(isOpen) =>
          update((d) => {
            d.modals.showEditModal = isOpen;
            if (!isOpen) {
              d.editing.offerId = null;
              d.editing.logoUrl = null;
            }
          })
        }
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Edit offer
              </ModalHeader>
              <ModalBody className="p-0">
                {state.editing.offerId && (
                  <DetailsOfferForm
                    offerId={state.editing.offerId}
                    initialLogoUrl={state.editing.logoUrl}
                    onClose={onClose}
                    onSaved={() => {
                      onClose();
                      refetch();
                    }}
                  />
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OffersPage;
