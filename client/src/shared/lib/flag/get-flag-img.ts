const getFlagImg = (iso2: string, opts: FlagOptions = {}): string => {
  const codeLower = iso2.trim().toLowerCase();
  const codeUpper = iso2.trim().toUpperCase();
  const provider = opts.provider ?? "flagcdn";

  if (provider === "flagcdn") {
    if ((opts.format ?? "svg") === "svg") {
      return `https://flagcdn.com/${codeLower}.svg`;
    }
    const size = opts.size ?? 64;
    const height = Math.round(size * 0.75);
    return `https://flagcdn.com/${size}x${height}/${codeLower}.png`;
  }

  // FlagsAPI — завжди PNG
  const size = String(opts.size ?? 64);
  const style = opts.style ?? "flat";
  return `https://flagsapi.com/${codeUpper}/${style}/${size}.png`;
};

// ==========================
// Types
// ==========================
export type FlagProvider = "flagcdn" | "flagsapi";
export type FlagOptions = {
  provider?: FlagProvider;
  format?: "svg" | "png";
  size?: 16 | 24 | 32 | 48 | 64 | 96 | 128 | 256 | 512;
  style?: "flat" | "shiny" | "waving";
};

export default getFlagImg;
