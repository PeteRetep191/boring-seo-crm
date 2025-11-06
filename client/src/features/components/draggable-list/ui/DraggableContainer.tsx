import React, { useEffect, useState } from "react";
// UI
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  closestCenter,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import SortableRow from "./SortableRow";
// Icons
import { Inbox } from "lucide-react";
// Libs
import { pickFirstChildOfType } from "@/shared/lib/react";
// Types
import { DraggableContainerProps, DraggableContainerState } from "../types";
import { useImmer } from "use-immer";

const INITIAL_STATE: DraggableContainerState = {
  items: [],
};

// ==========================
// DraggableList
// ==========================
const DraggableContainer: React.FC<DraggableContainerProps> = ({
  items,
  renderItem,
  onChange,
  children,
  className,
}: DraggableContainerProps) => {
  const [state, updateState] = useImmer<DraggableContainerState>({
    ...INITIAL_STATE,
    items,
  });
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // -------------------------
  // Handlers
  // -------------------------
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = state.items.indexOf(active.id);
    const newIndex = state.items.indexOf(String(over.id));
    if (oldIndex < 0 || newIndex < 0) return;

    updateState((draft) => arrayMove(draft.items, oldIndex, newIndex));
  };

  // const handleRemove = (id: string) => {
  //   update((draft) => {
  //     const idx = draft.findIndex((i) => i.id === id);
  //     if (idx >= 0) draft.splice(idx, 1);
  //   });
  // };

  // -------------------------
  // Effects
  // -------------------------
  // useEffect(() => {
  //   update(() => items);
  // }, [items, update]);

  // централизованный onChange на любые изменения state
  // useEffect(() => {
  //   onChange?.(state);
  // }, [state]);

  // -----------------------
  // Markers
  // -----------------------
  const headerEl = pickFirstChildOfType(children, DraggableContainerHeader);
  const footerEl = pickFirstChildOfType(children, DraggableContainerFooter);

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className={className}>
      {headerEl && <div className="mb-2">{headerEl}</div>}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis, restrictToParentElement]}
      >
        <SortableContext
          items={state.items}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2">
            {Array.isArray(state.items) && state.items.length > 0 ? (
              state.items.map((item, index) => (
                <SortableRow
                  key={item}
                  id={item}
                  onRemove={() => {
                    console.log("Remove item");
                  }}
                >
                  {renderItem(item, index)}
                </SortableRow>
              ))
            ) : (
              <div className="flex items-center justify-center flex-col gap-2">
                <Inbox size={40} />
                <span>No items yet...</span>
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>

      {footerEl && <div className="mt-2">{footerEl}</div>}
    </div>
  );
};

export default DraggableContainer;

// ==========================
// Markers
// ==========================
export const DraggableContainerHeader: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <>{children}</>;
export const DraggableContainerFooter: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => <>{children}</>;
