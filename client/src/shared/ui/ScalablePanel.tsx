import React from "react";
import { useImmer } from "use-immer";
// components
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
// icons
import { ChevronLeft, ChevronRight } from "lucide-react";
// libs
import { pickFirstChildOfType } from "@/shared/lib/react";

const INITIAL_STATE = {
    isExpanded: true,
};

const ScalablePanel: React.FC<ScalablePanelProps> = ({ children, maxWidth, title="Showcases Panel" }) => {

    const [ state, update ] = useImmer<ScalablePanelState>(INITIAL_STATE);

    const headerEl = pickFirstChildOfType(children, ScalablePanelHeader);
    const bodyEl = pickFirstChildOfType(children, ScalablePanelBody);
    const footerEl = pickFirstChildOfType(children, ScalablePanelFooter);

    const maxW = typeof maxWidth === "number" ? `${maxWidth}px` : (maxWidth ?? "650px");
    const minW = "300px";          // можно вынести в проп, если нужно
    const collapsedW = "50px";     // ширина в свернутом виде

    // -------------------------
    // Actions
    // -------------------------
    const toggleExpand = () => {
        update((draft) => {
            draft.isExpanded = !draft.isExpanded;
        });
    }

    return (
        <div className="flex relative">
            <Card
                shadow="none"
                radius="none"
                style={{ ["--maxW" as any]: maxW, ["--minW" as any]: minW }}
                className={`${
                    state.isExpanded
                        ? "w-[clamp(var(--minW),min(35vw,var(--maxW)),var(--maxW))]"
                        : `w-[${collapsedW}]`
                } transition-all duration-300`}
            >
                {state.isExpanded && (
                    <CardHeader className="pt-1 min-h-7">
                        {headerEl}
                    </CardHeader>
                )}
                <CardBody className="p-0">
                    {state.isExpanded ? (
                        <div className="p-2 h-full">
                            {bodyEl}
                        </div>
                    ) : (
                        <div className="flex justify-center items-center h-full p-2">
                            <div className="inline-block rotate-90 whitespace-nowrap origin-center">
                                {title}
                            </div>
                        </div>
                    )}
                </CardBody>
                {state.isExpanded && (
                    <CardFooter>
                        {footerEl}
                    </CardFooter>
                )}
            </Card>
            <Button 
                isIconOnly
                size="sm" 
                color="primary"
                onPress={toggleExpand}
                className="absolute top-0 -left-8 z-5 bg-black/30 rounded-none hover:bg-black/90"
            >
                {state.isExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </Button>
        </div>
    );
}

export default ScalablePanel;

// ==========================
// Markers
// ==========================
export const ScalablePanelHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`${className}`}>{children}</div>;
export const ScalablePanelBody: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`${className}`}>{children}</div>;
export const ScalablePanelFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`${className}`}>{children}</div>;

// ==========================
// Types
// ==========================
export type ScalablePanelProps = {
    children: React.ReactNode;
    headerChildren?: React.ReactNode;
    footerChildren?: React.ReactNode;
    title?: string;
    maxWidth?: string;
};

export type ScalablePanelState = {
    isExpanded: boolean;
}