import React, { useContext } from "react";

import Button from "react-bootstrap/esm/Button";
import { AppContext } from "../store/app-context";
import { SwipeableDrawer } from "../components/swipeable-drawer/SwipeableDrawer";

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
      <div id="pins" className="d-block">
        <SwipeableDrawer />
      </div>
      <>
        {currentWorkspace && (
          <div
            id="tab-menu"
            className="container d-none justify-content-end gap-1"
            style={{ position: "relative", zIndex: 1200, background: "#000" }}
          >
            <div className="me-3">
              {currentTab && currentTab.loading && "Loading..."}
            </div>
            <div>
              <Button
                variant="secondary"
                size="small"
                onClick={onCloseTab}
                disabled={!currentTab}
              >
                Close
              </Button>
            </div>
            {currentTab && currentTab?.appNaddr && (
              <div>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    onTogglePin(onOpenPinModal);
                  }}
                >
                  {currentTab && currentTab?.pinned ? "Unpin" : "Pin"}
                </Button>
              </div>
            )}
            {false && (
              <div>
                <Button variant="secondary" size="small" onClick={onShowTabs}>
                  Tabs
                </Button>
              </div>
            )}
            <div>
              <Button
                variant="secondary"
                size="small"
                onClick={onHideTab}
                disabled={!currentTab}
              >
                Hide
              </Button>
            </div>
          </div>
        )}
      </>
    </footer>
  );
};
