import React, { useContext } from "react";
import { AppContext } from "../../store/app-context";
import { styled } from "@mui/material";
import { PinItem } from "./PinItem";

export const PinsList = ({ drawerBleeding }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace, onOpenTabGroup } = contextData || {};
  const { tabGroups = {} } = currentWorkspace || {};

  const keys = Object.keys(tabGroups);
  keys.sort((ai, bi) => {
    const lastActiveA = (tabGroups[ai].tabs.length > 0 && tabGroups[ai].lastActive) || 0;
    const lastActiveB = (tabGroups[bi].tabs.length > 0 && tabGroups[bi].lastActive) || 0;

    // both groups are active? desc by lastActive
    if (lastActiveA != 0 && lastActiveB != 0)
      return lastActiveB - lastActiveA;

    // active goes before inactive
    if (lastActiveA != 0)
      return -1;
    if (lastActiveB != 0)
      return 1;

    // inactive ones go by order asc
    return tabGroups[ai].order - tabGroups[bi].order;
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
            onClick={() => {
              console.log("TAB", tg);
              onOpenTabGroup(tg);
            }}
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
