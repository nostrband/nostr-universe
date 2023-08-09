import React, { useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Divider, SwipeableDrawer as MuiSwipeableDrawer } from "@mui/material";

import { PinsList } from "../pins/PinsList";

const drawerBleeding = "10.5%";

export const SwipeableDrawer = (props) => {
  const { window } = props;
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  // Temporary solution
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <>
      <StyledSwipeableDrawer
        container={container}
        anchor="bottom"
        PaperProps={{
          className: "paper",
        }}
        open={open}
        onClose={toggleDrawer(false)}
        onOpen={toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={200}
        hysteresis={0.7}
      >
        <VisibleContent>
          <Puller onClick={toggleDrawer} />
          <PinsList />
        </VisibleContent>
        {false && <StyledDivider />}
        <ExpandedContent>
          <Skeleton variant="rectangular" height="100%" />
        </ExpandedContent>
      </StyledSwipeableDrawer>
    </>
  );
};

const StyledDivider = styled(Divider)(() => ({
  opacity: 1,
  borderColor: "#282828",
  borderWidth: "1px",
}));

const StyledSwipeableDrawer = styled(MuiSwipeableDrawer)(() => ({
  "& .paper": {
    height: `calc(90% - ${drawerBleeding})`,
    overflow: "visible",
  },
}));

const VisibleContent = styled(Box)(() => ({
  position: "absolute",
  top: `-${parseInt(drawerBleeding) + 3}%`,
  borderTopLeftRadius: "2rem",
  borderTopRightRadius: "2rem",
  visibility: "visible",
  right: 0,
  left: 0,
  background: "red",
  height: `calc(${parseInt(drawerBleeding) + 3}% + 1px)`,
  boxShadow: "0px -4px 8px 0px #00000033",
  paddingTop: "1rem",
}));

const ExpandedContent = styled(Box)(() => ({
  padding: "0 2px 2px",
  overflow: "auto",
  background: "red",
  height: `100%`,
}));

const Puller = styled("div")(() => ({
  width: "64px",
  height: 4,
  backgroundColor: " #FFFFFF26",
  borderRadius: "60px",
  position: "absolute",
  top: 6,
  left: "calc(50% - 32px)",
}));
