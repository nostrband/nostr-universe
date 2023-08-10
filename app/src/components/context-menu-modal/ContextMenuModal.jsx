import React from "react";
import { Modal } from "../UI/modal/Modal";
import { ContextMenu } from "./ContextMenu";

export const ContextMenuModal = ({ isOpen, onClose, input, onOpenWith }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ContextMenu onClose={onClose} input={input} onOpenWith={onOpenWith} />
    </Modal>
  );
};
