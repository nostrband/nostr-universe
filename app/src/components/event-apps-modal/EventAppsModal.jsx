import React from "react";
import { Modal } from "../UI/modal/Modal";
import { EventApps } from "./EventApps";

export const EventAppsModal = ({ isOpen, onClose, addr, onSelect }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <EventApps onClose={onClose} addr={addr} onSelect={onSelect} />
    </Modal>
  );
};
