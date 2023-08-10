import { useState, useEffect, useContext } from "react";
import { AiOutlineClose } from 'react-icons/ai'
import { fetchAppsForEvent } from "../../nostr";
import { AppContext } from "../../store/app-context";

export const EventApps = ({ addr, onClose, onSelect }) => {

  const contextData = useContext(AppContext);
  const { onOpenApp } = contextData || {};
  
  const [apps, setApps] = useState([]);

  useEffect(() => {

    const load = async () => {
      console.log("addr", addr);
      const info = await fetchAppsForEvent(addr);
      // FIXME convert info to apps
      console.log("info", info);

      const apps = [];
      for (const id in info.apps) {
	const app = info.apps[id].handlers[0];
	if (!app.eventUrl)
	  continue;

	apps.push({
	  naddr: app.naddr,
	  url: app.eventUrl,
	  name: app.profile?.display_name || app.profile?.name,
	  about: app.profile?.about || "",
	  picture: app.profile?.picture,
	  order: app.order || apps.length,
	});
      }

      // FIXME attach 'pinned' state, sort pinned-first

      apps.sort((a, b) => b.order - a.order);
      
      console.log("apps", apps);
      setApps(apps);
    };

    if (addr)
      load();
    else
      setApps([]);
    
  }, [addr]);

  const onOpen = (url, app) => {
    onSelect();
    onOpenApp(url, app);
  }
  
  return (
    <div className="d-flex flex-column">
      <div className="d-flex justify-content-between align-items-center p-3">
        <h2 className="m-0">Select App</h2>
        <AiOutlineClose color="white" size={30} onClick={onClose} />
      </div>
      <hr className="m-0" />
      <div className="m-3">
	<div className="d-flex flex-column p-3 justify-content-start align-items-start">
	  {!apps.length && ("Loading...")}
	  {apps.map((app) => (
	    <div key={app.naddr} className="d-flex p-2 justify-content-start align-items-center"
	      style={{cursor:"pointer"}} onClick={() => onOpen(app.url, app)}>
	      <button className="iconBtn">
		<img
		  src={app.picture}
		  alt={app.name}
		  className="iconImgBig"
		/>
	      </button>
	      <div className="ms-3">
		<h5>{app.name}</h5>
		<div style={{maxHeight: "1.3em", overflow: "hidden", textOverflow: "ellipsis"}}>{app.about}</div>
	      </div>
	    </div>
	  ))}
	</div>
      </div>
    </div>
  );
};
