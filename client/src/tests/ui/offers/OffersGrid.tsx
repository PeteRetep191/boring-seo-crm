
import React from "react";
import { Input, Button } from "@heroui/react";
import { Search, Plus } from "lucide-react";
import { OfferGridItem, Offer } from "./OfferGridItem";

type Props = {
  items: Offer[];
  onAssign?: () => void;
  className?: string;
};

export const OffersGrid: React.FC<Props> = ({ items, onAssign, className }) => {
  const [q, setQ] = React.useState("");

  const filtered = React.useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter((i) => i.title.toLowerCase().includes(s));
  }, [items, q]);

  return (
    <div className={className}>
      <div className="mb-4 flex flex-1 items-center gap-2">
        <Input
          value={q}
          onValueChange={setQ}
          placeholder="Search offers..."
          startContent={<Search size={16} />}
          className="max-w-sm"
        />
        <div className="ml-auto">
          <Button color="primary" startContent={<Plus size={16} />} onPress={onAssign}>
            Assign Offer
          </Button>
        </div>
      </div>

      {/* Грид через flex-wrap */}
      <div className="flex flex-wrap gap-3">
        {filtered.map((item) => (
          <OfferGridItem key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};