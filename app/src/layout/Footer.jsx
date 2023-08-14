import React, { useContext } from "react";

import Button from "react-bootstrap/esm/Button";
import { AppContext } from "../store/app-context";
import { SwipeableDrawer } from "../components/swipeable-drawer/SwipeableDrawer";
import { IconButton, styled } from "@mui/material";
import { homeIcon } from "../assets";
import { PinItem } from "../components/pins/PinItem";

export const Footer = ({ onOpenPinModal }) => {
  const contextData = useContext(AppContext);
  const {
    currentWorkspace,
    currentTab,
    onCloseTab,
    onHideTab,
    onShowTabs,
    onTogglePin,
  } = contextData || {};

  return (
    <footer id="footer">
      <SwipeableDrawer />
      <>
        {currentWorkspace && (
          <div
            id="tab-menu"
            className="container d-none justify-content-between align-items-center gap-1"
            style={{ position: "relative", zIndex: 1200 }}
          >
            <div className="me-3">
	      <div className="d-flex justify-content-start align-items-center">
		{currentTab && currentTab.icon && (
		  <div style={{width: "34px"}}>
		    <PinItem
		      image={currentTab.icon}
		      title={currentTab.title}
		    />
		  </div>
		)}
		{currentTab && currentTab.loading && "Loading..."}
	      </div>
            </div>
            <div>
	      <StyledIconButton
		onClick={onHideTab}
                disabled={!currentTab}
	      >
		<img src={homeIcon} width={"24px"} height={"24px"} />
	      </StyledIconButton>
	    </div>
          </div>
        )}
      </>
    </footer>
  );
};

const StyledIconButton = styled(IconButton)(() => ({
  width: "44px",
  height: "44px",
  "&:hover": {
    backgroundColor: "rgba(251, 251, 251, 0.08)",
  },
}));
