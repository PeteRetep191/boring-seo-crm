import React, { Key } from "react";
import MultiSelector from "../MultiSelector";
import { IMultiSelectorProps } from "../types";

// Ключи и тип элемента
export type DeviceKey = "mobile" | "tablet" | "desktop";

export interface DeviceOption {
  key: DeviceKey;
  label: string;
}

// Готовый список вариантов
const DEVICE_OPTIONS: DeviceOption[] = [
  { key: "mobile", label: "Mobile" },
  { key: "tablet", label: "Tablet" },
  { key: "desktop", label: "Desktop" },
];

// Пропсы для удобной обёртки (value/onChange и пр. оставляем)
export type DeviceTypeMultiSelectorProps = Omit<
  IMultiSelectorProps<DeviceOption, DeviceKey>,
  "options" | "getKey" | "getLabel"
> & {};

const DeviceTypeMultiSelector: React.FC<DeviceTypeMultiSelectorProps> = (
  props,
) => {
  return (
    <MultiSelector<DeviceOption, DeviceKey>
      options={DEVICE_OPTIONS}
      getKey={(o) => o.key}
      getLabel={(o) => o.label}
      renderItem={(o) => <span>{o.label}</span>}
      autocompleteProps={{
        label: "Devices types",
        labelPlacement: "outside",
        placeholder: "Select device type",
        "aria-label": "Выберите тип устройства",
      }}
      {...props}
    />
  );
};

export default DeviceTypeMultiSelector;
