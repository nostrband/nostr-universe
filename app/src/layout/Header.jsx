import React, { useContext } from "react";
import { getProfileImage } from "../utils/helpers/general";
import { AppContext } from "../store/app-context";
import { Avatar, Container, Divider, IconButton, styled } from "@mui/material";
import { SearchIcon, MeatballsIcon, SecondaryCloseIcon } from "../assets";
import { useNavigate } from "react-router-dom";

export const Header = ({
  onSearchClick,
  onOpenTabMenuModal,
  searchMode = false,
  onClose = () => {},
}) => {
  const contextData = useContext(AppContext);
  const navigate = useNavigate();

  const { currentTab, profile, onModalOpen, clearLastCurrentTab } = contextData || {};

  const navigateToProfilePage = async () => {
    await onModalOpen();
    clearLastCurrentTab();
    navigate("/profile");
  };

  return (
    <header id="header">
      <StyledContainer>
        <StyledAvatar
          alt="Default User"
          src={getProfileImage(profile?.profile)}
          onClick={navigateToProfilePage}
        />
        <ActionsContainer>
          {/* <StyledIconButton>
              <ServerIcon />
              </StyledIconButton>
              <StyledIconButton>
              <WalletIcon onClick />
              </StyledIconButton> */}
          {!searchMode && (
            <StyledIconButton onClick={onSearchClick}>
              <SearchIcon />
            </StyledIconButton>
          )}
          {currentTab && (
            <StyledIconButton onClick={onOpenTabMenuModal}>
              <MeatballsIcon />
            </StyledIconButton>
          )}

          {searchMode && (
            <StyledIconButton onClick={onClose}>
              <SecondaryCloseIcon />
            </StyledIconButton>
          )}
        </ActionsContainer>
      </StyledContainer>
      <StyledDivider />
    </header>
  );
};

const StyledContainer = styled(Container)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
}));

const StyledAvatar = styled(Avatar)(() => ({
  width: "36px",
  height: "36px",
  cursor: "pointer",
}));

const ActionsContainer = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
}));

const StyledIconButton = styled(IconButton)(() => ({
  width: "44px",
  height: "44px",
  "&:hover": {
    backgroundColor: "rgba(251, 251, 251, 0.08)",
  },
}));

const StyledDivider = styled(Divider)(() => ({
  borderWidth: "1px",
  borderColor: "#171717",
  opacity: 1,
}));
