import { useMemo, useRef, useState, useEffect } from "react";
// Data
import { useQuery, keepPreviousData } from "@tanstack/react-query";
// API
import { fetchOffers } from "@/api/backend/routes/offer.api";
// UI
import { Input, Button } from "@heroui/react";
import { Listbox, ListboxItem } from "@heroui/react";
import { OfferItem } from "../ui";
// Icons
import { InboxIcon, Plus } from "lucide-react";
// Libs
import debounce from "lodash.debounce";
import { IOffer } from "../types";

const SelectOffersForm: React.FC<ISelectOffersForm> = ({
  selected,
  onSelect,
  onClose,
}) => {
  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");

  const setDebouncedSafe = useMemo(
    () =>
      debounce((v: string) => {
        setDebounced(v);
      }, 150),
    [],
  );

  useEffect(() => {
    return () => setDebouncedSafe.cancel();
  }, [setDebouncedSafe]);

  const { data: offers, isFetching } = useQuery({
    queryKey: ["offers", { q: debounced.trim() }],
    placeholderData: keepPreviousData,
    queryFn: async ({ queryKey }) => {
      const [, { q }] = queryKey as ["offers", { q: string }];
      const response = await fetchOffers({ search: q, limit: 50 });
      console.log(response);
      return response.data?.result?.offers || [];
    },
    staleTime: 60_000,
  });

  return (
    <div className="flex flex-col gap-2">
      <Input
        size="md"
        radius="sm"
        value={search}
        onClear={() => {
          setSearch("");
          setDebounced("");
        }}
        onValueChange={(v) => {
          setSearch(v);
          setDebouncedSafe(v);
        }}
        placeholder="Search offers by title or description..."
      />
      <Listbox
        aria-label="Offers"
        className="p-0"
        variant="faded"
        emptyContent={
          <div className="flex flex-col items-center justify-center gap-2 p-5 h-full">
            <div className="flex flex-col items-center justify-center gap-1">
              <InboxIcon size={30} className="text-default-400" />
              <p className="text-sm text-default-400">No offers found</p>
            </div>
            <Button size="sm" variant="flat" color="primary" onPress={() => {}}>
              <Plus size={16} /> Add Offers
            </Button>
          </div>
        }
      >
        {(isFetching
          ? Array.from({ length: 3 }, (_, i) => ({ id: i }))
          : offers
        ).map((offer: IOffer, index: number) => (
          <ListboxItem
            textValue={offer?.name || `Offer ${index + 1}`}
            key={offer?._id || index}
            className="p-0"
          >
            <OfferItem
              id={offer._id}
              key={offer._id}
              isSkeleton={isFetching}
              onPress={(offer) => {
                if (selected?.includes(offer?._id || "")) return;

                onSelect?.(offer as any);
                onClose?.();
                console.log("pressed on offer: ", offer);
              }}
              cardClassName="h-[50px] bg-content2"
              cardProps={{
                isDisabled: isFetching || selected?.includes(offer._id),
              }}
            />
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
};

export default SelectOffersForm;

// ===============================
// Types
// ===============================
interface ISelectOffersForm {
  selected?: string[];
  onSelect?: (offer: IOffer) => void;
  onClose?: () => void;
}
