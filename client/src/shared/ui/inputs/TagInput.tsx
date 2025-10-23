import * as React from "react";
import {Chip, Input} from "@heroui/react";

const defaultSeparators = ["Enter", "Tab", ","];

function useDidUpdateEffect(fn: () => void, deps: React.DependencyList) {
  const did = React.useRef(false);
  React.useEffect(() => {
    if (did.current) fn();
    else did.current = true;
  }, deps);
}

export interface TagsInputProps {
  name?: string;
  placeHolder?: string;
  value?: string[] | null;
  onChange?: (tags: string[]) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  separators?: string[];
  disableBackspaceRemove?: boolean;
  onExisting?: (tag: string) => void;
  onRemoved?: (tag: string) => void;
  disabled?: boolean;
  isEditOnRemove?: boolean;
  beforeAddValidate?: (tag: string, existingTags: string[]) => boolean;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  classNames?: {
    root?: string;
    input?: string;
    chip?: string;
  };
  maxTagsCount?: number;
}

export function TagsInput({
  name,
  placeHolder = "Add tag and press Enter",
  value,
  onChange,
  onBlur,
  separators = defaultSeparators,
  disableBackspaceRemove,
  onExisting,
  onRemoved,
  disabled,
  isEditOnRemove,
  beforeAddValidate,
  onKeyUp,
  classNames,
  maxTagsCount,
}: TagsInputProps) {
  const [tags, setTags] = React.useState<string[]>(value ?? []);
  const [inputValue, setInputValue] = React.useState("");

  useDidUpdateEffect(() => {
    onChange?.(tags);
  }, [tags]);

  useDidUpdateEffect(() => {
    const next = value ?? [];
    if (JSON.stringify(next) !== JSON.stringify(tags)) {
      setTags(next);
    }
  }, [value]);

  const placeholderText =
    maxTagsCount !== undefined && tags.length >= maxTagsCount ? "" : placeHolder;

  const tryAdd = (raw: string) => {
    const text = raw.trim();
    if (!text) return;
    if (beforeAddValidate && !beforeAddValidate(text, tags)) return;
    if (tags.includes(text)) {
      onExisting?.(text);
      return;
    }
    setTags(prev => [...prev, text]);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (disabled) return;

    // backspace-remove
    if (!inputValue && !disableBackspaceRemove && tags.length && e.key === "Backspace") {
      e.preventDefault();
      const last = tags[tags.length - 1];           // ← без .at()
      setTags(prev => prev.slice(0, -1));
      if (isEditOnRemove) {
        setInputValue(`${last} `);                  // вернуть текст сразу в инпут
      }
      return;
    }

    // достигли лимита — блокируем набор, кроме backspace
    if (maxTagsCount !== undefined && tags.length >= maxTagsCount && e.key !== "Backspace") {
      e.preventDefault();
      return;
    }

    // разделители
    if (separators.includes(e.key)) {
      e.preventDefault();
      tryAdd(inputValue);
      setInputValue("");
    }
  };

  const removeTag = (t: string) => {
    setTags(prev => prev.filter(x => x !== t));
    onRemoved?.(t);
  };

  return (
    <div
      className={[
        "flex flex-wrap items-center gap-2 rounded-lg bg-default-100 p-2",
        classNames?.root ?? ""
      ].join(" ")}
      onClick={(e) => {
        const target = e.currentTarget.querySelector("input") as HTMLInputElement | null;
        target?.focus();
      }}
    >
      {tags.map((t) => (
        <Chip
          key={t}
          size="sm"
          variant="flat"
          color="primary"
          radius="sm"
          className={classNames?.chip}
          onClose={() => !disabled && removeTag(t)}
        >
          {t}
        </Chip>
      ))}

      <Input
        name={name}
        aria-label={name ?? "tags-input"}
        placeholder={placeholderText}
        size="sm"
        variant="bordered"
        radius="sm"
        isDisabled={!!disabled}
        onBlur={onBlur}
        onKeyUp={onKeyUp}
        onKeyDown={handleKeyDown}
        value={inputValue}
        onValueChange={setInputValue}
        classNames={{
          base: "min-w-[140px] w-auto flex-1 !bg-transparent",
          inputWrapper:
            "!bg-transparent shadow-none h-8 min-h-8 px-0 py-0 !border-0 " +
            "data-[hover=true]:!bg-transparent data-[focus=true]:!bg-transparent",
          input: "!text-small !leading-none placeholder:text-foreground-500 " + (classNames?.input ?? ""),
        }}
      />
    </div>
  );
}

export default TagsInput;