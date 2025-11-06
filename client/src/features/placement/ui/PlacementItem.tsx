// Hooks
import { useImmer } from "use-immer";
// UI
import { Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { Card, CardHeader, CardBody } from "@heroui/react";
// Icons
import { Trash2 } from "lucide-react";
// Types
import { IPlacement } from "../types";
import { useEffect } from "react";

const PlacementItem: React.FC<{
  placement: IPlacement;
  onChange: (id: string, placement: IPlacement) => void;
}> = ({ placement, onChange }) => {
  const [state, updateState] = useImmer<IPlacement>({
    id: placement.id,
    type: placement.type || null,
    name: placement.name || "",
    description: placement.description || "",
  });

  useEffect(() => {
    onChange?.(state.id, state);
  }, [state]);

  return (
    <Card radius="none" shadow="none">
      <CardHeader className="flex items-center justify-between gap-2 p-1 px-2">
        <span className="text-sm text-default-400">
          Placement ID: {placement.id}
        </span>
        <Button
          variant="light"
          size="sm"
          color="danger"
          isIconOnly
          className="min-w-0 w-7 h-7"
        >
          <Trash2 size={18} />
        </Button>
      </CardHeader>
      <CardBody className="p-1 px-2 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <Select
            aria-label="Type"
            placeholder="Select type..."
            selectedKeys={[placement.type || ""]}
            onChange={(e) => {
              updateState((draft) => {
                draft.type = e.target.value as "single" | "multiple";
              });
            }}
          >
            <SelectItem key="single">Single</SelectItem>
            <SelectItem key="multiple">Multiple</SelectItem>
          </Select>
          <Input
            aria-label="Name"
            placeholder="Enter name..."
            value={placement.name}
            onChange={(e) => {
              updateState((draft) => {
                draft.name = e.target.value;
              });
            }}
          />
        </div>

        <Textarea
          placeholder="(optional) Enter description..."
          value={placement.description}
          onChange={(e) => {
            updateState((draft) => {
              draft.description = e.target.value;
            });
          }}
        />
      </CardBody>
    </Card>
  );
};

export default PlacementItem;
