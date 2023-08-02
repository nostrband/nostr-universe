import React from "react";
import { Modal } from "../UI/modal/Modal";
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  styled,
} from "@mui/material";
import {
  defaultUserImage,
  secondUserImage,
  thirdUserImage,
} from "../../assets";
import { getShortenText } from "../../utils/helpers/general";

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

export const AccountsMenu = ({ isOpen, onClose, accounts = [] }) => {
  console.log(accounts);

  return (
    <StyledModal
      isOpen={isOpen}
      onClose={onClose}
      fullScreen={false}
      classes={{ paper: "paper" }}
    >
      <MenuList className="menu">
        {accounts.map((account) => {
          return (
            <StyledMenuItem key={account}>
              <ListItemIcon className="profile_image">
                <img
                  src={DUMMY_PROFILE_IMAGES[getRandomNumber()]}
                  alt={account}
                />
              </ListItemIcon>
              <ListItemText className="username">
                {getShortenText(account)}
              </ListItemText>
            </StyledMenuItem>
          );
        })}
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

const StyledMenuItem = styled(MenuItem)(() => ({
  display: "flex",
  alignItems: "center",
  gap: "12px",
  padding: "12px 16px",
  "&:nth-of-type(even)": {
    background: "#606060",
  },
  "&:last-of-type": {
    borderBottomLeftRadius: "1rem",
    borderBottomRightRadius: "1rem",
  },
  "& .profile_image": {
    width: "40px",
    height: "40px",
  },
  "& .username": {
    "& > span": {
      fontFamily: "Outfit",
      color: "#fff",
      fontSize: "17px",
      fontWeight: 600,
    },
  },
}));
