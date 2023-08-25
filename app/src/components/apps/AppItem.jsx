import React from "react";
import { styled } from "@mui/material";
import { IconButton } from "../UI/IconButton";

export const AppItem = ({ app, onOpenApp }) => {
  return (
    <Card onClick={() => onOpenApp(app)}>
      <IconButton
        key={app.url}
        data={{ ...app, title: app.name, img: app.picture }}
        size="big"
      />
    </Card>
  );
};

// from TrendingProfileItem
const Card = styled("div")(() => ({
  padding: "0.75rem 0",
  borderRadius: "24px",
  backgroundColor: "#222222",
  minHeight: "100px",
  minWidth: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  marginRight: "0.75rem",
  "&:first-of-type": {
    marginLeft: "0.75rem",
  }
}));
