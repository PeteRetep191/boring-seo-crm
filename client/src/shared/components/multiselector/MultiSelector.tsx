// Hooks
import { useImmer } from "use-immer";
import { useEffect, useMemo } from "react";
// UI
import { Chip, Button } from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/react";
// Types
import { Key } from "react";
import { IMultiSelectorProps, IMultiSelectorState } from "./types";
import { Draft } from "immer";

const createInitialState = <T extends object, K extends Key>(
  value?: K[],
): IMultiSelectorState<T, K> => ({
  selectedKeys: value || [],
  selectedOptions: [],
});

const MultiSelector = <T extends object, K extends Key>({
  options = [] as T[],
  value,
  getKey,
  getLabel,
  renderItem,
  onChange,
  className,
  autocompleteProps,
}: IMultiSelectorProps<T, K>) => {
  const [state, updateState] = useImmer<IMultiSelectorState<T, K>>(
    createInitialState<T, K>(value),
  );

  // -----------------------
  // Handlers
  // -----------------------§
  const handleSelectionChange = (key: K) => {
    if (!key) return;

    updateState((draft) => {
      draft.selectedKeys.push(key as Draft<K>);
      draft.selectedOptions.push(
        options.find((option: T) => getKey(option) === key) as Draft<T>,
      );
    });
  };

  const handleRemoveSelection = (key: K) => {
    if (!key) return;

    updateState((draft) => {
      draft.selectedKeys = draft.selectedKeys.filter((k) => k !== key);
      draft.selectedOptions = draft.selectedOptions.filter(
        (option) => getKey(option as T) !== key,
      );
    });
  };

  const handleClearSelection = () => {
    updateState((draft) => {
      draft.selectedKeys = [];
      draft.selectedOptions = [];
    });
  };

  // -----------------------
  // Helpers
  // -----------------------
  const selectedKeysSet = useMemo(
    () => new Set<K>(state.selectedKeys),
    [state.selectedKeys],
  );
  const selectedItems = useMemo(
    () => options.filter((option) => selectedKeysSet.has(getKey(option))),
    [options, selectedKeysSet],
  );
  const availableOptions = useMemo<T[]>(
    () => options.filter((option) => !selectedKeysSet.has(getKey(option))),
    [options, selectedKeysSet],
  );

  // -----------------------
  // Effects
  // -----------------------
  useEffect(() => {
    onChange?.(state.selectedKeys, state.selectedOptions);
  }, [state.selectedKeys]);

  // -----------------------
  // Render
  // -----------------------
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Autocomplete
        radius="sm"
        allowsEmptyCollection
        allowsCustomValue
        defaultItems={availableOptions}
        selectedKey={null}
        onSelectionChange={(key) => handleSelectionChange(key as K)}
        {...autocompleteProps}
      >
        {(item: T) => (
          <AutocompleteItem key={getKey(item)} textValue={getLabel(item)}>
            {renderItem ? renderItem(item) : <span>getLabel(item)</span>}
          </AutocompleteItem>
        )}
      </Autocomplete>
      <div className="flex flex-wrap gap-1 items-start justify-start">
        {selectedItems.map((item) => (
          <Chip
            size="sm"
            radius="sm"
            color="primary"
            variant="flat"
            key={getKey(item)}
            onClose={() => handleRemoveSelection(getKey(item))}
          >
            {renderItem ? renderItem(item) : <span>getLabel(item)</span>}
          </Chip>
        ))}
        {selectedItems.length > 0 && (
          <Button
            size="sm"
            radius="sm"
            variant="light"
            color="danger"
            onPress={() => handleClearSelection()}
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
