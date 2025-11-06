// ==========================
// Props
// ==========================
export interface DraggableContainerProps {
  items: any[];
  renderItem: (item: any, index: number) => React.ReactNode;
  onChange?: (nextItems: any[]) => void;
  children?: React.ReactNode;
  className?: string;
}

export interface SortableRowProps {
  id: string;
  onRemove: () => void;
  children: React.ReactNode;
}

// ==========================
// Types
// ==========================
export type DraggableContainerState = {
  items: any[];
};
