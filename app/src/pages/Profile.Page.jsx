import React from "react";
import { Container, IconButton, styled } from "@mui/material";
import { CloseIcon } from "../assets";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../store/app-context";
import { Profile } from "../components/profile/Profile";
import { AnimatedContainer } from "../components/UI/AnimatedContainer";

const ProfilePage = () => {

  const contextData = useContext(AppContext);
  const { onModalClose } = contextData || {};

  const navigate = useNavigate();

  const navigateBackToMain = async () => {
    navigate("/", { replace: true })
    onModalClose();
  };
  return (
    <AnimatedContainer>
      <StyledContainer>
        <StyledHeader>
          <h1>My Profile</h1>
          <IconButton onClick={navigateBackToMain}>
            <CloseIcon />
          </IconButton>
        </StyledHeader>
        <Profile />
      </StyledContainer>
    </AnimatedContainer>
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
