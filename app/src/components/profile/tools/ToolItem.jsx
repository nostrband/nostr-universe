import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  styled,
} from "@mui/material";
import React from "react";

export const ToolItem = ({ id, onClick, Icon, title }) => {
  return (
    <StyledListItem onClick={() => onClick && onClick(id)}>
      <ListItemIcon className="list-item_icon">
        <Icon />
      </ListItemIcon>
      <ListItemText className="tool-title">{title}</ListItemText>
    </StyledListItem>
  );
};

const StyledListItem = styled(ListItemButton)(() => ({
  padding: "0",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  "& .list-item_icon": {
    width: "40px",
    height: "40px",
    minWidth: "auto",
    display: "grid",
    placeItems: "center",
    background: "#222222",
    borderRadius: "50%",
  },
  "& .tool-title > span": {
    fontSize: "17px",
    fontFamily: "inherit",
    fontWeight: 600,
  },
}));
