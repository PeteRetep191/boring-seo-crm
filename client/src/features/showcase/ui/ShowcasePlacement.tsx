import { useEffect } from "react";
import { useImmer } from "use-immer";
// UI Components
import { Button } from "@heroui/react";
import { OfferSelector, OfferMultiSelector } from "@/features/offer/ui";
// Icons
import { Trash2 } from "lucide-react";
// Types
import { IShowcasePlacement } from "@/features/showcase/types";
import { IPlacement } from "@/features/placement/types";

const ShowcasePlacement: React.FC<{
  placement: IShowcasePlacement & Partial<IPlacement>;
  onChange: (placement: IShowcasePlacement) => void;
}> = ({ placement, onChange }) => {
  const [state, updateState] = useImmer<IShowcasePlacement>(placement);

  useEffect(() => {
    if (!state.value) return;
    onChange?.(state);
  }, [state]);

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2">
        <span className="text-sm text-default-500 truncate">
          {placement.name || "-"}
        </span>
        <span className="text-sm text-default-500 justify-self-end">
          ID: {placement.id}
        </span>
      </div>
      {(() => {
        switch (placement.type) {
          case "single":
            return (
              <OfferSelector
                value={state.value as string}
                endContent={
                  <div className="flex items-center h-full">
                    <Button
                      size="sm"
                      radius="none"
                      variant="light"
                      isIconOnly
                      color="danger"
                      className="h-full"
                      onPress={() => {
                        updateState((draft) => {
                          draft.value = null;
                        });
                      }}
                    >
                      <Trash2 size={20} />
                    </Button>
                  </div>
                }
                onChange={(value) => {
                  updateState((draft) => {
                    draft.value = value;
                  });
                }}
                className="h-[55px]"
              />
            );
          case "multiple":
            return (
              <OfferMultiSelector
                value={state.value as string[]}
                onChange={(value) => {
                  updateState((draft) => {
                    draft.value = value;
                  });
                }}
              />
            );
          default:
            return (
              <span className="text-sm text-default-500">
                You are not selected an type of placement, please select one
              </span>
            );
        }
      })()}
    </div>
  );
};

export default ShowcasePlacement;
