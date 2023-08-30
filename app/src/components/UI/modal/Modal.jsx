import React, { useState, useEffect, useContext } from "react";
import { Dialog, Slide } from "@mui/material";
import { AppContext } from "../../../store/app-context";

const ModalContent = (props) => {
  return <>{props.children}</>;
};

const Transition = React.forwardRef(function (props, ref) {
  return <Slide ref={ref} {...props} unmountOnExit />;
});

export const Modal = ({
  isOpen = false,
  onClose,
  children,
  contentProps = {},
  fullScreen = true,
  direction = "right",
  ...props
}) => {
  const [open, setOpen] = useState(false);

  const contextData = useContext(AppContext);
  const { onModalOpen, onModalClose } = contextData || {};

  useEffect(() => {
    const cb = async () => {
      if (!open && isOpen) await onModalOpen();
      if (open && !isOpen) await onModalClose();

      setOpen(isOpen);
    };
    cb();
  }, [isOpen]);
  
  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={onClose}
      TransitionComponent={fullScreen ? Transition : undefined}
      TransitionProps={{
        direction,
      }}
      keepMounted
      PaperProps={{
        sx: {
          background: "#000000",
          color: "white",
        },
      }}
      {...props}
    >
      <ModalContent {...contentProps}>{children}</ModalContent>
    </Dialog>
  );
};
