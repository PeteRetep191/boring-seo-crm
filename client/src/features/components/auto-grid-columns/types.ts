export type AutoGridProps = React.PropsWithChildren<{
  itemMinWidth: number;
  gapPx?: number;
  maxCols?: number;
  className?: string;
}>;