import React, { useContext } from "react";
import { nip19 } from "nostr-tools";
import Dropdown from "react-bootstrap/Dropdown";
import { BsFillPersonFill } from "react-icons/bs";
import { BiSolidPencil } from "react-icons/bi";
import Button from "react-bootstrap/Button";
import { getShortenText } from "../utils/helpers/general";
import { AppContext } from "../store/app-context";
import { Avatar, Container, Divider, IconButton, styled } from "@mui/material";
import {
  SearchIcon,
  MeatballsIcon,
  ServerIcon,
  WalletIcon,
  defaultUserImage,
} from "../assets";
import { useNavigate } from "react-router-dom";

const getRenderedKeys = (keys) => {
  if (!keys || keys.length === 0) {
    return [];
  }
  return keys.map((key) => nip19.npubEncode(key));
};

export const Header = ({ onOpenSearchModal, onOpenEditKeyModal }) => {
  const contextData = useContext(AppContext);
  const navigate = useNavigate();

  const { npub, keys, onAddKey, onSelectKey, setOpenKey } = contextData || {};

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
          src={defaultUserImage}
          onClick={navigateToProfilePage}
        />
        <Dropdown data-bs-theme="dark" drop="down-centered">
          <Dropdown.Toggle id="dropdown-basic" variant="secondary">
            {npub ? getShortenText(npub) : "Key is not chosen"}
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {renderedKeys.map((key, index) => {
              return (
                <Dropdown.Item
                  key={key}
                  href={`#/${key + 1}`}
                  className="d-flex align-items-center gap-4"
                >
                  <BsFillPersonFill color="white" size={35} />
                  <div
                    className="fs-3 text-white flex-grow-1"
                    onClick={() => onSelectKey(index)}
                  >
                    {getShortenText(key)}
                  </div>
                  <div onClick={() => editKeyHandler(index)}>
                    <BiSolidPencil
                      color="white"
                      size={26}
                      className=" pe-none "
                    />
                  </div>
                </Dropdown.Item>
              );
            })}
            {renderedKeys && <Dropdown.Divider />}
            <Dropdown.Item
              href="#/action-15"
              className=" d-flex justify-content-center  "
            >
              <Button variant="secondary" size="lg" onClick={onAddKey}>
                + Add keys
              </Button>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <ActionsContainer>
          <StyledIconButton>
            <ServerIcon />
          </StyledIconButton>
          <StyledIconButton>
            <WalletIcon />
          </StyledIconButton>
          <StyledIconButton onClick={onOpenSearchModal}>
            <SearchIcon />
          </StyledIconButton>
          <StyledIconButton>
            <MeatballsIcon />
          </StyledIconButton>
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
