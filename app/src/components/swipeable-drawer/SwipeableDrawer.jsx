import React, { useContext, useEffect, useRef, useState } from "react";

import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { Divider, SwipeableDrawer as MuiSwipeableDrawer } from "@mui/material";

import { PinsList } from "../pins/PinsList";
import { AppContext } from "../../store/app-context";
import { SortableTabsList } from "../sortable-tabs/SortableTabsList";

const getInitialBleedingHeight = (windowInstance) => {
  if (windowInstance.innerHeight < 600) {
    return 16.5;
  }
  if (windowInstance.innerHeight < 730) {
    return 13.5;
  }
  return 10.5;
};

export const SwipeableDrawer = () => {
  const [open, setOpen] = useState(false);
  const [drawerBleeding, setDrawerBleedingHeight] = useState(() =>
    window ? getInitialBleedingHeight(window) : 10.5
  );

  const contextData = useContext(AppContext);
  const { currentWorkspace, currentTab } = contextData || {};
  const { tabGroups = {} } = currentWorkspace || {};

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

  useEffect(() => {
    return () => {
      setOpen(false);
    };
  }, []);

  const keys = Object.keys(tabGroups);

  //@TODO remake bottom sheet component
  const isAllowChildren = open
    ? {}
    : {
        allowSwipeInChildren: (e, area, paper) => {
          // @TODO find a better solution
          setTimeout(() => {
            paper.style.transform = `translate(0, ${paper.clientHeight}px)`;
          }, 0);
          return open ? false : true;
        },
      };

  return (
    <StyledSwipeableDrawer
      container={container}
      anchor="bottom"
      PaperProps={{
        className: "paper",
      }}
      open={open && !currentTab}
      onClose={toggleDrawer(false)}
      onOpen={toggleDrawer(true)}
      swipeAreaWidth={`${drawerBleeding}%`}
      disableSwipeToOpen={false}
      ModalProps={{
        keepMounted: true,
      }}
      transitionDuration={200}
      disablePortal
      // disableDiscovery
      {...isAllowChildren}
    >
      <VisibleContent bleedingheight={drawerBleeding} open={open}>
        <Puller onClick={toggleDrawer} />
        {!open && <PinsList drawerBleeding={drawerBleeding} />}
      </VisibleContent>
      {false && <StyledDivider />}
      <ExpandedContent>
        {/* Show this when items are loading */}
        {false && <Skeleton variant="rectangular" height="100%" />}
        <SortableTabsList />
      </ExpandedContent>
    </StyledSwipeableDrawer>
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

const VisibleContent = styled(Box)(({ bleedingheight, open }) => ({
  position: "absolute",
  top: open ? "calc(-1rem + 1px)" : `-${bleedingheight + 3}%`,
  borderTopLeftRadius: "2rem",
  borderTopRightRadius: "2rem",
  visibility: "visible",
  right: 0,
  left: 0,
  background: "#111111",
  height: open ? "auto" : `calc(${bleedingheight + 3}% + 1px)`,
  boxShadow: "0px -4px 8px 0px #00000033",
  paddingTop: "1rem",
}));

const ExpandedContent = styled(Box)(() => ({
  padding: "0 2px 2px",
  overflow: "auto",
  background: "#111111",
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
