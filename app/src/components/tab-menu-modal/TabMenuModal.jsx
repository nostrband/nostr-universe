import React from "react";
import { Modal } from "../UI/modal/Modal";
import { TabMenu } from "./TabMenu";

export const TabMenuModal = ({ isOpen, onClose, tab, onOpenWith }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <TabMenu onClose={onClose} tab={tab} onOpenWith={onOpenWith} />
    </Modal>
  );
};
