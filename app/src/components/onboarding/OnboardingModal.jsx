import React from "react";
import { Modal } from "../UI/modal/Modal";
import { WelcomeScreen } from "./WelcomeScreen";

export const OnboardingModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <WelcomeScreen onClose={onClose} />
    </Modal>
  );
};
