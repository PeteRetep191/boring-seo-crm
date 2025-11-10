// Hooks
import { useImmer } from "use-immer";
import { useEffect } from "react";
// UI
import { Card } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { OfferItem } from "./";
// Forms
import { SelectOffersForm } from "../forms";
// Icons
import { ArrowLeftRight } from "lucide-react";

const INITIAL_STATE: IOfferSelectorState = {
  value: null,
  modal: {
    isOpen: false,
  },
};

const OfferSelector: React.FC<IOfferSelectorProps> = ({
  value,
  onChange,
  startContent = null,
  endContent = null,
  className = "",
}) => {
  const [state, updateState] = useImmer<IOfferSelectorState>({
    ...INITIAL_STATE,
    value: value ?? null,
  });
  // ---------------------------------
  // Effects
  // ---------------------------------
  useEffect(() => {
    if (value !== state.value) {
      updateState((draft) => {
        draft.value = value;
      });
    }
  }, [value]);

  useEffect(() => {
    onChange?.(state.value);
  }, [state.value]);

  // ---------------------------------
  // Render
  // ---------------------------------
  return (
    <>
      <Card
        isPressable
        radius="sm"
        shadow="none"
        onPress={() => {
          updateState((draft) => {
            draft.modal.isOpen = true;
          });
        }}
        className={`flex flex-row items-center justify-center bg-content2 ${className}`}
      >
        {state.value ? (
          <>
            {startContent}
            <div className="relative group flex items-center flex-1 pl-1 gap-2 h-full">
              <OfferItem
                id={state.value}
                cardClassName="h-[50px] bg-transparent"
                cardProps={{
                  isPressable: false,
                }}
              />
              <div
                className="
                  pointer-events-none
                  absolute inset-0 z-999
                  bg-content1/50
                  opacity-0 group-hover:opacity-100 group-focus-within:opacity-100
                  transition-opacity duration-150
                  rounded-[inherit]
                  flex items-center justify-center
                "
              >
                <ArrowLeftRight className="text-sm font-medium" size={20} />
              </div>
            </div>
            {endContent}
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center ">
            <span className="text-sm text-default-500">
              No offer selected, please tap to select one
            </span>
          </div>
        )}
      </Card>

      <Modal
        placement="top"
        size="2xl"
        isOpen={state.modal.isOpen}
        onClose={() => {
          updateState((draft) => {
            draft.modal.isOpen = false;
          });
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 p-2">
                Select Offer
              </ModalHeader>
              <ModalBody className="p-2">
                <SelectOffersForm
                  onSelect={(id) => {
                    updateState((draft) => {
                      draft.modal.isOpen = false;
                      console.log(`Selected offer ID: ${id._id}`);
                      draft.value = id._id;
                    });
                  }}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default OfferSelector;

// Types
interface IOfferSelectorProps {
  value?: string;
  onChange?: (value: string | null | undefined) => void;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  className?: string;
}

interface IOfferSelectorState {
  // isLoading: boolean;
  value?: string | null;
  // details: IOffer | null;
  modal: {
    isOpen: boolean;
  };
}
