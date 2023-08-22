import { useMemo } from "react";
import { renderDefaultAppIcon } from "../../utils/helpers/general";

const TITLE_STYLES = {
  small: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.8rem",
    margin: "0",
  },
  big: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "80px",
    fontSize: "1rem",
    margin: "0",
  },
};

export const IconButton = ({ data, onClick, size, openedTab }) => {
  const { title = "---", img = "" } = data;
  // const title = props.data?.title || props.data?.name;
  // const icon = props.data?.icon || props.data?.picture;
  const classes = `${openedTab ? "iconBtn active" : "iconBtn"} p-1 pb-0`;

  const defaultIcon = useMemo(() => {
    return renderDefaultAppIcon(title);
  }, [title]);

  return (
    <button className={classes} onClick={onClick}>
      <img
        src={img ? img : defaultIcon}
        alt={title}
        className={size === "big" ? "iconImgBig" : "iconImgSmall"}
        onError={(e) => {
          e.target.src = defaultIcon;
        }}
      />
      {size === "big" && (
        <h5 className="iconTitle" style={TITLE_STYLES[size]}>
          {title}
        </h5>
      )}
      {size === "small" && (
        <div className="iconTitle" style={TITLE_STYLES[size]}>
          {title}
        </div>
      )}
    </button>
  );
};
