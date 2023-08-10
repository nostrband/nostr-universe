import React, { useContext } from "react";

import Button from "react-bootstrap/esm/Button";
import { AppContext } from "../store/app-context";
import { SwipeableDrawer } from "../components/swipeable-drawer/SwipeableDrawer";

export const Footer = ({ onOpenPinModal }) => {
  const contextData = useContext(AppContext);
  const {
    workspaces,
    currentPubkey,
    onCloseTab,
    onHideTab,
    onShowTabs,
    onTogglePin,
  } = contextData || {};

  const ws = workspaces.find((w) => w.pubkey === currentPubkey);

  return (
    <footer id="footer">
      <SwipeableDrawer />
      <>
        {ws && (
          <div
            id="tab-menu"
            className="container d-none justify-content-end gap-1"
            style={{ position: "relative", zIndex: 1200 }}
          >
            <div className="me-3">
              {ws.currentTab && ws.currentTab.loading && "Loading..."}
            </div>
            <div>
              <Button
                variant="secondary"
                size="small"
                onClick={onCloseTab}
                disabled={!ws.currentTab}
              >
                Close
              </Button>
            </div>
            {ws.currentTab && ws.currentTab?.appNaddr && (
              <div>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => {
                    onTogglePin(onOpenPinModal);
                  }}
                >
                  {ws.currentTab && ws.currentTab?.pinned ? "Unpin" : "Pin"}
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
                disabled={!ws.currentTab}
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
