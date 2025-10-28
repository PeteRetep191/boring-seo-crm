import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card, CardBody } from "@heroui/react";
import { Image as ImageIcon } from "lucide-react";

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
        setSelectedFile(null);
        onChange(null);
        return;
      }
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

  const hasPreview = Boolean(previewUrl || valueUrl);
  const shownImage = previewUrl || valueUrl || "";

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept={acceptAttr}
        onChange={onInputChange}
        hidden
        disabled={disabled}
      />

      <Card
        radius="md"
        shadow="sm"
        isHoverable
        isPressable={!disabled}
        onPress={pickFile}
        className="h-full"
      >
        <CardBody className="p-0 h-full">
          {hasPreview ? (
            <img
                src={shownImage}
                alt="preview"
                className="w-full h-full object-cover rounded-xl"
                draggable={false}
              />
          ) : (
            <div
              onDrop={onDrop}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              className={`flex h-full w-full items-center justify-center rounded-xl border-2 border-dashed
                ${dragActive ? "border-primary-500 bg-primary-50" : "border-foreground-300 bg-background-100"}
                ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                ${className || ""}
              `}
            >
              <div className="text-center p-3">
                <ImageIcon className="opacity-70 mx-auto" size={36} />
                <span className="mt-2 text-xs text-foreground-500">{placeholderText}</span>
                {description ? (
                  <span className="mt-1 text-[11px] text-foreground-400">{description}</span>
                ) : null}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default SingleFileUploader;