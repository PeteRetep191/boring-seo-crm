// ===============================
//  Props
// ===============================
export interface TriggerButtonProps {
  onPress: () => void;
  isExpanded: boolean;
}

export interface ScalablePanelProps {
  children: React.ReactNode;
  maxWidth?: number;
  isExpanded?: boolean;
  onExpandedChange?: (isExpanded: boolean) => void;
  title?: string;
}

// ===============================
// Types
// ===============================
export type ScalablePanelState = {
  isExpanded: boolean;
  widths: {
    min: number;
    max: number;
    collapsed: number;
  };
  title: string;
};
