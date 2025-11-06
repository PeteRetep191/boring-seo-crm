import React, { useState } from "react";
// Components
import {
  Accordion,
  AccordionItem,
  Button,
  Switch,
  Tooltip,
  Chip,
} from "@heroui/react";

import { RatingStars, TruncatedList } from "@/shared/ui";

import { FlagImg } from "@/shared/ui";
import { DraggableList } from "@/tests/ui/DraggableList";
// Icons
import { ChevronLeft, Cog, Edit, Trash2 } from "lucide-react";

const INITIAL_ITEMS = [
  {
    id: "1",
    label: "US Exclusive Offer",
    flags: ["US", "CA", "MX"],
    bonus: "$50",
    raiting: 4.5,
    status: "active",
  },
  {
    id: "2",
    label: "North America Special",
    flags: ["CA", "MX"],
    bonus: "$30",
    raiting: 4.0,
    status: "inactive",
  },
  {
    id: "3",
    label: "UK Premium Deal",
    flags: ["GB"],
    bonus: "$40",
    raiting: 4.2,
    status: "active",
  },
  {
    id: "4",
    label: "European Bundle",
    flags: ["FR", "ES", "IT"],
    bonus: "$20",
    raiting: 3.8,
    status: "inactive",
  },
  {
    id: "5",
    label: "German Discount",
    flags: ["DE"],
    bonus: "$60",
    raiting: 4.9,
    status: "active",
  },
];

type IFilter = {
  country: string[];
  refferers: string[];
  ips: string[];
  devices: string[];
};

const MOCK_SHOWCASES = [
  {
    id: "showcase-1",
    name: "Summer Deals",
    filters: {
      country: ["US", "CA", "MX", "GB"],
      refferers: [],
      ips: ["192.168.1.1", "192.168.1.2"],
      devices: [],
    },
    isActive: true,
    items: INITIAL_ITEMS.slice(0, 3),
  },
  {
    id: "showcase-2",
    name: "Winter Specials",
    filters: {
      country: ["US", "CA"],
      refferers: ["google.com", "facebook.com"],
      ips: ["192.168.1.1", "192.168.1.2"],
      devices: ["desktop", "mobile"],
    },
    isActive: false,
    items: INITIAL_ITEMS.slice(1, 4),
  },
  {
    id: "showcase-3",
    name: "Holiday Offers",
    isActive: true,
    filters: {
      country: ["GB", "DE", "FR", "IT", "ES", "NL"],
      refferers: ["twitter.com", "linkedin.com"],
      ips: [],
      devices: ["desktop", "mobile"],
    },
    items: INITIAL_ITEMS.slice(2, 5),
  },
  {
    id: "showcase-4",
    name: "Exclusive Discounts",
    isActive: false,
    filters: {
      country: [],
      refferers: [],
      ips: [],
      devices: ["desktop"],
    },
    items: INITIAL_ITEMS.slice(0, 2),
  },
];
// ==========================
// ShowcaseItem
// ==========================
const ShowcaseItem = () => {
  const [items, setItems] = useState(INITIAL_ITEMS);

  return (
    <Accordion variant="light" fullWidth className="p-0">
      {MOCK_SHOWCASES.map((showcase) => (
        <AccordionItem
          key={showcase.id}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start gap-2">
                  <Tooltip
                    content="Toggle showcase active state"
                    placement="top"
                    delay={100}
                    closeDelay={50}
                  >
                    <Switch
                      size="sm"
                      isSelected={showcase.isActive}
                      onChange={() => {}}
                      classNames={{
                        wrapper: "border border-white/10 w-10.5",
                      }}
                    />
                  </Tooltip>
                  <span className="font-medium">{showcase.name}</span>
                </div>
                <div className="flex gap-2">
                  <Tooltip content="Edit showcase">
                    <Button
                      radius="sm"
                      size="sm"
                      variant="flat"
                      color="default"
                      isIconOnly
                      className="min-h-0 min-w-0 h-7 w-7"
                    >
                      <Edit size={16} />
                    </Button>
                  </Tooltip>

                  <Tooltip content="Edit showcase">
                    <Button
                      radius="sm"
                      size="sm"
                      variant="flat"
                      color="danger"
                      isIconOnly
                      className="min-h-0 min-w-0 h-7 w-7"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </Tooltip>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 px-1">
                {showcase.filters.country.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Countries:</span>
                    <TruncatedList
                      items={showcase.filters.country}
                      renderItem={(flag) => <FlagImg flag={flag} key={flag} />}
                      max={5}
                      emptyContent={<span>No countries</span>}
                    />
                  </div>
                )}
                {showcase.filters.refferers.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Referrers:</span>
                    <TruncatedList
                      items={showcase.filters.refferers}
                      renderItem={(referrer) => (
                        <span key={referrer}>{referrer}</span>
                      )}
                      max={5}
                      emptyContent={<span>No referrers</span>}
                    />
                  </div>
                )}
                {showcase.filters.devices.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Devices:</span>
                    <TruncatedList
                      items={showcase.filters.devices}
                      renderItem={(device) => (
                        <span key={device}>{device}</span>
                      )}
                      max={5}
                      emptyContent={<span>No devices</span>}
                    />
                  </div>
                )}
                {showcase.filters.ips.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">IPs:</span>
                    <TruncatedList
                      items={showcase.filters.ips}
                      renderItem={(ip) => <span key={ip}>{ip}</span>}
                      max={5}
                      emptyContent={<span>No IPs</span>}
                    />
                  </div>
                )}
              </div>
            </div>
          }
        >
          <DraggableList<{
            id: string;
            label: string;
            flags: string[];
            bonus: string;
            raiting: number;
            status: string;
          }>
            items={showcase.items}
            renderItem={(i) => (
              <div
                className={`flex flex-1 items-center justify-between ${i.status === "disabled" ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div className="flex items-center justify-start gap-2">
                  <img
                    src="https://placehold.co/400x400?text=Hello+World"
                    className="h-12 w-12 object-cover"
                  />
                  <div className="flex flex-col gap-1 h-full">
                    <div className="flex justify-between gap-2">
                      <div className="text-[14px] truncate">{i.label}</div>
                      <RatingStars value={i.raiting} />
                    </div>
                    <div className="flex space-x-1">
                      <TruncatedList
                        items={i.flags}
                        renderItem={(flag) => (
                          <FlagImg flag={flag} key={flag} />
                        )}
                        max={6}
                        emptyContent={<span>No countries</span>}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Chip
                    size="sm"
                    radius="sm"
                    variant="flat"
                    color={i.status === "active" ? "success" : "default"}
                    className={`min-h-5 h-5 ${i.status === "disabled" ? "bg-gray-500 text-gray-200" : ""}`}
                  >
                    {i.status}
                  </Chip>
                  <span className="text-[14px] text-gray-500">{`Bonus: ${i.bonus}`}</span>
                </div>
              </div>
            )}
            onChange={setItems}
          />
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ShowcaseItem;
