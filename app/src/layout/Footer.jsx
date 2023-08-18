import React, { useContext } from "react";

import Button from "react-bootstrap/esm/Button";
import { AppContext } from "../store/app-context";
import { SwipeableDrawer } from "../components/swipeable-drawer/SwipeableDrawer";
import { IconButton, styled } from "@mui/material";
import { homeIcon, stopIcon, reloadIcon } from "../assets";
import { PinItem } from "../components/pins/PinItem";

export const Footer = ({ onOpenPinModal }) => {
  const contextData = useContext(AppContext);
  const {
    currentWorkspace,
    currentTab,
    currentTabGroup,
    getTab,
    onOpenTab,
    onHideTab,
    onStopTab,
    onReloadTab,
  } = contextData || {};

  const switchTab = async (tab) => {
    await onHideTab();
    onOpenTab(tab);
  };

  const onStopReload = async () => {
    currentTab.loading ? onStopTab() : onReloadTab();
  };
  
  return (
    <footer id="footer">
      <div id="pins" className="d-block">
        <SwipeableDrawer />
      </div>
      <>
        {currentWorkspace && (
          <div
            id="tab-menu"
            className="container d-none justify-content-between align-items-center gap-1"
            style={{ position: "relative", zIndex: 1200, background: "#000" }}
          >
            <div className="me-0 d-flex justify-content-start align-items-center" style={{overflowX:"scroll"}}>
	      {currentTabGroup && currentTabGroup.tabs.map(id => {
		const tab = getTab(id);
		return (
		  <div style={{width: "34px", minWidth:"34px"}}>
		    <PinItem
		      image={tab.icon}
		      title={tab.title}
		      active={tab.id === currentTab.id}
		      onClick={() => switchTab(tab)}
		    />
		  </div>
		)
	      })}
            </div>
            <div className="flex-shrink-0">
	      <StyledIconButton
		onClick={onStopReload}
                disabled={!currentTab}
	      >
		<img
		  src={currentTab && !currentTab.loading ? reloadIcon : stopIcon}
		  width={"24px"}
		  height={"24px"}
		/>
	      </StyledIconButton>
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
