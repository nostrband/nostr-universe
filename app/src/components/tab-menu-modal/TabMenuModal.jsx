import React from "react";
import { Modal } from "../UI/modal/Modal";
import { TabMenu } from "./TabMenu";

export const TabMenuModal = ({ isOpen, onClose, onOpenWith, onOpenPinAppModal }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TabMenu onClose={onClose} onOpenWith={onOpenWith} onOpenPinAppModal={onOpenPinAppModal} />
	</Modal>
  );
};
