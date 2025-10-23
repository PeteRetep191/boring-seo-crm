import React, { useMemo, useState } from "react";
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
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { restrictToVerticalAxis, restrictToParentElement } from "@dnd-kit/modifiers";

const DraggableContainer: React.FC = () => {
    const [items, setItems] = useState<Item[]>([
    { id: "a", label: "Alpha" },
    { id: "b", label: "Bravo" },
    { id: "c", label: "Charlie" },
    { id: "d", label: "Delta" },
  ]);

  // Сенсоры: чуть “ленивее” старт перетаскивания, чтобы не ловить клики
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 5 }, // начать drag после смещения курсора на 5px
    })
  );

  const ids = useMemo(() => items.map(i => i.id), [items]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next);

    // Лог нового порядка
    console.log("New order:", next.map(i => i.id));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis, restrictToParentElement]}
    >
      <SortableContext items={ids} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 max-w-md">
          {items.map(item => (
            <SortableItem key={item.id} item={item} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default DraggableContainer;

// ========================
// Components
// ========================
const SortableItem: React.FC<{ item: Item }> = ({ item }) => {
  const {
    attributes,           // aria-атрибуты для доступности
    listeners,            // обработчики для drag (навешиваем на handle)
    setNodeRef,           // реф контейнера
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 shadow-sm"
    >
      {/* Ручка: только за неё можно тянуть */}
      <div
        className="cursor-grab active:cursor-grabbing select-none px-2 py-1 rounded bg-gray-100 text-gray-600"
        {...attributes}
        {...listeners}
        title="Drag"
      >
        ¯\_(ツ)_/¯
      </div>

      {/* Контент айтема */}
      <div className="flex-1 truncate">{item.label}</div>
    </div>
  );
};

// ========================
// Types
// ========================
type Item = { id: string; label: string };