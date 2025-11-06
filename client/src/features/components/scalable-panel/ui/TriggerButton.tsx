import { Button } from "@heroui/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
// Types
import { TriggerButtonProps } from "../types";

// ===============================
// Render
// ===============================
const TriggerButton: React.FC<TriggerButtonProps> = ({
  onPress,
  isExpanded,
}) => {
  return (
    <Button
      isIconOnly
      size="sm"
      variant="flat"
      color="primary"
      onPress={onPress}
      className={`${!isExpanded && "flex-1"}`}
    >
      {isExpanded ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
    </Button>
  );
};

export default TriggerButton;
