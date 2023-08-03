import React from "react";
import { Modal } from "../../UI/modal/Modal";
import { MenuList, styled } from "@mui/material";
import {
  defaultUserImage,
  secondUserImage,
  thirdUserImage,
} from "../../../assets";
import { getShortenText } from "../../../utils/helpers/general";
import { AccountMenuItem } from "./AccountMenuItem";

const DUMMY_PROFILE_IMAGES = [
  defaultUserImage,
  secondUserImage,
  thirdUserImage,
];

function getRandomNumber() {
  const random = Math.random();
  const scaled = random * 3;
  const rounded = Math.floor(scaled);

  return rounded;
}

export const AccountsMenu = ({
  isOpen,
  onClose,
  accounts = [],
  currentUsername = "",
  onChangeAccount,
}) => {
  const renderMenuContent = () => {
    if (accounts.length === 0) {
      return <AccountMenuItem username={"No accounts"} disabled centeredText />;
    }
    return accounts.map((account, index) => {
      return (
        <AccountMenuItem
          key={account}
          profileImage={DUMMY_PROFILE_IMAGES[getRandomNumber()]}
          username={getShortenText(account)}
          isCurrentUser={account === currentUsername}
          onClick={() => onChangeAccount(index)}
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
      <MenuList className="menu">{renderMenuContent()}</MenuList>
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
