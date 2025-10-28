import * as React from "react";
import { Card, CardHeader, CardBody, Button, Input } from "@heroui/react";
import { Plus, X } from "lucide-react";

export type ArrayStringEditorProps = {
  title: React.ReactNode;
  values: string[];
  onChange: (next: string[]) => void;
  className?: string;
  addButtonText?: string;   // опційно
  placeholder?: string;     // опційно
};

const ArrayStringEditor: React.FC<ArrayStringEditorProps> = ({
  title,
  values,
  onChange,
  className,
  addButtonText = "Add",
  placeholder = "Value",
}) => {
  const handleAdd = React.useCallback(() => {
    onChange([...(values ?? []), ""]);
  }, [onChange, values]);

  const handleUpdateAt = React.useCallback(
    (index: number, nextValue: string) => {
      const next = [...values];
      next[index] = nextValue;
      onChange(next);
    },
    [onChange, values]
  );

  const handleRemoveAt = React.useCallback(
    (index: number) => {
      const next = values.filter((_, i) => i !== index);
      onChange(next);
    },
    [onChange, values]
  );

  return (
    <Card 
        radius="sm"
        shadow="sm"
        className={className}
    >
      <CardHeader className="flex items-center justify-between gap-3 p-2 pb-0">
        <div className="font-medium pl-1">{title}</div>
        <Button
          size="md"
          radius="sm"
          variant="flat"
          startContent={<Plus size={16} />}
          onPress={handleAdd}
          aria-label="Add item"
        >
          {addButtonText}
        </Button>
      </CardHeader>

      <CardBody className="flex flex-col gap-2 p-2">
        {values?.length ? (
          values.map((v, idx) => (
            <div key={idx} className="flex items-center gap-2">
              {/* <span className=" text-sm text-default-500">{idx + 1}.</span> */}
              <Input
                className="flex-1"
                size="md"
                radius="sm"
                value={v}
                onChange={(e) => handleUpdateAt(idx, e.target.value)}
                aria-label={`Value ${idx + 1}`}
                placeholder={placeholder}
              />
              <Button
                isIconOnly
                size="md"
                radius="sm"
                variant="flat"
                color="danger"
                aria-label={`Remove item ${idx + 1}`}
                onPress={() => handleRemoveAt(idx)}
              >
                <X size={16} />
              </Button>
            </div>
          ))
        ) : (
          <p className="text-default-500 text-sm">No items</p>
        )}
      </CardBody>
    </Card>
  );
};

export default ArrayStringEditor;