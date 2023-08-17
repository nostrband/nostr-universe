import React, { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { styled } from "@mui/material";
import { PinItem } from "./PinItem";

export const PinsList = ({ drawerBleeding }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace, onOpenTabGroup } = contextData || {};
  const { tabGroups = {} } = currentWorkspace || {};

  const keys = Object.keys(tabGroups);
  return (
    <StyledContainer length={keys.length} bleeddingheight={drawerBleeding}>
      {keys.map(id => {
	const tg = tabGroups[id];
        return (
          <PinItem
            key={tg.info.id}
            image={tg.info.icon}
            {...tg.info}
            onClick={() => onOpenTabGroup(tg)}
          />
	)
      })}
    </StyledContainer>
  );
};

const StyledContainer = styled("div")(({ length, bleeddingheight }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  padding: "0 0 1rem",
  margin: "0 1rem",
  rowGap: "2rem",
  columnGap: "0.5rem",
  overflowY: "hidden",
  overflowX: "auto",
  height: `calc(100% - ${bleeddingheight}%)`,
  "& > .item": {
    width: `calc(100% / ${length} - 10px)`,
    minWidth: "56px",
    minHeight: "56px",
    maxWidth: "56px",
    maxHeight: "56px",
  },
}));
