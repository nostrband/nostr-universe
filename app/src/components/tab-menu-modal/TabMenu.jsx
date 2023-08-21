import { useState, useEffect, useContext } from "react";
import { AiOutlineClose } from "react-icons/ai";
import {
  fetchEventByBech32,
  stringToBech32,
  launchZapDialog,
} from "../../nostr";
import { AppContext } from "../../store/app-context";
import { Tools } from "../profile/tools/Tools";
import {
  openWithIcon,
  zapIcon,
  pinIcon,
  unpinIcon,
  closeIcon,
} from "../../assets";

export const TabMenu = ({ onClose, onOpenWith, onOpenPinAppModal }) => {
  const contextData = useContext(AppContext);
  const { lastCurrentTab, onCloseTab, pinTab, unpinTab, apps } =
    contextData || {};

  const tab = lastCurrentTab;

  const [url, setUrl] = useState("");
  const [app, setApp] = useState(null);
  const [id, setId] = useState("");
  const [event, setEvent] = useState(null);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    const load = async () => {
      const id = stringToBech32(tab.url);
      setId(id);

      // URL:
      setUrl(tab.url);

      // App:
      if (tab.appNaddr) {
        const app = apps.find((a) => a.naddr == tab.appNaddr);
        setApp(app);
      }

      const tools = [];

      const onClick = (cb) => {
        onClose();
        setTimeout(cb, 0);
      };

      tools.push({
        title: "Close tab",
        id: "close-tab",
        Icon: () => <img width={23} height={23} src={closeIcon} />,
        onClick: () => onClick(onCloseTab),
      });

      if (tab.pinned) {
        tools.push({
          title: "Unpin",
          id: "unpin",
          Icon: () => <img width={23} height={23} src={unpinIcon} />,
          onClick: () => onClick(unpinTab),
        });
      } else {
        tools.push({
          title: "Pin",
          id: "pin",
          Icon: () => <img width={23} height={23} src={pinIcon} />,
          onClick: () => onClick(() => pinTab(onOpenPinAppModal)),
        });
      }

      setTools(tools);

      // Event:
      if (id) {
        const getEvent = async () => {
          const event = await fetchEventByBech32(id);
          console.log("id", id, "event", event);
          setEvent(event);

          tools.push({
            title: "Open with",
            id: "open-with",
            Icon: () => <img width={23} height={23} src={openWithIcon} />,
            onClick: () => onClick(() => onOpenWith(id)),
          });

          if (event.kind == 0 || event.kind == 1) {
            tools.push({
              title: "Zap",
              id: "zap",
              Icon: () => <img width={23} height={23} src={zapIcon} />,
              onClick: () => launchZapDialog(id, event),
            });
          }

          setTools(tools);
        };

        // async load
        getEvent();
      }
    };

    if (tab) load();
    else setUrl("");
  }, [tab]);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2 className="m-0">Tab Menu</h2>
        <AiOutlineClose color="white" size={30} onClick={onClose} />
      </div>
      <hr className="m-0" />
      <div className="m-3">
        <div className="d-flex flex-column p-3 justify-content-start align-items-start">
          {!url && "Loading..."}
          {url && (
            <div style={{ maxWidth: "100%" }}>
              <div style={{ overflowWrap: "break-word", width: "100%" }}>
                URL: {url}
              </div>
              {app && <div>App: {app.name}</div>}
              {event && (
                <div style={{ overflowWrap: "break-word", width: "100%" }}>
                  Event: {id}
                </div>
              )}

              <Tools tools={tools} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
