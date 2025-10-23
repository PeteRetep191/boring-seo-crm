import React, { useState } from "react";
import { useParams } from "react-router-dom";
// components
import { Button, Input, Textarea, Chip } from "@heroui/react";
import { RatingStars, ScalablePanel, ScalablePanelHeader, ScalablePanelFooter, ScalablePanelBody, TruncatedList } from "@/shared/ui";
import { TagInput } from "@/shared/ui/inputs";
import { FlagImg } from '@/shared/ui'
import { DraggableList, DraggableListHeader } from "@/tests/ui/DraggableList";
import { AutoGrid } from "@/features/components/auto-grid-columns/ui";
// icons
import { Save, Plus, ArrowDownUp } from "lucide-react";
import { useSiteForm } from "@/features/site/hooks";
// utils
import { getTodayString } from "@/shared/lib/date";

import type { Offer } from "@/tests/ui/offers/OfferGridItem";
import { OfferGridItem } from "@/tests/ui/offers/OfferGridItem";
import { ShowcaseItem } from "@/tests/ui/showcase";


// =========================
// Mock Data
// =========================
const INITIAL_ITEMS = [
    { id: "1", label: "US Exclusive Offer", flags: ['US', 'CA', 'MX','CA', 'MX'], bonus: "$50", raiting: 4.5, status: 'active' },
    { id: "2", label: "North America Special", flags: [], bonus: "$30", raiting: 4.0, status: 'disabled' },
    { id: "3", label: "UK Premium Deal", flags: ['GB','CA', 'MX','CA', 'MX','CA', 'MX'], bonus: "$40", raiting: 4.2, status: 'active' },
    { id: "4", label: "European Bundle", flags: ['FR', 'ES', 'IT'], bonus: "$20", raiting: 3.8, status: 'disabled' },
    { id: "5", label: "German Discount", flags: ['DE','CA', 'MX','CA', 'MX','CA', 'MX','CA', 'MX','CA', 'MX'], bonus: "$60", raiting: 4.9, status: 'active' },
];

export const offersData: Offer[] = [
    { id: "1", title: "Crypto Wallet Promo", priceUSD: 25, rating: 4.7, image: "https://placehold.co/400x400?text=Offer+1" },
    { id: "2", title: "VPN Annual Plan", priceUSD: 18, rating: 4.2, image: "https://placehold.co/400x400?text=Offer+2" },
    { id: "3", title: "Food Delivery", priceUSD: 12, rating: 3.5, image: "https://placehold.co/400x400?text=Offer+3" },
    { id: "4", title: "Fitness App Trial", priceUSD: 9, rating: 4.0, image: "https://placehold.co/400x400?text=Offer+4" },
    { id: "5", title: "Travel Cashback", priceUSD: 30, rating: 4.9, image: "https://placehold.co/400x400?text=Offer+5" },
    { id: "6", title: "Streaming Bundle", priceUSD: 22, rating: 3.8, image: "https://placehold.co/400x400?text=Offer+6" },
    { id: "7", title: "E-Learning Course", priceUSD: 15, rating: 4.5, image: "https://placehold.co/400x400?text=Offer+7" },
    { id: "8", title: "Cloud Storage", priceUSD: 11, rating: 3.2, image: "https://placehold.co/400x400?text=Offer+8" },
];

const SiteManagementPage: React.FC = () => {
    const { siteId } = useParams();

    const siteForm = useSiteForm();

    const [items, setItems] = useState(INITIAL_ITEMS);

    return (
        <div className="flex flex-col gap-2 min-h-0 h-full">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">
                    {siteId ? `Edit Site ${siteId}` : "Create New Site"}
                </h2>
                <div className="flex items-center gap-4">
                    <span className="text-[14px]" >Last Modified: {siteId ? <strong>{siteForm.state.formData.name}</strong> : getTodayString(true)}</span>
                    <Button
                        radius="sm"
                        size='md'
                        variant="solid"
                        color="primary"
                        endContent={<Save size={18} />}
                    >
                        Save
                    </Button>
                </div>
            </div>
            <div className="flex h-full gap-10 min-h-0">
                <div className="flex flex-col gap-4 flex-3 basis-0 min-h-0 overflow-y-auto scrollbar-hide">
                    <div className="flex flex-row gap-2">
                        <Input
                            radius="sm"
                            label="Site Name"
                            placeholder="Enter site name"
                            value={siteForm.state.formData.name}
                            onChange={(e) => siteForm.actions.update(draft => { draft.formData.name = e.target.value; })}
                            className="flex-2"
                        />
                        <Input
                            radius="sm"
                            label="Website URL"
                            placeholder="Enter website URL"
                            value={siteForm.state.formData.url}
                            onChange={(e) => siteForm.actions.update(draft => { draft.formData.url = e.target.value; })}
                            className="flex-5"
                            classNames={{ input: "bg-gray-500" }}
                        />
                    </div>

                    <Textarea
                        radius="sm"
                        label="Description"
                        placeholder="Enter description"
                        value={siteForm.state.formData.description}
                        onChange={(e) => siteForm.actions.update(draft => { draft.formData.description = e.target.value; })}
                        className="flex-5"
                    />

                    <TagInput
                        value={[]}
                    />

                    <DraggableList<{ id: string; label: string, flags: string[], bonus: string, raiting: number, status: string }>
                        items={INITIAL_ITEMS}
                        renderItem={(i) => (
                            <div className={`flex flex-1 items-center justify-between ${i.status === 'disabled' ? 'opacity-50 pointer-events-none' : ''}`}>
                                <div className="flex items-center justify-start gap-2">
                                    <img src="https://placehold.co/400x400?text=Hello+World" className="h-12 w-12 object-cover" />
                                    <div className="flex flex-col gap-1 h-full">
                                        <div className="flex justify-between gap-2">
                                            <div className="text-[14px] truncate">{i.label}</div>
                                            <RatingStars value={i.raiting} />
                                        </div>
                                        <div className="flex space-x-1">
                                            <TruncatedList
                                                items={i.flags}
                                                renderItem={(flag) => <FlagImg flag={flag} key={flag} />}
                                                max={6}
                                                emptyContent={<span>No countries</span>}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <Chip size="sm" radius="sm" variant="flat" color={i.status === 'active' ? 'success' : 'default'} className={`min-h-5 h-5 ${i.status === 'disabled' ? 'bg-gray-500 text-gray-200' : ''}`}>{i.status}</Chip>
                                    <span className="text-[14px] text-gray-500">{`Bonus: ${i.bonus}`}</span>
                                </div>
                            </div>
                        )}
                        onChange={setItems}
                    >
                        <DraggableListHeader>
                            <div className="flex items-center justify-between gap-2">
                                <span className="font-medium">Default showcase</span>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    color="primary"
                                    startContent={<Plus size={16} />}
                                    className="ml-4"
                                >
                                    Add assigned offers
                                </Button>
                            </div>
                        </DraggableListHeader>
                    </DraggableList>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col items-stretch justify-between gap-2">
                            <span className="font-medium">Asigned Offers</span>
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex flex-1 items-center gap-2">
                                    <Input
                                        radius="sm"
                                        size="sm"
                                        placeholder="Search offers by name..."
                                        className="flex-1 max-w-[50%]"
                                    />
                                    {/* <Tooltip content="Sort Offers" placement="top">
                                        <Dropdown>
                                            <DropdownTrigger>
                                                    <Button isIconOnly color="primary" variant="flat" size="sm">
                                                        <ArrowDownUp size={16} />
                                                    </Button>
                                            </DropdownTrigger>
                                            <DropdownMenu aria-label="Static Actions">
                                                <DropdownItem key="new">Active F</DropdownItem>
                                                <DropdownItem key="copy">Copy link</DropdownItem>
                                                <DropdownItem key="edit">Edit file</DropdownItem>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </Tooltip> */}
                                </div>
                                <Button
                                    size="sm"
                                    variant="solid"
                                    color="primary"
                                    startContent={<Plus size={16} />}
                                    className="ml-4"
                                >
                                    Assign Offers
                                </Button>
                            </div>
                        </div>
                        <AutoGrid
                            itemMinWidth={200} // желаемая ширина карточки (под твой OfferGridItem)
                            gapPx={12}         // соответствует gap-3
                            maxCols={6}        // ограничим по количеству колонок (по вкусу)
                            className="w-full"
                        >
                            {offersData.map((item) => (
                                <OfferGridItem key={item.id} item={item} />
                            ))}
                        </AutoGrid>
                    </div>

                    {/* <OffersGrid
                        items={offersData}
                        onAssign={() => {
                            console.log("Assign Offer clicked");
                        }}
                    /> */}
                </div>
                <div className="flex ">
                    <ScalablePanel>
                        <ScalablePanelHeader className="flex flex-1 items-center justify-between gap-4 pt-2">
                            <h3 className="text-md font-medium truncate">Showcases Panel</h3>
                            <Button
                                variant="solid"
                                color="primary"
                                size="sm"
                                startContent={<Plus size={16} />}
                            >
                                Create New Showcase
                            </Button>
                        </ScalablePanelHeader>
                        <ScalablePanelBody>
                            <ShowcaseItem />
                        </ScalablePanelBody>
                        <ScalablePanelFooter className="flex items-center justify-end gap-2">
                            <span className="text-[14px] text-foreground-500">Total Showcases: 1</span>
                        </ScalablePanelFooter>
                    </ScalablePanel>
                    
                </div>
            </div>
        </div>
    );
}


export default SiteManagementPage;