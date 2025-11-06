import React from "react";
// UI
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardBody, Button, Checkbox, Tooltip } from "@heroui/react";
// Icons
import { GripVerticalIcon, Trash2 } from "lucide-react";
// Types
import { SortableRowProps } from "../types";

const SortableRow: React.FC<SortableRowProps> = ({
  id,
  onRemove,
  children,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  // --------------------------------
  // Render
  // --------------------------------
  return (
    <div ref={setNodeRef} style={style}>
      <Card shadow="sm" radius="sm">
        <CardBody className="relative flex flex-row items-stretch gap-2 p-0">
          <div className="flex flex-col items-center h-auto bg-primary/35">
            {/*<Checkbox
              className="m-0 p-0 pt-2"
              classNames={{
                wrapper: "p-0 m-0",
              }}
            />*/}
            <Button
              size="sm"
              radius="none"
              isIconOnly
              variant="flat"
              color="primary"
              title="Drag"
              {...attributes}
              {...listeners}
              className="flex-1 bg-transparent"
            >
              <GripVerticalIcon size={20} />
            </Button>
          </div>

          <div className="flex flex-1 flex-row min-w-0 py-2">{children}</div>
          <Tooltip content="Remove Item" placement="top">
            <Button
              size="sm"
              isIconOnly
              variant="flat"
              color="danger"
              title="Remove"
              radius="none"
              className="h-auto"
            >
              <Trash2 size={20} />
            </Button>
          </Tooltip>
        </CardBody>
      </Card>
    </div>
  );
};

export default SortableRow;
