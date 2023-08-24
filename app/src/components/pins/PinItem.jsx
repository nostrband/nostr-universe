import React from "react";
import { Avatar, styled } from "@mui/material";
import { useErrorHandledImageURL } from "../../hooks/useErrorHandledImageURL";

export const PinItem = ({
  image = "",
  title = "",
  isActive,
  onClick,
  withTitle,
  active,
}) => {
  const { backgroundOnError, onImageError, url } =
    useErrorHandledImageURL(image);

  return (
    <Container className="item" onClick={onClick}>
      <AvatarContainer
        background={url ? "black" : backgroundOnError}
        active={active}
      >
        <Avatar
          className="pin_app_avatar"
          src={url}
          imgProps={{ onError: onImageError }}
        >
          {(title || "?").toUpperCase()[0]}
        </Avatar>
      </AvatarContainer>
      {withTitle && <p className="title">{title}</p>}
    </Container>
  );
};

const Container = styled("div")(() => ({
  "& .title": {
    fontFamily: "Outfit",
    fontSize: "0.875rem",
    textAlign: "center",
    color: "#fff",
    margin: "0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const AvatarContainer = styled("div")(({ background, active }) => ({
  width: "100%",
  display: "grid",
  placeItems: "center",
  aspectRatio: "1 / 1",
  "& .pin_app_avatar": {
    width: "94%",
    height: "auto",
    aspectRatio: "1",
    backgroundColor: background,
    backgroundClip: "padding-box",
    border: active
      ? "4px solid rgba(255, 0, 255, 0.6)"
      : "4px solid rgba(255, 255, 255, 0.1)",
    fontFamily: "Outfit",
    fontWeight: 600,
    borderRadius: "1rem",
  },
  "& .active1": {
    backgroundColor: "rgba(0, 0, 0, 0.1)",
    border: "4px solid rgba(0, 0, 0, 0.1)",
    borderRadius: "1rem",
  },
}));
