import {useEffect, useRef, useState} from "react";

const useAutoGridColumns = (opts: {
  itemMinWidth: number;
  gap?: number;
  maxCols?: number;
}) => {
  const { itemMinWidth, gap = 12, maxCols = 12 } = opts;
  const ref = useRef<HTMLDivElement | null>(null);
  const [cols, setCols] = useState(1);

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    let raf = 0;

    const calc = () => {
      const w = el.clientWidth;
      // Каждая «ячейка» занимает minWidth + gap, между колонками (n-1)*gap.
      // Удобно посчитать так: (w + gap) / (itemMinWidth + gap)
      const n = Math.max(1, Math.floor((w + gap) / (itemMinWidth + gap)));
      setCols(Math.min(maxCols, n));
    };

    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(calc);
    });

    ro.observe(el);
    calc();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [itemMinWidth, gap, maxCols]);

  return { ref, cols };
}

export default useAutoGridColumns;