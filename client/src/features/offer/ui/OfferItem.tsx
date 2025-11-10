import React, { useEffect } from "react";
import { useImmer } from "use-immer";
// Query
import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// API
import { getOfferById } from "@/api/backend/routes/offer.api";
// UI
import { Card, Skeleton } from "@heroui/react";
// Libs
import { getStarRating } from "../libs";
// Types
import { IOffer } from "../types";
import { CardProps } from "@heroui/react";

const PLACEHOLDER_DETAILS = {
  id: "Loading offer id...",
  name: "Loading offer name...",
  description: "Loading offer description...",
  rating: 5,
};

const INITIAL_STATE: IOfferItemState = {
  id: PLACEHOLDER_DETAILS.id,
  details: PLACEHOLDER_DETAILS,
};

const OfferItem: React.FC<IOfferItemProps> = ({
  id,
  offer,
  isSkeleton,
  onPress,
  cardClassName,
  cardProps,
}) => {
  const [state, updateState] = useImmer<IOfferItemState>({
    ...INITIAL_STATE,
    id,
    details: offer || PLACEHOLDER_DETAILS,
  });
  // ---------------------------
  // Query
  // ---------------------------
  const queryClient = useQueryClient();
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["offer", { id: state.id }],
    enabled: !!state.id,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const res = await getOfferById(state.id);
      return res.data?.result ?? PLACEHOLDER_DETAILS;
    },
    initialData: () => queryClient.getQueryData(["offer", { id: state.id }]),
    initialDataUpdatedAt: () =>
      queryClient.getQueryState(["offer", { id: state.id }])?.dataUpdatedAt,
    staleTime: 0,
  });

  // ---------------------------
  // Handlers
  // ---------------------------
  const onPressHandler = () => {
    onPress?.(state.details);
  };

  // ---------------------------
  // Effects
  // ---------------------------
  useEffect(() => {
    if (id !== state.id) {
      updateState((draft) => {
        draft.id = id;
      });
    }
  }, [id]);

  useEffect(() => {
    if (data) {
      updateState((draft) => {
        draft.details = data;
      });
    }
  }, [data]);
  // ---------------------------
  // Helpers
  // ---------------------------
  const hasRating = state.details.rating != null; // true для 0..5, false только для null/undefined
  const rating = getStarRating(state.details.rating);

  return (
    <Card
      isPressable
      radius="none"
      shadow="none"
      onPress={onPressHandler}
      {...cardProps}
      className={`flex flex-row items-start flex-1 gap-1.5  w-full ${cardClassName}`}
    >
      <Skeleton
        className="h-full aspect-square"
        isLoaded={!isSkeleton && !isFetching}
      >
        <img
          src={`/api${state.details.logoUrl}`}
          className="h-full aspect-square object-cover rounded-sm"
          alt="Placeholder"
        />
      </Skeleton>
      <div className="flex flex-1 w-full flex-col items-start justify-between gap-1 h-full">
        <Skeleton isLoaded={!isSkeleton && !isFetching}>
          <div className="text-sm">{state.details.name || "No name..."}</div>
        </Skeleton>
        <Skeleton isLoaded={!isSkeleton && !isFetching}>
          {hasRating ? (
            <div
              className="flex items-start gap-2"
              aria-label={rating.ariaLabel}
            >
              <span className="text-base leading-none">
                <span className="text-yellow-500 text-xs">{rating.filled}</span>
                <span className="text-gray-400 text-xs">{rating.empty}</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {rating.display}
              </span>
            </div>
          ) : (
            <span className="text-sm text-default-300">No rating...</span>
          )}
        </Skeleton>
      </div>
    </Card>
  );
};

export default OfferItem;

// ===========================
// Types
// ===========================
interface IOfferItemProps {
  id: string;
  offer?: IOffer;
  isSkeleton?: boolean;
  onPress?: (offer: Partial<IOffer>) => void;
  cardClassName?: string;
  cardProps?: CardProps;
}

interface IOfferItemState {
  id: string;
  details: Partial<IOffer>;
}
