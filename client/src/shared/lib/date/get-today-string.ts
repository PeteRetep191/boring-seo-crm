const getTodayString = (full?: boolean): string => {
  const now = new Date();

  const date = now.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (!full) return date;

  const time = now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // за бажанням:
    // second: "2-digit",
    // hour12: true, // або false для 24г формату
  });

  return `${date}, ${time}`;
};

export default getTodayString;