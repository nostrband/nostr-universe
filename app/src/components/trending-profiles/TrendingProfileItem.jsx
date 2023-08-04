import {
  Avatar,
  IconButton,
  Skeleton,
  Typography,
  styled,
} from "@mui/material";
import { PlusIcon } from "../../assets";

const crop = (s, n) => {
  if (s.length > n) return s.trim().substring(0, n - 1) + "...";
  return s.trim();
};

export const TrendingProfileItem = (props) => {
  const {
    npub = "",
    pubkey = "",
    name,
    display_name,
    picture,
  } = props.profile || {};
  const isShowSkeleton = name === null;

  const renderedName = isShowSkeleton
    ? ""
    : crop(name || display_name || npub, 15);

  const pictureSource = picture || "";
  // it’s not in design
  // const about = crop(props.profile?.about || "", 25);

  return (
    <Card>
      {isShowSkeleton ? (
        <StyledSkeleton variant="circular" width={48} height={48} />
      ) : (
        <Avatar src={pictureSource} className="avatar">
          {renderedName}
        </Avatar>
      )}
      {isShowSkeleton ? (
        <StyledSkeleton variant="text" className="text" />
      ) : (
        <Typography className="username">{renderedName}</Typography>
      )}

      <StyledIconButton
        disabled={isShowSkeleton}
        onClick={() => props.onClick(pubkey)}
        classes={{ disabled: "disabled" }}
      >
        <PlusIcon />
      </StyledIconButton>
    </Card>
  );
};

const Card = styled("div")(() => ({
  padding: "0.75rem 0",
  borderRadius: "24px",
  backgroundColor: "#222222",
  minHeight: "148px",
  minWidth: "115px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "10px",
  marginRight: "0.75rem",
  "& .avatar": {
    width: "48px",
    height: "48px",
  },
  "& .username": {
    fontFamily: "Outfit",
    fontSize: "1rem",
    fontWeight: 600,
    color: "#fff",
    width: "86%",
    whiteSpace: "nowrap",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
}));

const StyledIconButton = styled(IconButton)(() => ({
  "&, &:hover, &:active": {
    background: "#CF82FF",
  },
  "&.disabled": {
    background: "#cf82ffc8",
  },
}));

const StyledSkeleton = styled(Skeleton)(() => ({
  background: "rgba(255,255,255,0.3)",
  "&.text": {
    width: "70%",
    fontSize: "1rem",
  },
}));
