import React from "react";
import { Container, IconButton, styled } from "@mui/material";
import { CloseIcon } from "../assets";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Profile } from "../components/profile/Profile";

const ANIMATION_VARIANTS = {
  initial: { x: "-100%", opacity: 0 },
  mount: { x: 0, opacity: 1 },
  exit: { x: "-100%", opacity: 0 },
};

const ProfilePage = () => {
  const navigate = useNavigate();

  const navigateBackToMain = () => navigate("/");
  return (
    <motion.div
      initial="initial"
      animate="mount"
      exit={"exit"}
      variants={ANIMATION_VARIANTS}
      transition={{ duration: 0.2 }}
      style={{ height: "100%" }}
    >
      <StyledContainer>
        <StyledHeader>
          <h1>My Profile</h1>
          <IconButton onClick={navigateBackToMain}>
            <CloseIcon />
          </IconButton>
        </StyledHeader>
        <Profile />
      </StyledContainer>
    </motion.div>
  );
};

export default ProfilePage;

const StyledContainer = styled(Container)(() => ({
  paddingTop: "6px",
  display: "flex",
  flexDirection: "column",
  height: "90%",
  "@media (orientation: landscape) and (max-width: 600px)": {
    height: "150%",
  },
}));

const StyledHeader = styled("header")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: "11.5px",
  h1: {
    fontWeight: 500,
    fontSize: "28px",
  },
}));
