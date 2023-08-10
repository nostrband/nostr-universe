import { useMemo } from 'react'
import { renderDefaultAppIcon } from '../../utils/helpers/general'

export const EventApp = ({ app, onOpen }) => {
  const { naddr, url, picture, name, about } = app;

  const defaultIcon = useMemo(() => {
    return renderDefaultAppIcon(name);
  }, [name]);
  
  return (
    <div key={naddr} className="d-flex p-2 justify-content-start align-items-center"
      style={{cursor:"pointer"}} onClick={() => onOpen(url, app)}>
      <button className="iconBtn">
	<img
          src={picture ? picture : defaultIcon}
	  alt={name}
	  className="iconImgBig"
	  onError={(e) => { e.target.src = defaultIcon; }}
	/>
      </button>
      <div className="ms-3">
	<h5>{name}</h5>
	<div style={{maxHeight: "1.3em", overflow: "hidden", textOverflow: "ellipsis"}}>{about}</div>
      </div>
    </div>
  );
};
