import { ReactNode, useEffect, useState } from "react";

export interface DialogProps {
  isOpen: boolean;
  onClose?: () => void;

  // Transition has ended after modal closed
  onCloseEnded?: () => void;
  children: ReactNode;
  className?: string;
}

export interface UseDialogStateResult extends Pick<DialogProps, "isOpen"> {
  openModal: () => void;
  closeModal: () => void;
  key: number;
}

export function useDialogState(initialValue = false): UseDialogStateResult {
  const [key, setKey] = useState(initialValue ? 1 : 0);
  const [isOpen, setIsOpen] = useState(initialValue);

  useEffect(() => {
    if (key) {
      setIsOpen(true);
    }
  }, [key]);

  const openModal = () => setKey((key) => key + 1);
  const closeModal = () => {
    setIsOpen(false);
  };

  return {
    isOpen,
    openModal,
    closeModal,
    key,
  };
}
