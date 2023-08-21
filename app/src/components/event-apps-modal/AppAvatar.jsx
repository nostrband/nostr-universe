import React, { useMemo } from "react";
import { renderDefaultAppIcon } from "../../utils/helpers/general";
import { Avatar, styled } from "@mui/material";

export const AppAvatar = ({ name, picture }) => {
  const defaultIcon = useMemo(() => {
    return renderDefaultAppIcon(name);
  }, [name]);
  const renderedName = (name || "?").toUpperCase()[0];

  return (
    <StyledAvatar
      className="app_avatar"
      src={picture || defaultIcon}
      alt={renderedName}
      imgProps={{
        onError: (e) => {
          e.currentTarget.src = defaultIcon;
        },
      }}
      variant="square"
    >
      {renderedName}
    </StyledAvatar>
  );
};

const StyledAvatar = styled(Avatar)(() => ({
  width: 56,
  height: 56,
  borderRadius: "1rem",
}));
