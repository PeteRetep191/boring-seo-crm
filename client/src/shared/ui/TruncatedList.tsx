import * as React from "react";
// Components
import { Tooltip, TooltipProps } from "@heroui/react";

// ==========================
// TruncatedList
// ==========================
const TruncatedList = <T,>({
  items,
  max = 3,
  renderItem,
  keyExtractor,
  className,
  gapClassName = "gap-1",
  tooltipProps,
  collapseAlways = true,
  emptyContent = null
}: TruncatedListProps<T>) => {
  const shouldCollapse = items.length > max && collapseAlways;
  const visible = shouldCollapse ? items.slice(0, max) : items;
  const hidden = shouldCollapse ? items.slice(max) : [];

  const contentAll = (
    <div className={`flex flex-wrap ${gapClassName} max-w-xs`}>
      {items.map((it, i) => (
        <div key={keyExtractor ? keyExtractor(it, i) : i}>{renderItem(it, i)}</div>
      ))}
    </div>
  );

  if (!items || items.length === 0) {
    return (
      <div className={`flex items-center ${className ?? ""}`}>
        <span className="text-foreground-500 text-small">
          {emptyContent ?? "No items"}
        </span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${gapClassName} ${className ?? ""}`}>
      {visible.map((it, i) => (
        <div key={keyExtractor ? keyExtractor(it, i) : i}>{renderItem(it, i)}</div>
      ))}

      {shouldCollapse && (
        <Tooltip
          content={contentAll}
          placement="top"
          delay={100}
          closeDelay={50}
          {...tooltipProps}
        >
          <button
            type="button"
            aria-label={`Show ${hidden.length} more`}
            className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-default-200 text-foreground-600 text-[11px] leading-none select-none"
          >
            +{hidden.length}
          </button>
        </Tooltip>
      )}
    </div>
  );
}

export default TruncatedList;

// ==========================
// Types
// ==========================
export type TruncatedListProps<T> = {
  items: T[];
  /** Сколько элементов показать сразу (остальные уйдут в +N). По умолчанию 3. */
  max?: number;
  /** Как отрендерить один item. */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Как получить ключ для item. По умолчанию index. */
  keyExtractor?: (item: T, index: number) => React.Key;
  /** Классы контейнера (флекс-строка). */
  className?: string;
  /** Gap между элементами (Tailwind класс). По умолчанию gap-1. */
  gapClassName?: string;
  /** Пропсы для Tooltip. */
  tooltipProps?: Omit<TooltipProps, "content" | "children">;
  /** Узкий режим: сворачивать уже при items.length > max, иначе показывать всё. По умолчанию true. */
  collapseAlways?: boolean;
  /** Что показывать, если items пустой. По умолчанию null. */
  emptyContent?: React.ReactNode;
};