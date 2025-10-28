import React from "react";
import { useImmer } from "use-immer";
// components
import { Card, CardHeader, CardBody, CardFooter, Button } from "@heroui/react";
// icons
import { ChevronLeft, ChevronRight } from "lucide-react";
// libs
import { pickFirstChildOfType } from "@/shared/lib/react";

const INITIAL_STATE = {
    isExpanded: false,
};

const ScalablePanel: React.FC<ScalablePanelProps> = ({ children, maxWidth, title="Showcases Panel" }) => {

    const [ state, update ] = useImmer<ScalablePanelState>(INITIAL_STATE);

    const headerEl = pickFirstChildOfType(children, ScalablePanelHeader);
    const bodyEl = pickFirstChildOfType(children, ScalablePanelBody);
    const footerEl = pickFirstChildOfType(children, ScalablePanelFooter);

    const minW = 350;
    const maxW = typeof maxWidth === 'number' ? maxWidth : 650;
    const collapsedW = 50;
    const preferred = `min(35vw, ${maxW}px)`;
    const expanded = `clamp(${minW}px, ${preferred}, ${maxW}px)`;

    // -------------------------
    // Actions
    // -------------------------
    const toggleExpand = () => {
        update((draft) => {
            draft.isExpanded = !draft.isExpanded;
        });
    }

    return (
        <Card
            shadow="sm"
            radius="sm"
            className="h-full flex flex-col"
            style={{
                width: state.isExpanded ? expanded : `${collapsedW}px`,
                transition: 'width 0.3s ease-in-out',
            }}
        >
            <CardHeader className="p-0 pt-1 px-1 min-h-7">
                {state.isExpanded ? (
                    <>
                        <TriggerButton onPress={toggleExpand} isExpanded={state.isExpanded} />
                        {headerEl}
                    </>
                ) : (
                    <TriggerButton onPress={toggleExpand} isExpanded={state.isExpanded} />
                )}
            </CardHeader>
            <CardBody className="p-0">
                <div
                    className={`p-2 h-full ${state.isExpanded ? 'block' : 'hidden'}`}
                    aria-hidden={!state.isExpanded}
                >
                    {bodyEl}
                </div>
                <div
                    className={`justify-center items-center h-full p-2 ${state.isExpanded ? 'hidden' : 'flex'}`}
                    aria-hidden={state.isExpanded}
                >
                    <div className="inline-block rotate-90 whitespace-nowrap origin-center">
                        {title}
                    </div>
                </div>
            </CardBody>
            {state.isExpanded && (
                <CardFooter>
                    {footerEl}
                </CardFooter>
            )}
        </Card>
    );
}

export default ScalablePanel;

// ==========================
// Markers
// ==========================
export const ScalablePanelHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`flex-1 ${className}`}>{children}</div>;
export const ScalablePanelBody: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`flex-1 ${className}`}>{children}</div>;
export const ScalablePanelFooter: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className={`flex-1 ${className}`}>{children}</div>;

// ==========================
// Elements
// ==========================
const TriggerButton: React.FC<{ onPress: () => void, isExpanded: boolean }> = ({ onPress, isExpanded }) => {
    return (
        <Button 
            isIconOnly
            size="sm" 
            variant="flat"
            color="primary"
            onPress={onPress}
            className={`${!isExpanded && 'flex-1'}`}
        >
            {isExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
    )
}

// ==========================
// Types
// ==========================
export type ScalablePanelProps = {
    children: React.ReactNode;
    headerChildren?: React.ReactNode;
    footerChildren?: React.ReactNode;
    title?: string;
    maxWidth?: number;
};

export type ScalablePanelState = {
    isExpanded: boolean;
}