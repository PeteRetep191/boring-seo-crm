const formatDateTime = (
  input: string | number | Date | null | undefined,
  options?: {
    full?: boolean;            // добавить время
    locale?: string;           // локаль
    month?: 'short' | 'long' | 'numeric' | '2-digit';
    time24?: boolean;          // 24ч формат
    withSeconds?: boolean;     // добавить секунды
    fallback?: string;         // что вернуть если нет даты/некорректно
  }
): string => {
  const {
    full = false,
    locale = 'en-US',
    month = 'short',
    time24 = true,
    withSeconds = false,
    fallback = '-',
  } = options || {};

  if (input == null) return fallback;

  const d = new Date(input);
  if (isNaN(d.getTime())) return fallback;

  const date = d.toLocaleDateString(locale, {
    day: '2-digit',
    month,
    year: 'numeric',
  });

  if (!full) return date;

  const time = d.toLocaleTimeString(locale, {
    hour: '2-digit',
    minute: '2-digit',
    ...(withSeconds ? { second: '2-digit' } : {}),
    hour12: !time24,
  });

  return `${date}, ${time}`;
};

export default formatDateTime;