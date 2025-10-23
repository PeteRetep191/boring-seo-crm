const titleCase = (input: string): string => {
  return input
    .trim()
    .replace(/[-_]+/g, " ")
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
};

export default titleCase;