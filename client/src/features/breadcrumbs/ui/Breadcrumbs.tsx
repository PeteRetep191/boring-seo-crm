import React from "react";
import { Breadcrumbs as HeroBreadcrumbs, BreadcrumbItem } from '@heroui/react';
// hooks
import { useBreadcrumbs } from "@/features/breadcrumbs/hooks";

const Breadcrumbs: React.FC = () => {
    const { state } = useBreadcrumbs();
    const { items, isReady } = state;

    if (!isReady) return null;

    return (
        <HeroBreadcrumbs>
            {items.map((c) => (
                <BreadcrumbItem key={c.href} href={c.href}>
                    {c.label}
                </BreadcrumbItem>
            ))}
        </HeroBreadcrumbs>
    );
}

export default Breadcrumbs;
