import React, { useEffect } from "react";
import { useImmer } from "use-immer";
// UI
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { TriggerButton } from "./";
// Libs
import { pickFirstChildOfType } from "@/shared/lib/react";
// Types
import { ScalablePanelProps, ScalablePanelState } from "../types";

const INITIAL_STATE: ScalablePanelState = {
  isExpanded: false,
  widths: {
    min: 350,
    max: 650,
    collapsed: 50,
  },
  title: "Showcases Panel",
};

const ScalablePanel: React.FC<ScalablePanelProps> = ({
  children,
  maxWidth = 650,
  isExpanded,
  onExpandedChange,
  title,
}) => {
  const [state, update] = useImmer<ScalablePanelState>({
    ...INITIAL_STATE,
    isExpanded: isExpanded || false,
    widths: {
      ...INITIAL_STATE.widths,
      max: maxWidth,
    },
  });

  // --------------------------
  // Markers
  // --------------------------
  const headerEl = pickFirstChildOfType(children, ScalablePanelHeader);
  const bodyEl = pickFirstChildOfType(children, ScalablePanelBody);
  const footerEl = pickFirstChildOfType(children, ScalablePanelFooter);

  // ---------------------------
  // Styles
  // ---------------------------
  const preferred = `min(35vw, ${state.widths.max}px)`;
  const expanded = `clamp(${state.widths.min}px, ${preferred}, ${maxWidth}px)`;

  // -------------------------
  // Actions
  // -------------------------
  const toggleExpand = () => {
    update((draft) => {
      const newExandedState = !draft.isExpanded;

      if (onExpandedChange) {
        onExpandedChange(newExandedState);
      } else {
        draft.isExpanded = newExandedState;
      }
    });
  };

  // -------------------------
  // Effects
  // -------------------------
  useEffect(() => {
    if (isExpanded) {
      update((draft) => {
        draft.isExpanded = isExpanded;
      });
    }
  }, [isExpanded]);

  // -------------------------
  // Render
  // -------------------------
  return (
    <Card
      shadow="sm"
      radius="sm"
      className="h-full flex flex-col"
      style={{
        width: state.isExpanded ? expanded : `${state.widths.collapsed}px`,
        transition: "width 0.3s ease-in-out",
      }}
    >
      <CardHeader className="p-0 pt-1 px-1 min-h-7">
        {state.isExpanded ? (
          <>
            <TriggerButton
              onPress={toggleExpand}
              isExpanded={state.isExpanded}
            />
            {headerEl}
          </>
        ) : (
          <TriggerButton onPress={toggleExpand} isExpanded={state.isExpanded} />
        )}
      </CardHeader>
      <CardBody className="p-0">
        <div
          className={`p-2 h-full ${state.isExpanded ? "block" : "hidden"}`}
          aria-hidden={!state.isExpanded}
        >
          {bodyEl}
        </div>
        <div
          className={`justify-center items-center h-full p-2 ${state.isExpanded ? "hidden" : "flex"}`}
          aria-hidden={state.isExpanded}
        >
          <div className="inline-block rotate-90 whitespace-nowrap origin-center">
            {title}
          </div>
        </div>
      </CardBody>
      {state.isExpanded && <CardFooter>{footerEl}</CardFooter>}
    </Card>
  );
};

export default ScalablePanel;

// ==========================
// Markers
// ==========================
export const ScalablePanelHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`flex-1 ${className}`}>{children}</div>
);
export const ScalablePanelBody: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`flex-1 ${className}`}>{children}</div>
);
export const ScalablePanelFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={`flex-1 ${className}`}>{children}</div>
);
