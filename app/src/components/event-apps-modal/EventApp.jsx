import { Badge, styled } from "@mui/material";
import { PinIcon } from "../../assets";
import { AppAvatar } from "./AppAvatar";

export const EventApp = ({ app = {}, isMenuItem = false, ...restProps }) => {
  const { picture, name, about, pinned, lastUsed } = app;
  return (
    <AppContainer {...restProps} boxshadow={isMenuItem}>
      <StyledBadge
        badgeContent={pinned && !isMenuItem ? <PinIcon /> : ""}
        classes={{ badge: "badge" }}
      >
        <AppAvatar name={name} picture={picture} />
      </StyledBadge>
      <Details>
        <h5>{name}</h5>
        <p className="description">{about}</p>
        {lastUsed && !isMenuItem && (
          <span className="last_used">Last used</span>
        )}
      </Details>
    </AppContainer>
  );
};

const AppContainer = styled("div")(({ boxshadow }) => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "0.5rem",
  cursor: "pointer",
  gap: "1rem",
  width: "100%",
  boxShadow: boxshadow ? "none" : "0px -4px 8px 0px #00000033",
  background: "#111111",
  borderRadius: "16px",
}));

const Details = styled("div")(() => ({
  width: "calc(100% - 56px - 1rem)",
  position: "relative",
  "& h5": {
    marginBottom: "0",
  },
  "& .description": {
    maxHeight: "1.3em",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: "95%",
    margin: 0,
    color: "#C9C9C9",
  },
  "& .last_used": {
    position: "absolute",
    top: 0,
    right: "0.5rem",
    fontSize: "0.8rem",
  },
}));

const StyledBadge = styled(Badge)(() => ({
  "& .badge": {
    right: "-5px",
  },
}));
