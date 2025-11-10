// Hooks
import { useImmer } from "use-immer";
import { useEffect } from "react";
// dnd-kit
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
// UI
import { Button } from "@heroui/react";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";
import { OfferItem } from "./";
// Forms
import { SelectOffersForm } from "../forms";
// Icons
import { InboxIcon, Plus, Trash2, GripVertical } from "lucide-react";
import { R } from "node_modules/framer-motion/dist/types.d-BJcRxCew";

const INITIAL_STATE: IOfferSelectorState = {
  value: [],
  modal: {
    isOpen: false,
  },
};

// ================================
// OfferMultiSelector
// ================================
const OfferMultiSelector: React.FC<IOfferSelectorProps> = ({
  value,
  onChange,
}) => {
  const [state, updateState] = useImmer<IOfferSelectorState>({
    ...INITIAL_STATE,
    value: value ?? [],
  });

  // ---------------------------------
  // Handlers
  // ---------------------------------
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    updateState((draft) => {
      const list = draft.value ?? [];
      const oldIndex = list.indexOf(active.id);
      const newIndex = list.indexOf(over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        draft.value = arrayMove(list, oldIndex, newIndex);
      }
    });
  };

  // ---------------------------------
  // Effects
  // ---------------------------------
  useEffect(() => {
    if (value !== state.value && value !== undefined && value !== null) {
      updateState((draft) => {
        draft.value = value;
      });
    }
  }, [value]);

  useEffect(() => {
    console.log("multi offers", state.value);
    onChange?.(state.value);
  }, [state.value]);

  // ---------------------------------
  // Helpers
  // ---------------------------------
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  // ---------------------------------
  // Render
  // ---------------------------------
  return (
    <>
      <div className="flex flex-col gap-2">
        {Array.isArray(state.value) && state.value.length > 0 && (
          <div className="flex w-full items-center justify-between">
            <span className="text-sm text-default-400">
              Count: {state?.value?.length || 0}
            </span>
            <Button
              size="sm"
              radius="sm"
              variant="flat"
              color="primary"
              onPress={() => {
                updateState((draft) => {
                  draft.modal.isOpen = true;
                });
              }}
            >
              <Plus size={20} /> Add Offer
            </Button>
          </div>
        )}
        {Array.isArray(state.value) && state.value.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={state.value!}
              strategy={verticalListSortingStrategy}
            >
              {state?.value?.map((item) => (
                <SortableRow key={item} id={item}>
                  {({
                    setHandleRef,
                    handleListeners,
                    handleAttributes,
                    isDragging,
                  }) => (
                    <div
                      className={`flex flex-row items-center rounded-lg justify-center gap-1 h-[55px] bg-content2 overflow-hidden`}
                      style={{
                        opacity: isDragging ? 0.9 : 1,
                        boxShadow: isDragging
                          ? "0 4px 10px rgba(0,0,0,0.1)"
                          : undefined,
                      }}
                    >
                      <div className="flex items-center h-full">
                        <div className="flex items-center h-full">
                          <Button
                            size="sm"
                            radius="none"
                            variant="light"
                            isIconOnly
                            color="primary"
                            className="relative h-full min-w-0 w-[25px]"
                            type="button"
                            aria-label={`Переместить ${item}`}
                          >
                            <span
                              ref={setHandleRef}
                              {...(handleListeners as React.HTMLAttributes<HTMLSpanElement>)}
                              {...(handleAttributes as React.HTMLAttributes<HTMLSpanElement>)}
                              className="absolute inset-0 cursor-grab active:cursor-grabbing"
                              tabIndex={0}
                              role="button"
                              aria-label={`Переместить ${item}`}
                            />
                            <GripVertical size={20} />
                          </Button>
                        </div>
                      </div>

                      <OfferItem
                        id={item}
                        cardClassName="h-[50px] bg-transparent"
                        cardProps={{
                          radius: "sm",
                          isPressable: false,
                        }}
                      />

                      <div className="flex items-center h-full">
                        <Button
                          size="sm"
                          radius="none"
                          variant="light"
                          isIconOnly
                          color="danger"
                          className="h-full"
                          onPress={() => {
                            updateState((draft) => {
                              draft.value = draft?.value?.filter(
                                (id) => id !== item,
                              );
                            });
                          }}
                        >
                          <Trash2 size={20} />
                        </Button>
                      </div>
                    </div>
                  )}
                </SortableRow>
              ))}
            </SortableContext>
          </DndContext>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 rounded-md bg-content2 p-3">
            <div className="flex flex-col items-center justify-center gap-1">
              <InboxIcon size={20} className="text-default-400" />
              <span className="text-sm text-default-400">
                No Offers Available
              </span>
            </div>
            <Button
              size="sm"
              radius="sm"
              variant="flat"
              color="primary"
              onPress={() => {
                updateState((draft) => {
                  draft.modal.isOpen = true;
                });
              }}
            >
              <Plus size={20} /> Add Offer
            </Button>
          </div>
        )}
      </div>

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
                  selected={state.value || []}
                  onSelect={(id) => {
                    updateState((draft) => {
                      draft.modal.isOpen = false;
                      console.log(`Selected offer ID: ${id._id}`);
                      draft.value?.push(id._id);
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

export default OfferMultiSelector;

// ================================
// SortableRow
// ================================
const SortableRow: React.FC<ISortableRowProps> = ({ id, children }) => {
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      {children({
        setHandleRef: setActivatorNodeRef,
        handleListeners: listeners!,
        handleAttributes: attributes,
        isDragging,
      })}
    </div>
  );
};

// ================================
// Types
// ================================
interface IOfferSelectorProps {
  value?: string[];
  onChange?: (value: string[] | null | undefined) => void;
  className?: string;
}

interface IOfferSelectorState {
  value?: string[] | null;
  modal: {
    isOpen: boolean;
  };
}

interface ISortableRowProps {
  id: string;
  children: (args: {
    setHandleRef: (node: HTMLElement | null) => void;
    handleListeners: React.HTMLAttributes<HTMLElement>;
    handleAttributes: Record<string, any>;
    isDragging: boolean;
  }) => React.ReactNode;
}
