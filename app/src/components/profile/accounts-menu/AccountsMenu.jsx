import React from "react";
import { Modal } from "../../UI/modal/Modal";
import {
  Divider,
  IconButton,
  MenuItem,
  MenuList,
  Typography,
  styled,
} from "@mui/material";
import { getNpub, getRenderedUsername } from "../../../utils/helpers/general";
import { AccountMenuItem } from "./AccountMenuItem";
import { PlusIcon, defaultUserImage } from "../../../assets";

const checkIsCurrentUser = (npub, account) => {
  if (account && account?.pubkey) {
    return npub === getNpub(account.pubkey);
  }
  return false;
};

export const AccountsMenu = ({
  isOpen,
  onClose,
  accounts = [],
  currentUserNpub = "",
  onChangeAccount,
  onAddKey,
  onImportPubkey
}) => {
  const renderMenuContent = () => {
    if (accounts.length === 0) {
      return <AccountMenuItem username={"No accounts"} disabled centeredText />;
    }
    return accounts.map((account, index) => {
      return (
        <AccountMenuItem
          key={index}
          profileImage={account.profile?.picture || ""}
          username={getRenderedUsername(account.profile, account.pubkey)}
          isCurrentUser={checkIsCurrentUser(currentUserNpub, account)}
          onClick={() => onChangeAccount(account.pubkey)}
          pubkey={account.pubkey}
	  readOnly={account.readOnly}
        />
      );
    });
  };

  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={false}
      classes={{ paper: "paper" }}
    >
      <MenuList className="menu">
        {renderMenuContent()}
        <StyledDivider light />
        <AddKeyMenuItem disabled classes={{ disabled: "disabled" }}>
          <StyledIconButton onClick={onImportPubkey}>
            <PlusIcon />
          </StyledIconButton>
          <Typography className="add_key_label">Add read-only key</Typography>
        </AddKeyMenuItem>
        <StyledDivider light />
        <AddKeyMenuItem disabled classes={{ disabled: "disabled" }}>
          <StyledIconButton onClick={onAddKey}>
            <PlusIcon />
          </StyledIconButton>
          <Typography className="add_key_label">Add private key</Typography>
        </AddKeyMenuItem>
      </MenuList>
    </StyledModal>
  );
};

const StyledModal = styled(Modal)(() => ({
  "& .paper": {
    maxWidth: "100%",
    width: "100%",
    margin: "1rem",
    "& .menu": {
      background: "#3D3D3D",
      borderRadius: "1rem",
      padding: "0",
    },
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  "&, &:hover, &:active": {
    background: "#CF82FF",
  },
  "&.disabled": {
    background: "#cf82ffc8",
  },
  "& svg, & path": {
    fill: "#fff",
  },
}));

const AddKeyMenuItem = styled(MenuItem)(() => ({
  "&.disabled": {
    opacity: 1,
    pointerEvents: "initial",
  },
  display: "flex",
//  justifyContent: "center",
  padding: "0.8rem 1rem",
  "& .add_key_label": {
    fontFamily: "Outfit",
    marginLeft: "1rem",
  },
}));

const StyledDivider = styled(Divider)(() => ({
  margin: "0 !important",
  borderColor: "white",
}));
