import React, { useCallback, useState, type ReactNode } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Alert,
  type PopoverProps,
} from "@heroui/react";

// ==========================
// Component
// ==========================
const ConfirmPopover: React.FC<ConfirmPopoverProps> = ({
  children,

  // текст
  title = "Are you sure?",
  description,

  // alert / no alert
  useAlert = true,
  alertColor = "warning",

  // кнопки
  approveLabel = "Confirm",
  cancelLabel = "Cancel",
  showCancel = true,
  approveColor = "danger",
  approveVariant = "flat",
  cancelColor = "default",
  cancelVariant = "light",

  // состояния кнопок
  isApproveLoading,
  isApproveDisabled,
  isCancelDisabled,

  // колбэки
  onApprove,
  onClose,

  // пропсы поповера
  placement = "right",
  shouldCloseOnBlur = true,
  shouldCloseOnScroll = true,
  showArrow = true,
  classNames,
  contentClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Централизуем управление открытием/закрытием
  const handleOpenChange = useCallback(
    (open: boolean) => {
      setIsOpen(open);
      if (!open) onClose?.();
    },
    [onClose]
  );

  const handleClose = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const handleApprove = useCallback(async () => {
    try {
      await onApprove?.();
      // Закрываем только при успехе; если нужно "всегда", перенесите в finally
      setIsOpen(false);
      onClose?.();
    } catch (e) {
      // оставляем поповер открытым — можно показать ошибку тут
      // console.error(e);
    }
  }, [onApprove, onClose]);

  const Body = (
    <div className="flex flex-col">
      {title ? <div className="font-medium">{title}</div> : null}
      {description ? (
        <div className="text-sm text-default-500">{description}</div>
      ) : null}

      <div className="flex w-full justify-end gap-2 pt-1">
        {showCancel && (
          <Button
            variant={cancelVariant}
            color={cancelColor}
            size="sm"
            onPress={handleClose}
            isDisabled={isCancelDisabled}
            aria-label="Cancel"
            autoFocus
          >
            {cancelLabel}
          </Button>
        )}
        <Button
          variant={approveVariant}
          color={approveColor}
          size="sm"
          onPress={handleApprove}
          isLoading={isApproveLoading}
          isDisabled={isApproveDisabled}
          aria-label="Confirm"
        >
          {approveLabel}
        </Button>
      </div>
    </div>
  );

  return (
    <Popover
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      placement={placement}
      showArrow={showArrow}
      shouldCloseOnScroll={shouldCloseOnScroll}
      shouldCloseOnBlur={shouldCloseOnBlur}
      classNames={{ content: contentClassName ?? "p-0", ...classNames }}
    >
      <PopoverTrigger>{children}</PopoverTrigger>

      <PopoverContent className={contentClassName ?? "max-w-[350px] p-0"}>
        {useAlert ? (
          <Alert color={alertColor} className="p-3">
            {Body}
          </Alert>
        ) : (
          <div className="p-3">{Body}</div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default ConfirmPopover;

// ==========================
// Types
// ==========================
type AlertColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";
type ButtonVariant =
  | "solid"
  | "bordered"
  | "flat"
  | "light"
  | "faded"
  | "ghost"
  | "shadow";
type ButtonColor =
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger";

export type ConfirmPopoverProps = {
  /** Элемент-инициатор (кнопка, иконка и т.п.) */
  children: ReactNode;

  /** Заголовок и текст */
  title?: ReactNode;
  description?: ReactNode;

  /** Показывать обертку Alert или просто текст */
  useAlert?: boolean;
  alertColor?: AlertColor;

  /** Кнопки и их подписи/стили */
  approveLabel?: ReactNode;
  cancelLabel?: ReactNode;
  showCancel?: boolean;
  approveColor?: ButtonColor;
  approveVariant?: ButtonVariant;
  cancelColor?: ButtonColor;
  cancelVariant?: ButtonVariant;

  /** Состояния кнопок */
  isApproveLoading?: boolean;
  isApproveDisabled?: boolean;
  isCancelDisabled?: boolean;

  /** Колбэки */
  onApprove?: () => void | Promise<void>;
  /** Вызывается при закрытии по любой причине (cancel/blur/scroll/внешний клик/программно) */
  onClose?: () => void;

  /** Прокидываемые пропсы поповера */
  placement?: PopoverProps["placement"];
  shouldCloseOnBlur?: boolean;
  shouldCloseOnScroll?: boolean;
  showArrow?: boolean;
  classNames?: PopoverProps["classNames"];
  contentClassName?: string;
};