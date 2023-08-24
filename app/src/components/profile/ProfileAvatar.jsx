import React from "react";
import { Avatar, Badge, Button, IconButton, styled } from "@mui/material";
import { SwitchIcon } from "../../assets";

export const ProfileAvatar = ({ username, profileImage, onOpenChangeAccountModal, isGuest, onAddKey }) => {
  return (
    <>
      <ProfileBanner />
      <AvatarContainer>
        <StyledBadge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <SwitchAccountButton>
              <SwitchIcon />
            </SwitchAccountButton>
          }
          componentsProps={{
            badge: {
              onClick: onOpenChangeAccountModal,
            },
          }}
        >
          <Avatar src={profileImage} alt={username} className="avatar" />
        </StyledBadge>
        <h2 className="username">{username || "..."}</h2>
        <Button variant="contained" className="edit_button" onClick={isGuest ? onAddKey : undefined}>
          {isGuest && (<>Add keys</>)}
	  {!isGuest && (<>LATER</>)}
        </Button>
      </AvatarContainer>
    </>
  );
};

const AvatarContainer = styled("div")(() => ({
  flex: "1",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
  gap: "12px",
  "& .avatar": {
    width: "67px",
    height: "67px",
    border: "3px solid #FFFFFF",
  },
  "& .username": {
    fontWeight: 600,
    fontSize: "28px",
    minHeight: "2rem",
  },
  "& .edit_button": {
    background: "#363636",
    fontFamily: "inherit",
    fontSize: "17px",
    fontWeight: 600,
    textTransform: "initial",
    padding: "4px auto",
    borderRadius: "72px",
    minWidth: "115px",
    "&:hover, &:active": {
      background: "#363636",
    },
  },
}));

const StyledBadge = styled(Badge)(() => ({
  marginTop: "-2rem",
}));

const SwitchAccountButton = styled(IconButton)(() => ({
  "&, &:hover, &:active": {
    background: "#CF82FF",
  },
}));

const ProfileBanner = styled("div")(() => ({
  width: "100%",
  borderRadius: "24px",
  background:
    "linear-gradient(45deg, rgba(238,59,255,1) 0%, rgba(121,9,95,1) 35%, rgba(117,0,255,1) 100%)",
  flex: "1.2",
}));
