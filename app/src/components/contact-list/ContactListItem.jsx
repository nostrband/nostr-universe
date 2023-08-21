import {
  Avatar,
  Skeleton,
  Typography,
  styled,
} from "@mui/material";

export const ContactListItem = (props) => {
  const {
    npub = "",
    pubkey = "",
    name,
    display_name,
    picture
  } = props.profile || {};
  const isShowSkeleton = name === null;

  const renderedName = isShowSkeleton
    ? ""
    : (name || display_name || npub);

  const pictureSource = picture || "";

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
	</>
      )}
    </Card>
  );
};

const Card = styled("div")(() => ({
  padding: "0.75rem 0.3rem",
  borderRadius: "24px",
  backgroundColor: "#222222",
  minHeight: "100px",
  minWidth: "100px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "5px",
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

const StyledSkeleton = styled(Skeleton)(() => ({
  background: "rgba(255,255,255,0.3)",
  "&.text": {
    width: "70%",
    fontSize: "1rem",
  },
}));
