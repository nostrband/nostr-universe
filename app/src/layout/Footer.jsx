import React, { useContext } from "react";

import { AppContext } from "../store/app-context";
import { SwipeableDrawer } from "../components/swipeable-drawer/SwipeableDrawer";
import { IconButton, styled } from "@mui/material";
import { homeIcon, stopIcon, reloadIcon, tabsIcon } from "../assets";
import { PinItem } from "../components/pins/PinItem";

export const Footer = ({ onOpenPinModal, onTabs }) => {
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
    isShowDrawer,
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
      {isShowDrawer && <SwipeableDrawer />}
      <>
        {currentWorkspace && (
          <div
            id="tab-menu"
            className="container d-none justify-content-between align-items-center gap-1"
            style={{ position: "relative", zIndex: 1200, background: "#000" }}
          >
            <div
              className="me-0 d-flex justify-content-start align-items-center"
              style={{ overflowX: "scroll" }}
            >
              {false && currentTabGroup &&
               currentTabGroup.tabs.map((id) => {
                 const tab = getTab(id);
                 return (
                   <div style={{ width: "34px", minWidth: "34px" }}>
                     <PinItem
		       key={id}
                       image={tab.icon}
                       title={tab.title}
                       active={tab.id === currentTab.id}
                       onClick={() => switchTab(tab)}
                     />
                   </div>
                 );
              })}
	      {currentTab && (
                <div style={{ width: "34px", minWidth: "34px" }}>
                  <PinItem
                    image={currentTab.icon}
                    title={currentTab.title}
                    active={true}
                  />
                </div>
	      )}
            </div>
            <div className="flex-shrink-0">
              <StyledIconButton onClick={onTabs} disabled={!currentTab}>
                <img src={tabsIcon} width={"24px"} height={"24px"} />
              </StyledIconButton>
              <StyledIconButton onClick={onStopReload} disabled={!currentTab}>
                <img
                  src={
                  currentTab && !currentTab.loading ? reloadIcon : stopIcon
                  }
                  width={"24px"}
                  height={"24px"}
                />
              </StyledIconButton>
              <StyledIconButton onClick={onHideTab} disabled={!currentTab}>
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
