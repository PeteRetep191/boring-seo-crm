// Hooks
import { useImmer } from "use-immer";
import { useEffect, useMemo } from "react";
// UI
import { Chip, Button, Input } from "@heroui/react";
// Types
import { Key } from "react";
import { IMultiInputSelectorState, IMultiInputSelectorProps } from "./types";
import { Draft } from "immer";

const createInitialState = <K extends Key>(
  value?: K[],
): IMultiInputSelectorState<K> => ({
  inputValue: "",
  selectedValues: value || [],
});

const MultiSelector = <K extends Key>({
  value,
  onChange,
  className,
  inputProps,
}: IMultiInputSelectorProps<K>) => {
  const [state, updateState] = useImmer<IMultiInputSelectorState<K>>(
    createInitialState<K>(value),
  );

  // -----------------------
  // Handlers
  // -----------------------
  const handleAddValue = (raw: string) => {
    const next = (raw ?? "").trim();
    if (!next) return;

    updateState((draft) => {
      // avoid duplicates
      if (!draft.selectedValues.includes(next as Draft<K>)) {
        draft.selectedValues.push(next as Draft<K>);
        draft.inputValue = "";
      }
    });
  };

  const handleRemoveSelection = (key: K) => {
    if (!key) return;

    updateState((draft) => {
      draft.selectedValues = draft.selectedValues.filter((k) => k !== key);
    });
  };

  const handleClearSelection = () => {
    updateState((draft) => {
      draft.selectedValues = [];
    });
  };

  // -----------------------
  // Helpers
  // -----------------------
  const selectedValuesSet = useMemo(
    () => new Set<K>(state.selectedValues),
    [state.selectedValues],
  );
  const selectedItems = useMemo(
    () => Array.from(selectedValuesSet),
    [selectedValuesSet],
  );

  // -----------------------
  // Effects
  // -----------------------
  useEffect(() => {
    onChange?.(state.selectedValues);
  }, [state.selectedValues]);

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <Input
        radius="sm"
        {...inputProps}
        value={state.inputValue}
        onChange={(e) => {
          updateState((draft) => {
            draft.inputValue = e.target.value;
          });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            const value = (e.target as HTMLInputElement).value;
            handleAddValue(value);
          }
        }}
      />

      <div className="flex flex-wrap gap-1 items-start justify-start">
        {selectedItems.map((item) => (
          <Chip
            size="sm"
            radius="sm"
            color="primary"
            variant="flat"
            key={item}
            onClose={() => handleRemoveSelection(item)}
          >
            {String(item)}
          </Chip>
        ))}

        {selectedItems.length > 0 && (
          <Button
            size="sm"
            radius="sm"
            variant="light"
            color="danger"
            onPress={handleClearSelection}
            className="min-h-0 h-6 min-w-0 w-12"
          >
            Clear
          </Button>
        )}
      </div>
    </div>
  );
};

export default MultiSelector;
