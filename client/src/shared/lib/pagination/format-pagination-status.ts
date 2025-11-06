import { PaginationLocale } from "./types";

const formatPaginationStatus = (
  page: number,
  limit: number,
  totalRows: number,
  opts?: { locale?: PaginationLocale; totalPagesOverride?: number },
) => {
  const { locale = "ru", totalPagesOverride } = opts || {};
  const from = totalRows === 0 ? 0 : (page - 1) * limit + 1;
  const to = totalRows === 0 ? 0 : Math.min(page * limit, totalRows);
  const totalPages =
    totalPagesOverride ?? Math.max(1, Math.ceil(totalRows / limit));

  const texts = {
    ru: `Страница ${page} из ${totalPages} • Показаны ${from}–${to} из ${totalRows} элементов`,
    uk: `Сторінка ${page} з ${totalPages} • Показано ${from}–${to} із ${totalRows} елементів`,
    en: `Page ${page} of ${totalPages} • Showing ${from}–${to} of ${totalRows} items`,
  };

  return texts[locale];
};

export default formatPaginationStatus;
