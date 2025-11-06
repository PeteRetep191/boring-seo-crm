// UI Components
import { Button, Divider, Chip } from "@heroui/react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { DraggableList } from "@/tests/ui/DraggableList";
import { RatingStars, TruncatedList } from "@/shared/ui";
import { FlagImg } from "@/shared/ui";
// Icons
import { Edit, Trash2 } from "lucide-react";
//Types
import { CardProps } from "@heroui/react";
import { IShowcase } from "../types";

// ==========================
// Constants
// ==========================
const INITIAL_STATE: Partial<IShowcase> = {};

// ==========================
// ShowcaseItem
// ==========================
const ShowcaseItem: React.FC<{
  showcaseId?: string;
  showOffersList?: boolean;
  canEdit?: boolean;
  canRemove?: boolean;
  onEdit?: (showcaseId: string | undefined) => void;
  onRemove?: (showcaseId: string | undefined) => void;
  className?: string;
  cardProps?: Omit<CardProps, "className">;
}> = ({
  showcaseId,
  showOffersList = false,
  canEdit = true,
  canRemove = true,
  onEdit,
  onRemove,
  className,
  cardProps,
}) => {
  // ---------------------------
  // Handlers
  // ---------------------------
  const handleRemove = () => {
    console.log("Remove button clicked, showcaseId:", showcaseId);
    if (onRemove) {
      onRemove(showcaseId);
    }
  };
  const handleEdit = () => {
    console.log("Edit button clicked, showcaseId:", showcaseId);
    if (onEdit) {
      onEdit(showcaseId);
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
  return (
    <Card
      radius="sm"
      shadow="none"
      {...cardProps}
      className={`p-1 bg-content2 ${className}`}
    >
      <CardHeader className="flex items-center justify-between gap-2 p-1">
        <h2>Default Showcase</h2>
        <div className="flex items-center justify-end gap-1">
          {canEdit && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="default"
              onPress={handleEdit}
            >
              <Edit size={19} />
            </Button>
          )}

          {canRemove && (
            <Button
              isIconOnly
              size="sm"
              variant="light"
              color="danger"
              onPress={handleRemove}
            >
              <Trash2 size={19} />
            </Button>
          )}
        </div>
      </CardHeader>
      <Divider />
      <CardBody className="p-1 flex flex-col gap-2">
        <div className="grid grid-cols-2 gap-2">
          <span className="text-default-500">Countries: N/A</span>
          <span className="text-default-500">IPs: N/A</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <span className="text-default-500">Referrers: N/A</span>
          <span className="text-default-500">Devices: N/A</span>
        </div>
      </CardBody>

      {showOffersList && (
        <>
          <Divider />
          <CardFooter className="p-1">
            <DraggableList<{
              id: string;
              label: string;
              flags: string[];
              bonus: string;
              raiting: number;
              status: string;
            }>
              items={[]}
              className="flex-1"
              renderItem={(i) => (
                <div
                  className={`flex flex-1 items-center justify-between ${i.status === "disabled" ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="flex items-center justify-start gap-2">
                    <img
                      src="https://placehold.co/400x400?text=Hello+World"
                      className="h-12 w-12 object-cover"
                    />
                    <div className="flex flex-col gap-1 h-full">
                      <div className="flex justify-between gap-2">
                        <div className="text-[14px] truncate">{i.label}</div>
                        <RatingStars value={i.raiting} />
                      </div>
                      <div className="flex space-x-1">
                        <TruncatedList
                          items={i.flags}
                          renderItem={(flag) => (
                            <FlagImg flag={flag} key={flag} />
                          )}
                          max={6}
                          emptyContent={<span>No countries</span>}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Chip
                      size="sm"
                      radius="sm"
                      variant="flat"
                      color={i.status === "active" ? "success" : "default"}
                      className={`min-h-5 h-5 ${i.status === "disabled" ? "bg-gray-500 text-gray-200" : ""}`}
                    >
                      {i.status}
                    </Chip>
                    <span className="text-[14px] text-gray-500">{`Bonus: ${i.bonus}`}</span>
                  </div>
                </div>
              )}
              // onChange={setItems}
            ></DraggableList>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default ShowcaseItem;
