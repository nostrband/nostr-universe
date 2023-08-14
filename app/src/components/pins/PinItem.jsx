import { Avatar, styled } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function getRandomColor() {
  const minBrightness = 50;
  const randomBrightness =
    Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
  const purpleHex = randomBrightness.toString(16).padStart(2, "0");
  return `#800080${purpleHex}`;
}

export const PinItem = ({
  image = "",
  title = "",
  isActive,
  onClick,
  withTitle,
}) => {
  const [url, setUrl] = useState("");
  const colorRef = useRef(getRandomColor());

  useEffect(() => {
    setUrl(image);
  }, [image]);

  const errorHandler = () => setUrl("");

  return (
    <Container className="item" onClick={onClick}>
      <AvatarContainer background={url ? "black" : colorRef.current}>
        <Avatar
          className="pin_app_avatar"
          src={url}
          imgProps={{ onError: errorHandler }}
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

const AvatarContainer = styled("div")(({ background }) => ({
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
    border: "4px solid rgba(255, 255, 255, 0.1)",
    fontFamily: "Outfit",
    fontWeight: 600,
    borderRadius: "1rem",
  },
}));
