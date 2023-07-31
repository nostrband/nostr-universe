const TITLE_STYLES = {
  small: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    fontSize: "0.8rem",
  },
  big: { overflow: "hidden", textOverflow: "ellipsis", fontSize: "1rem" },
};

export const IconButton = ({ data, onClick, size, openedTab }) => {
  const { title = "---", img = "" } = data;
  // const title = props.data?.title || props.data?.name;
  // const icon = props.data?.icon || props.data?.picture;
  const classes = `${openedTab ? "iconBtn active" : "iconBtn"} p-1 pb-0`;

  return (
    <button className={classes} onClick={onClick}>
      <img
        src={img}
        alt={title}
        className={size === "big" ? "iconImgBig" : "iconImgSmall"}
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
