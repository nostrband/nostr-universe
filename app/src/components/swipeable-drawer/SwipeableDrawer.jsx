import React, { useEffect, useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Divider, SwipeableDrawer as MuiSwipeableDrawer } from "@mui/material";

import { PinsList } from "../pins/PinsList";

export const SwipeableDrawer = () => {
  const [open, setOpen] = useState(false);
  const [drawerBleeding, setDrawerBleedingHeight] = useState(10.5);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  useEffect(() => {
    if (!window) return;

    const handleResize = () => {
      if (window.innerHeight < 600) {
        return setDrawerBleedingHeight(16.5);
      }
      if (window.innerHeight < 730) {
        return setDrawerBleedingHeight(13.5);
      }
      setDrawerBleedingHeight(10.5);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const container =
    window !== undefined ? () => window.document.body : undefined;

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
        swipeAreaWidth={`${drawerBleeding}%`}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        transitionDuration={200}
        hysteresis={0.7}
      >
        <VisibleContent bleedingheight={drawerBleeding}>
          <Puller onClick={toggleDrawer} />
          <PinsList drawerBleeding={drawerBleeding} />
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

const StyledSwipeableDrawer = styled(MuiSwipeableDrawer)(
  ({ swipeAreaWidth }) => ({
    "& .paper": {
      height: `calc(90% - ${swipeAreaWidth})`,
      overflow: "visible",
    },
  })
);

const VisibleContent = styled(Box)(({ bleedingheight }) => ({
  position: "absolute",
  top: `-${bleedingheight + 3}%`,
  borderTopLeftRadius: "2rem",
  borderTopRightRadius: "2rem",
  visibility: "visible",
  right: 0,
  left: 0,
  background: "red",
  height: `calc(${bleedingheight + 3}% + 1px)`,
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
