import { useState, useEffect } from "react";
import { AiOutlineClose } from 'react-icons/ai'
import { fetchEventByBech32, stringToBech32 } from "../../nostr";
import { Tools } from "../profile/tools/Tools";
import {
  openWithIcon,
  zapIcon,
} from "../../assets";

export const ContextMenu = ({ input, onClose, onOpenWith }) => {
  
  const [id, setId] = useState("");
  const [event, setEvent] = useState(null);
  const [tools, setTools] = useState([]);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {

    const load = async () => {

      const id = stringToBech32(input);
      setId(id);

      // Event:
      if (id) {
	const event = await fetchEventByBech32(id);
	console.log("id", id, "event", event);
	setEvent(event);

	const onAction = (action) => {
	  console.log("context action", action, "id", id);
	  if (!id)
	    return;

	  switch (action) {
	    case "open-with":
	      onOpenWith(id, event);
	      break;
	  }
	}

	const tools = [
	  {
	    title: "Open with",
	    id: "open-with",
	    Icon: () => (<img width={23} height={23} src={openWithIcon} />),
	    onClick: onAction,
	  },
	];

	if (event.kind == 0 || event.kind == 1) {
	  tools.push({
	    title: "Zap",
	    id: "zap",
	    Icon: () => (<img width={23} height={23} src={zapIcon} />),
	    onClick: onAction,
	  });
	}

	setTools(tools);
      }
    };

    if (input)
      load();
    else
      setId("");

  }, [input]);

  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2 className="m-0">Context Menu</h2>
        <AiOutlineClose color="white" size={30} onClick={onClose} />
      </div>
      <hr className="m-0" />
      <div className="m-3">
	<div className="d-flex flex-column p-3 justify-content-start align-items-start">
	  {!id && ("Loading...")}
	  {id && (
	    <div style={{maxWidth:"100%"}}>
	      {!event && (<>Id: {id}</>)}
	      {event && (
		<div>
		  <div style={{overflowWrap: "break-word", width:"100%"}}>
		    Event: {id}
		  </div>

		  <Tools tools={tools} />
		</div>
	      )}
	    </div>
	  )}
	  
	</div>
      </div>
    </div>
  );
};
