import { useState, useEffect, useContext } from "react";
import { AiOutlineClose } from 'react-icons/ai'
import { fetchEventByBech32, stringToBech32 } from "../../nostr";
import { AppContext } from "../../store/app-context";
import { List, styled } from "@mui/material";
import { ToolsList } from "../profile/tools/ToolsList";

export const TabMenu = ({ onClose, onOpenWith }) => {

  const contextData = useContext(AppContext);
  const { workspaces, currentPubkey, apps } = contextData || {};

  const ws = workspaces.find((w) => w.pubkey === currentPubkey);
  const tab = ws.lastCurrentTab;
  
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

      // Event:
      if (id) {
	const event = await fetchEventByBech32(id);
	console.log("id", id, "event", event);
	setEvent(event);

	const tools = [
	  {
	    title: "Open with",
	    id: "open-with",
	    Icon: () => (<div></div>),
	    onClick: () => onOpenWith(id),
	  },
	];

	if (event.kind == 0 || event.kind == 1) {
	  tools.push({
	    title: "Zap",
	    id: "zap",
	    Icon: () => (<div></div>),
	    onClick: () => console.log("zap", id),
	  });
	}

	setTools(tools);
      }

      // Tab:
      
    };

    if (tab)
      load();
    else
      setUrl("");
    
  }, [tab]);
  
  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2 className="m-0">Tab Manu</h2>
        <AiOutlineClose color="white" size={30} onClick={onClose} />
      </div>
      <hr className="m-0" />
      <div className="m-3">
	<div className="d-flex flex-column p-3 justify-content-start align-items-start">
	  {!url && ("Loading...")}
	  {url && (
	    <div>
	      <div style={{overflowWrap: "break-word", width:"100%"}}>
		URL: {url}
	      </div>
	      {app && (
		<div>
		  App: {app.name}
		</div>
	      )}
	      {event && (
		<div>
		  <div style={{overflowWrap: "break-word", width:"100%"}}>
		    Event: {id}
		  </div>

		  <StyledList>
		    <ToolsList tools={tools} />
		  </StyledList>
		</div>
	      )}
	    </div>
	  )}
    
	    </div>
	    </div>
	    </div>
  );
};

const StyledList = styled(List)(() => ({
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));
