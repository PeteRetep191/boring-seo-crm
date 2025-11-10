const getStarRating = (rating: unknown, max = 5): IGetStarRatingApi => {
  const r = Math.max(0, Math.min(max, Number(rating ?? 0)));
  const rounded = Math.round(r);
  const filled = "★".repeat(rounded);
  const empty = "☆".repeat(max - rounded);

  return {
    value: r,
    rounded,
    filled,
    empty,
    ariaLabel: `Rating ${r.toFixed(1)} of ${max}`,
    display: `(${r.toFixed(1)}/${max})`,
  };
};

export default getStarRating;

// ===========================
// Types
// ===========================
export interface IGetStarRatingApi {
  /** Нормализованное значение (0..max) с плавающей точкой */
  value: number;
  /** Значение, округлённое до ближайшего целого (0..max) */
  rounded: number;
  /** Строка из заполненных звёзд, длиной rounded */
  filled: string;
  /** Строка из пустых звёзд, длиной max - rounded */
  empty: string;
  /** Текст для a11y: например "Rating 3.5 of 5" */
  ariaLabel: string;
  /** Готовая строка для отображения: например "(3.5/5)" */
  display: string;
}
