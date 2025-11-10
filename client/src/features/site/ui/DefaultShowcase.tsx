// Contexts
import { useDetailsSiteFormContext } from "../contexts";
// UI
import { Button } from "@heroui/react";
import { Card, CardBody } from "@heroui/react";
import { ShowcasePlacement } from "@/features/showcase/ui";
// Icons
import { InboxIcon } from "lucide-react";
// Types
import { IPlacement } from "@/features/placement/types";
import { IShowcase, IShowcasePlacement } from "@/features/showcase/types";

const DefaultShowcase: React.FC<{
  placements: IPlacement[];
  value: IShowcase;
  onChange: (value: IShowcase) => void;
}> = ({ placements, value, onChange }) => {
  const detailsSiteFormContext = useDetailsSiteFormContext();

  // ------------------------
  // Helpers
  // ------------------------
  const getPlacementDetailsById = (id: string) => {
    return placements.find((placement) => placement.id === id) || [];
  };

  // ------------------------
  // Helpers
  // ------------------------
  const handlePlacementChange = (
    patch: Pick<IShowcasePlacement, "id" | "value">,
  ) => {
    const next: IShowcase = {
      ...value,
      placements: value.placements.map((p) =>
        p.id === patch.id ? { ...p, value: patch.value } : p,
      ),
    };
    onChange(next);
  };

  // ------------------------
  // Render
  // ------------------------
  return (
    <>
      <span className="text-sm">Default Showcase</span>
      <Card radius="sm" shadow="none" className={`p-0`}>
        <CardBody className="p-0 flex flex-col gap-2">
          {value.placements.length > 0 ? (
            value.placements.map((placement, index) => (
              <ShowcasePlacement
                key={index}
                placement={{
                  ...placement,
                  ...getPlacementDetailsById(placement.id),
                }}
                onChange={(changed) =>
                  handlePlacementChange({
                    id: changed.id,
                    value: changed.value,
                  })
                }
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center gap-2 w-full p-5">
              <InboxIcon size={20} className="text-default-400" />
              <span className="text-sm text-default-500">
                No placements available
              </span>
              <Button
                size="sm"
                radius="sm"
                variant="flat"
                color="primary"
                onPress={() =>
                  detailsSiteFormContext.actions.updateTabState("placements")
                }
              >
                Go to placement manager
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default DefaultShowcase;
