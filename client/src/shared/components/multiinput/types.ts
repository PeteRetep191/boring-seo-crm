// Types
import { Key } from "react";
import { InputProps } from "@heroui/react";

export interface IMultiInputSelectorState<K extends Key> {
  inputValue: string;
  selectedValues: K[];
}

export interface IMultiInputSelectorProps<K extends Key> {
  value?: K[];
  onChange?: (selectedValues: K[]) => void;
  className?: string;
  inputProps?: Omit<InputProps, "value">;
}
