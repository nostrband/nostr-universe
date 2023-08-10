import React from "react";
import {
  ContactsIcon,
  SettingsIcon,
  WalletToolIcon,
  SafeIcon,
} from "../../../assets";
import { List, styled } from "@mui/material";
import { ToolItem } from "./ToolItem";

const DUMMY_TOOLS = [
  {
    title: "Settings",
    id: "e1",
    Icon: SettingsIcon,
  },
  {
    title: "Key Vault",
    id: "e2",
    Icon: SafeIcon,
  },
  {
    title: "Contacts",
    id: "e3",
    Icon: ContactsIcon,
  },
  {
    title: "Wallet Connect",
    id: "e4",
    Icon: WalletToolIcon,
  },
];

export const ToolsList = ({tools}) => {
  return (
    <StyledList>
      {(tools || DUMMY_TOOLS).map((tool) => (
        <ToolItem {...tool} key={tool.id} />
      ))}
    </StyledList>
  );
};

const StyledList = styled(List)(() => ({
  padding: 0,
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));
