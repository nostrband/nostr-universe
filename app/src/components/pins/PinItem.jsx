import { Avatar, styled } from "@mui/material";
import React from "react";

export const PinItem = ({ image = "", title = "", isActive }) => {
  return (
    <Container className="item">
      <Avatar className="pin_app_avatar" src={image}>
        {title[0]}
      </Avatar>
    </Container>
  );
};

const Container = styled("div")(() => {
  return {
    width: "100%",
    height: "100%",
    display: "grid",
    placeItems: "center",
    aspectRatio: "1 / 1", // Создаем квадратную форму
    "& .pin_app_avatar": {
      width: "94%",
      height: "auto",
      aspectRatio: "1",
      background: "red",
    },
  };
});
