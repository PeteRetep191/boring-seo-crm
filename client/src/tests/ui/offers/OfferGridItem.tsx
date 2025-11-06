import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Checkbox,
  Tooltip,
} from "@heroui/react";
import { RatingStars } from "@/shared/ui";
import { Check, FileEdit, Trash, Trash2, Unplug } from "lucide-react";

export type Offer = {
  id: string;
  title: string;
  priceUSD: number;
  rating: number;
  image?: string;
};

type Props = {
  item: Offer;
  className?: string;
};

export const OfferGridItem: React.FC<Props> = ({ item, className }) => {
  const img = item.image ?? "https://placehold.co/400x400?text=Hello+World";

  return (
    <Card
      shadow="sm"
      radius="sm"
      className={`min-w-[200px] h-[200px] ${className ?? ""}`}
    >
      <CardHeader className="h-[50%] p-0 overflow-hidden">
        <img
          src={img}
          alt={item.title}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </CardHeader>
      <CardBody className="p-2">
        <div className="flex flex-col">
          <div className="line-clamp-1 text-sm font-medium">{item.title}</div>
          <div className="mt-auto flex items-center justify-between">
            <RatingStars
              value={item.rating}
              size={14}
              colorClass="text-yellow-400"
            />
            <div className="text-sm font-semibold">
              ${item.priceUSD.toFixed(2)}
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className=" flex items-center justify-between p-2 pt-0">
        <Checkbox checked={false} />
        <div className="flex items-center justify-end gap-2">
          {/* <Button
            isIconOnly
            size="sm"
            variant="flat"
            color="primary"
          >
            <FileEdit size={16} />
          </Button> */}

          <Tooltip content="Unassign Offer" placement="top">
            <Button isIconOnly size="sm" variant="flat" color="danger">
              <Unplug size={16} />
            </Button>
          </Tooltip>
        </div>
      </CardFooter>
    </Card>
  );
};
