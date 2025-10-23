import React from "react";
// Hooks
import { useAutoGridColumns } from "@/features/components/auto-grid-columns/hooks";
// Types
import { AutoGridProps } from "@/features/components/auto-grid-columns/types";

const AutoGrid: React.FC<AutoGridProps> = ({
  itemMinWidth,
  gapPx = 12,
  maxCols = 12,
  className,
  children,
}) => {
  const { ref, cols } = useAutoGridColumns({ itemMinWidth, gap: gapPx, maxCols });

  return (
    <div
      ref={ref}
      className={["grid", className].filter(Boolean).join(" ")}
      style={{
        gap: `${gapPx}px`,
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
      }}
    >
      {children}
    </div>
  );
};

export default AutoGrid;