// Hooks
import { usePlacementsManager } from "../hooks";
// UI
import { Button } from "@heroui/react";
import { Card, CardHeader, CardBody } from "@heroui/react";
import { PlacementItem } from "./";
// Icons
import { Plus, InboxIcon } from "lucide-react";
// Types
import { IPlacement } from "../types";

const PlacementsManages: React.FC<{
  placements: IPlacement[];
  onChange: (placements: IPlacement[]) => void;
}> = ({ placements = [], onChange }) => {
  const placementManager = usePlacementsManager({ placements, onChange });

  // -------------------------
  // Render
  // -------------------------
  return (
    <Card shadow="none" radius="none" className="w-full shrink-0">
      {placementManager.state.placements.length > 0 ? (
        <div>
          <CardHeader className="flex items-center justify-between gap-2 p-1">
            <span></span>
            <Button
              size="sm"
              radius="sm"
              variant="flat"
              color="primary"
              isDisabled={!placementManager.state.isValid}
              onPress={placementManager.actions.addEmptyPlacement}
            >
              <Plus size={16} /> Add
            </Button>
          </CardHeader>
          <CardBody className="flex flex-col gap-2 p-1">
            {placementManager.state.placements.map((placement) => (
              <PlacementItem
                key={placement.id}
                placement={placement}
                onChange={placementManager.actions.updatePlacement}
              />
            ))}
          </CardBody>
        </div>
      ) : (
        <CardBody className="flex flex-col items-center justify-center gap-2">
          <InboxIcon size={32} className="text-default-400" />
          <span className="text-default-400">No placements found.</span>
          <Button
            size="sm"
            radius="sm"
            variant="flat"
            color="primary"
            onPress={placementManager.actions.addEmptyPlacement}
          >
            Add First Placement
          </Button>
        </CardBody>
      )}
    </Card>
  );
};

export default PlacementsManages;
