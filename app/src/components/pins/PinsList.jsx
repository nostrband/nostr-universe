import React, { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { styled } from "@mui/material";
import { PinItem } from "./PinItem";

const drawerBleeding = "10.5%";

export const PinsList = () => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const { pins = [] } = currentWorkspace || {};

  return (
    <StyledContainer length={pins.length}>
      {pins.map((pin) => {
        return <PinItem {...pin} />;
      })}
    </StyledContainer>
  );
};

const StyledContainer = styled("div")(({ length }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "0 1rem 1rem",
  gap: "1rem",
  overflowY: "hidden",
  height: `calc(100% - ${drawerBleeding})`,
  "& > .item": {
    width: `calc(100% / ${length} - 10px)`,
    backgroundColor: "white",
    minWidth: "56px",
    minHeight: "56px",
  },
}));
