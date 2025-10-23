import React, { useEffect, useMemo, useRef } from "react";
import { useImmer } from "use-immer";
// components
import { DndContext, useSensor, useSensors, PointerSensor, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";
import { Card, CardHeader, CardBody, CardFooter, Button, Checkbox, Tooltip } from "@heroui/react";
// Icons
import { GripVerticalIcon, Trash2, Inbox } from "lucide-react";
// libs
import { pickFirstChildOfType } from "@/shared/lib/react";


// ==========================
// DraggableList
// ==========================
export function DraggableList<T extends WithId>({
  items,
  renderItem,
  onChange,
  children,
  className,
}: DraggableListProps<T>) {
  const [state, update] = useImmer<T[]>(items);
  const skipNextOnChange = React.useRef(false);

  // входящие items -> локальный state (не триггерим onChange)
  useEffect(() => {
    skipNextOnChange.current = true;
    update(() => items);
  }, [items, update]);

  // централизованный onChange на любые изменения state
  useEffect(() => {
    if (skipNextOnChange.current) {
      skipNextOnChange.current = false;
      return;
    }
    onChange?.(state);
  }, [state, onChange]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const ids = useMemo(() => state.map(i => i.id), [state]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = ids.indexOf(String(active.id));
    const newIndex = ids.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    update(draft => arrayMove(draft, oldIndex, newIndex));
  };

  const handleRemove = (id: string) => {
    update(draft => {
      const idx = draft.findIndex(i => i.id === id);
      if (idx >= 0) draft.splice(idx, 1);
    });
  };

  const headerEl = pickFirstChildOfType(children, DraggableListHeader);
  const footerEl = pickFirstChildOfType(children, DraggableListFooter);

  return (
    <div className={className}>
      {headerEl && <div className="mb-2">{headerEl}</div>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {Array.isArray(state) && state.length > 0 ? (
               state.map((item, index) => (
                  <SortableRow key={item.id} id={item.id} onRemove={() => handleRemove(item.id)}>
                    {renderItem(item, index)}
                  </SortableRow>
                ))
            ):(
              <div className="flex items-center justify-center flex-col gap-2">
                <Inbox size={40}/>
                <span>No items yet...</span>
              </div>
            )}
           
          </div>
        </SortableContext>
      </DndContext>

      {footerEl && <div className="mt-2">{footerEl}</div>}
    </div>
  );
}

// ==========================
// SortableRow
// ==========================
type SortableRowProps = {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
};

function SortableRow({ id, onRemove, children }: SortableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card
        shadow="none"
        radius="sm"
      >
        <CardBody 
          className="relative flex flex-row items-stretch gap-2 p-0"
        >
            <div className="flex flex-col items-center h-auto bg-primary/35">
               <Checkbox
                  className="m-0 p-0 pt-2"
                  classNames={{ 
                    wrapper: "p-0 m-0",
                   }}
                />
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
                <GripVerticalIcon size={20}/>
              </Button>
            </div>

            <div className="flex flex-1 flex-row min-w-0 py-2">
              {children}
            </div>
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
                <Trash2 size={20}/>
              </Button>
            </Tooltip>
        </CardBody>
      </Card>
    </div>
  );
}

// ==========================
// Markers
// ==========================
export const DraggableListHeader: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;
export const DraggableListFooter: React.FC<{ children: React.ReactNode }> = ({ children }) => <>{children}</>;

// ==========================
// Types
// ==========================
export type DraggableListProps<T extends WithId> = {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  onChange?: (nextItems: T[]) => void;
  children?: React.ReactNode;
  className?: string;
};

type WithId = { id: string };