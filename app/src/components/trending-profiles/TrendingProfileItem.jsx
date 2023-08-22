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
    about,
  } = props.profile || {};
  const isShowSkeleton = name === null;

  const renderedName = isShowSkeleton
    ? ""
    : crop(name || display_name || npub, 15);

  const pictureSource = picture || "";
  // it’s not in design
  // const about = crop(props.profile?.about || "", 25);

  return (
    <Card
      classes={{ disabled: "disabled" }}
      disabled={isShowSkeleton}
      onClick={() => props.onClick(pubkey)}
    >
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
        <>
          <Typography className="username">{renderedName}</Typography>
          <Typography className="about">{about || ""}</Typography>
        </>
      )}

      {false && (
        <StyledIconButton
          disabled={isShowSkeleton}
          onClick={() => props.onClick(pubkey)}
          classes={{ disabled: "disabled" }}
        >
          <PlusIcon />
        </StyledIconButton>
      )}
    </Card>
  );
};

const Card = styled("div")(() => ({
  padding: "0.75rem 0",
  borderRadius: "24px",
  backgroundColor: "#222222",
  minHeight: "148px",
  minWidth: "145px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
  marginRight: "0.75rem",
  "&:first-of-type": {
    marginLeft: "0.75rem",
  },
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
  "& .about": {
    fontFamily: "Outfit",
    fontSize: "0.8rem",
    fontWeight: 200,
    color: "#fff",
    width: "86%",
    textAlign: "center",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    WebkitLineClamp: "2",
    WebkitBoxOrient: "vertical",
    color: "#C9C9C9",
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
