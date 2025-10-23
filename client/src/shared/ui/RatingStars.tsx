import React from "react";
import { Star, StarHalf } from "lucide-react";

const RatingStars: React.FC<Props> = ({
  value,
  max = 5,
  size = 18,
  className = "",
  colorClass = "text-yellow-400",
}) => {
  const v = Math.max(0, Math.min(value, max));
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = Math.max(0, max - full - half);

  return (
    <div className="flex items-center gap-1">
        <span className={`inline-flex items-center gap-0 ${className}`}>
        {/* полные */}
        {Array.from({ length: full }).map((_, i) => (
            <Star
            key={`f${i}`}
            size={size}
            className={colorClass}
            fill="currentColor"
            stroke="none"
            />
        ))}

        {/* половинка */}
        {half === 1 && (
            <StarHalf
            key="half"
            size={size}
            className={colorClass}
            fill="currentColor"
            stroke="none"
            />
        )}

        {/* пустые */}
        {/* {Array.from({ length: empty }).map((_, i) => (
            <Star
            key={`e${i}`}
            size={size}
            className={`${colorClass} opacity-60`}
            fill="none"
            stroke="currentColor"
            />
        ))} */}
        </span>
        <span className="text-xs">({value} / {max})</span>
    </div>
  );
};

export default RatingStars;

// =========================
// Types
// =========================
type Props = {
  value: number;
  max?: number;
  size?: number;
  className?: string;
  colorClass?: string;
};