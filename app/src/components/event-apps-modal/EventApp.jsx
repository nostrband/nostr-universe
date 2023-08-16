import { useMemo } from "react";
import { renderDefaultAppIcon } from "../../utils/helpers/general";
import { Avatar, styled } from "@mui/material";

export const EventApp = ({ app, ...restProps }) => {
  const { picture, name, about } = app;

  const defaultIcon = useMemo(() => {
    return renderDefaultAppIcon(name);
  }, [name]);

  const renderedName = (name || "?").toUpperCase()[0];

  return (
    <AppContainer {...restProps}>
      <Avatar
        className="app_avatar"
        src={picture || defaultIcon}
        alt={name}
        imgProps={{
          onError: (e) => {
            e.currentTarget.src = defaultIcon;
          },
        }}
        variant="square"
      >
        {renderedName}
      </Avatar>
      <Details>
        <h5>{name}</h5>
        <p className="description">{about}</p>
      </Details>
    </AppContainer>
  );
};

const AppContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "0.5rem",
  cursor: "pointer",
  gap: "1rem",
  width: "100%",
  "& .app_avatar": {
    width: 56,
    height: 56,
    borderRadius: "1rem",
  },
}));

const Details = styled("div")(() => ({
  width: "100%",
  "& .description": {
    maxHeight: "1.3em",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
    overflow: "hidden",
    maxWidth: "calc(95% - 56px)",
  },
}));
