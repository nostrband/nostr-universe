import React from "react";
import { styled } from "@mui/material";

import { ProfileAvatar } from "./ProfileAvatar";
import { defaultUserImage } from "../../assets";
import { Tools } from "./tools/Tools";

export const Profile = () => {
  return (
    <Container>
      <ProfileAvatar username="Omega-50" profileImage={defaultUserImage} />
      <Tools />
    </Container>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));
