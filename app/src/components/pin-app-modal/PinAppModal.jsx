import React from "react";
import { Modal } from "../UI/modal/Modal";
import { PinApp } from "./PinApp";

export const PinAppModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <PinApp onClose={onClose} />
    </Modal>
  );
};
