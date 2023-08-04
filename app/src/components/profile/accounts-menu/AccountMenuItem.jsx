import React from "react";
import { ListItemIcon, ListItemText, MenuItem, styled } from "@mui/material";
import { CheckMarkIcon } from "../../../assets";

export const AccountMenuItem = ({
  username = "",
  profileImage = "",
  disabled,
  onClick,
  centeredText = false,
  isCurrentUser = false,
  ...restProps
}) => {
  return (
    <StyledMenuItem disabled={disabled} onClick={onClick} {...restProps}>
      {profileImage && (
        <ListItemIcon className="profile_image">
          <img src={profileImage} alt={username} />
        </ListItemIcon>
      )}
      <ListItemText className={`username ${centeredText ? "centered" : ""}`}>
        {username}
      </ListItemText>
      {isCurrentUser && (
        <ListItemIcon>
          <CheckMarkIcon />
        </ListItemIcon>
      )}
    </StyledMenuItem>
  );
};

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
    img: {
      objectFit: "contain",
      borderRadius: "50%",
    },
  },
  "& .username": {
    "&.centered": {
      textAlign: "center",
    },
    "& > span": {
      fontFamily: "Outfit",
      color: "#fff",
      fontSize: "17px",
      fontWeight: 600,
    },
  },
}));
