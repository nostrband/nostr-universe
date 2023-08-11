import React, { useContext } from "react";
import { nip19 } from "@nostrband/nostr-tools";
import Dropdown from "react-bootstrap/Dropdown";
import { BsFillPersonFill } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import { getProfileImage, getShortenText } from "../utils/helpers/general";
import { AppContext } from "../store/app-context";
import { Avatar, Container, Divider, IconButton, styled } from "@mui/material";
import { SearchIcon, MeatballsIcon, ServerIcon, WalletIcon } from "../assets";
import { useNavigate } from "react-router-dom";

const getRenderedKeys = (keys) => {
  if (!keys || keys.length === 0) {
    return [];
  }
  return keys.map((key) => nip19.npubEncode(key));
};

export const Header = ({
  onOpenSearchModal,
  onOpenEditKeyModal,
  onOpenTabMenuModal,
}) => {
  const contextData = useContext(AppContext);
  const navigate = useNavigate();

  const {
    currentTab,
    keys,
    profile,
    onAddKey,
    onSelectKey,
    setOpenKey,
  } = contextData || {};

  const renderedKeys = getRenderedKeys(keys);

  const editKeyHandler = (index) => {
    onOpenEditKeyModal();
    setOpenKey(keys[index]);
  };

  const navigateToProfilePage = () => {
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
          {false && (
            <>
              <StyledIconButton>
                <ServerIcon />
              </StyledIconButton>
              <StyledIconButton>
                <WalletIcon />
              </StyledIconButton>
            </>
          )}
          <StyledIconButton onClick={onOpenSearchModal}>
            <SearchIcon />
          </StyledIconButton>
          {currentTab && (
            <StyledIconButton onClick={onOpenTabMenuModal}>
              <MeatballsIcon />
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
