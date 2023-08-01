import React from "react";
import { styled } from "@mui/material";

import { Tools } from "./Tools";
import { ProfileAvatar } from "./ProfileAvatar";

export const Profile = () => {
  return (
    <Container>
      <ProfileAvatar />
      <Tools />
    </Container>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));
