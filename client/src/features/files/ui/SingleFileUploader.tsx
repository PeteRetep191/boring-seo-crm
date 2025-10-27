import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody, Button, Tooltip } from "@heroui/react";
import { Image as ImageIcon, UploadCloud, X } from "lucide-react";

type SingleFileUploaderProps = {
  valueUrl?: string | null;
  onChange: (file: File | null) => void;
  accept?: string[];
  maxSizeMb?: number;
  description?: string;
  disabled?: boolean;
  className?: string;
  placeholderText?: string;
};

const DEFAULT_ACCEPT = ["image/*"];
const DEFAULT_MAX_MB = 10;

function buildAcceptAttribute(acceptList: string[]) {
  return acceptList.join(",");
}

function fileMatchesAccept(file: File, accepts: string[]) {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  if (accepts.some(a => a.toLowerCase() === "image/*") && type.startsWith("image/")) return true;
  if (accepts.some(a => a.toLowerCase() === type)) return true;
  const ext = name.includes(".") ? "." + name.split(".").pop() : "";
  if (ext && accepts.some(a => a.toLowerCase() === ext)) return true;
  return false;
}

const SingleFileUploader: React.FC<SingleFileUploaderProps> = ({
  valueUrl,
  onChange,
  accept = DEFAULT_ACCEPT,
  maxSizeMb = DEFAULT_MAX_MB,
  description,
  disabled,
  className,
  placeholderText = "Drag or click to select",
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const acceptAttr = useMemo(() => buildAcceptAttribute(accept), [accept]);
  const maxBytes = useMemo(() => maxSizeMb * 1024 * 1024, [maxSizeMb]);

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const validate = useCallback(
    (file: File) => {
      if (!fileMatchesAccept(file, accept)) return `Invalid file type: ${file.type || file.name}`;
      if (file.size > maxBytes) return `File is too large`;
      return null;
    },
    [accept, maxBytes]
  );

  const pickFile = useCallback(() => {
    if (!disabled) inputRef.current?.click();
  }, [disabled]);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.length) return;
      const file = files[0];
      const err = validate(file);
      if (err) {
        setError(err);
        setSelectedFile(null);
        onChange(null);
        return;
      }
      setError(null);
      setSelectedFile(file);
      onChange(file);
    },
    [onChange, validate]
  );

  const onInputChange = useCallback<React.ChangeEventHandler<HTMLInputElement>>(
    (e) => {
      handleFiles(e.target.files);
      e.currentTarget.value = "";
    },
    [handleFiles]
  );

  const onDrop = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragActive(false);
      handleFiles(e.dataTransfer.files);
    },
    [disabled, handleFiles]
  );

  const onDragOver = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragActive(true);
    },
    [disabled]
  );

  const onDragLeave = useCallback<React.DragEventHandler<HTMLDivElement>>(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;
      setDragActive(false);
    },
    [disabled]
  );

  const clearSelection = useCallback(() => {
    setSelectedFile(null);
    setError(null);
    onChange(null);
  }, [onChange]);

  const hasPreview = Boolean(previewUrl || valueUrl);
  const shownImage = previewUrl || valueUrl || "";

  return (
    <div className={className}>
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        onChange={onInputChange}
        hidden
        disabled={disabled}
      />

      <Card
        isPressable={!disabled}
        onPress={pickFile}
        className={[
          "w-full border-2 rounded-xl",
          dragActive ? "border-primary border-dashed" : "border-dashed border-default-200",
          disabled ? "opacity-60 pointer-events-none" : "cursor-pointer",
        ].join(" ")}
      >
        <CardBody className="p-0">
          {hasPreview ? (
            <div className="relative">
              <img
                src={shownImage}
                alt="preview"
                className="w-full h-56 object-cover rounded-xl"
                draggable={false}
              />
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-end gap-2 p-2 bg-black/40 rounded-b-xl">
                <Tooltip content="Выбрать другой файл">
                  <Button size="sm" color="primary" variant="flat" onPress={pickFile}>
                    <UploadCloud size={18} />
                  </Button>
                </Tooltip>
                <Tooltip content="Убрать выбранный файл">
                  <Button
                    size="sm"
                    color="danger"
                    variant="flat"
                    isIconOnly
                    onPress={clearSelection}
                  >
                    <X size={18} />
                  </Button>
                </Tooltip>
              </div>
            </div>
          ) : (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={[
                "flex flex-col items-center justify-center",
                "h-44 w-full rounded-xl",
                dragActive ? "bg-primary/5" : "bg-default-50",
                "transition-colors p-4 text-center select-none",
              ].join(" ")}
            >
              <ImageIcon className="opacity-70" size={36} />
              <span className="mt-2 text-xs text-foreground-500">{placeholderText}</span>
              {description ? (
                <span className="mt-1 text-[11px] text-foreground-400">{description}</span>
              ) : null}
            </div>
          )}
        </CardBody>
      </Card>

      {error ? <p className="mt-2 text-danger text-sm">{error}</p> : null}
    </div>
  );
};

export default SingleFileUploader;