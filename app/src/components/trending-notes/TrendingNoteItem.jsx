import React from "react";
import { Avatar, styled } from "@mui/material";
import { getNpub, getShortenText, isGuest } from "../../utils/helpers/general";

const getRenderedUsername = (profile, pubkey) => {
  return (
    profile?.display_name ||
    profile?.name ||
    (isGuest(pubkey) ? "Guest" : getShortenText(getNpub(pubkey)))
  );
};

export const TrendingNoteItem = ({ author, content }) => {
  const renderedName = getRenderedUsername(author, author.pubkey);
  return (
    <Card>
      <Header>
        <StyledAvatar alt={renderedName} src={author.picture} />
        <span>{renderedName}</span>
      </Header>
      <DescriptionText>{content.content}</DescriptionText>
    </Card>
  );
};
const Card = styled("div")(() => ({
  padding: "0.5rem 0.75rem 0.75rem",
  borderRadius: "1rem",
  backgroundColor: "#222222",
  minHeight: "116px",
  minWidth: "223px",
  maxHeight: "116px",
  maxWidth: "223px",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  marginRight: "0.75rem",
  "&:first-of-type": {
    marginLeft: "0.75rem",
  },
}));

const Header = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  width: "100%",
  flex: "1",
  gap: "0.5rem",
  span: {
    fontSize: "0.875rem",
    fontWeight: 600,
  },
}));

const DescriptionText = styled("p")(() => ({
  flex: "3",
  overflow: "hidden",
  margin: "0",
  textOverflow: "ellipsis",
  display: "-webkit-box",
  "-webkitLineClamp": "3",
  "-webkitBoxOrient": "vertical",
  fontSize: "0.875rem",
  fontWeight: 500,
  lineHeight: "19.6px",
  color: "#C9C9C9",
  minHeight: "60px",
}));

const StyledAvatar = styled(Avatar)(() => ({
  maxWidth: "32px",
  maxHeight: "32px",
}));
