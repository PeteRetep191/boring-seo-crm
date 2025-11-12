// Types
import { Key } from "react";
import { AutocompleteProps } from "@heroui/react";

export interface IMultiSelectorProps<T extends object, K extends Key> {
  options?: T[];
  value?: K[];

  getKey: (option: T) => K;
  getLabel: (option: T) => string;

  renderItem?: (option: T) => React.ReactNode;
  onChange?: (keys: K[], options: T[]) => void;

  className?: string;
  autocompleteProps?: Pick<
    AutocompleteProps<T>,
    | "aria-label"
    | "label"
    | "labelPlacement"
    | "placeholder"
    | "isLoading"
    | "isDisabled"
  >;
}

export interface IMultiSelectorState<T extends object, K extends Key> {
  selectedKeys: K[];
  selectedOptions: T[];
}
