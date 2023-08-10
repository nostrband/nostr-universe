import React, { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { styled } from "@mui/material";
import { PinItem } from "./PinItem";

export const PinsList = ({ drawerBleeding }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace, open: onOpenPin } = contextData || {};
  const { pins = [] } = currentWorkspace || {};

  return (
    <StyledContainer length={pins.length} bleeddingheight={drawerBleeding}>
      {pins.map((pin) => {
        return (
          <PinItem
            image={pin.icon}
            {...pin}
            onClick={() => onOpenPin(pin.url, pin)}
          />
        );
      })}
    </StyledContainer>
  );
};

const StyledContainer = styled("div")(({ length, bleeddingheight }) => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "flex-start",
  padding: "0 1rem 1rem",
  rowGap: "2rem",
  overflowY: "hidden",
  height: `calc(100% - ${bleeddingheight}%)`,
  "& > .item": {
    width: `calc(100% / ${length} - 10px)`,
    minWidth: "56px",
    minHeight: "56px",
  },
}));
