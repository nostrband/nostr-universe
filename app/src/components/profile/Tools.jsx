import { styled } from "@mui/material";
import React from "react";

export const Tools = () => {
  return (
    <ToolsContainer>
      <h3>Tools</h3>
      <div></div>
    </ToolsContainer>
  );
};

const ToolsContainer = styled("div")(() => ({
  flex: "3",
  background: "#111111",
  borderRadius: "24px",
  marginTop: "21px",
  padding: "1rem 1rem 1.5rem",
}));
