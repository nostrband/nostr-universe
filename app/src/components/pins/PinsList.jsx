import React, { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { Button, InputBase, TextField, styled } from "@mui/material";
import { PinItem } from "./PinItem";

export const PinsList = ({ drawerBleeding }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace, onOpenTabGroup } = contextData || {};
  const { tabGroups = {} } = currentWorkspace || {};

  const keys = Object.keys(tabGroups);
  keys.sort((ai, bi) => {
    // desc
    return tabGroups[bi].lastActive - tabGroups[ai].lastActive;
  });
  return (
    <StyledContainer length={keys.length} bleeddingheight={drawerBleeding}>
      {keys.map((id) => {
        const tg = tabGroups[id];
        return (
          <PinItem
            key={tg.info.id}
            image={tg.info.icon}
            {...tg.info}
            onClick={() => onOpenTabGroup(tg)}
            active={tg.tabs.length > 0}
          />
        );
      })}
    </StyledContainer>
  );
};

const StyledContainer = styled("div")(({ length, bleeddingheight }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "flex-start",
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
