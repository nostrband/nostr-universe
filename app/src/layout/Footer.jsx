import React, { useContext } from "react";

import Button from "react-bootstrap/esm/Button";
import { AppContext } from "../store/app-context";
import { IconButton } from "../components/UI/IconButton";

export const Footer = ({ onOpenPinModal }) => {
  const contextData = useContext(AppContext);
  const {
    workspaces,
    currentPubkey,
    onOpenTab,
    onCloseTab,
    onHideTab,
    onShowTabs,
    pins,
    onTogglePin,
    open: onOpenPin,
    currentTab,
    prevTab,
    onSwitchTabs,
  } = contextData || {};

  const ws = workspaces.find((w) => w.pubkey == currentPubkey);

  return (
    <footer id="footer">
      <hr className="m-0" />
      <div id="pins" className="container d-flex align-items-center gap-2 p-1">
        {ws &&
          ws.pins.map((p) => (
            <IconButton
              key={Math.random()}
              data={{ ...p, img: p.icon }}
              size="small"
              onClick={() => onOpenPin(p.url, p)}
            />
          ))}
        {ws &&
          ws.tabs.map((t) => (
            <IconButton
              key={t.id}
              data={{ ...t, img: t.icon }}
              size="small"
              onClick={() => onOpenTab(t)}
            />
          ))}
      </div>
      {ws && (
        <div
          id="tab-menu"
          className="container d-none justify-content-end gap-1"
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
    </footer>
  );
};
