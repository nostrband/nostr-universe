import { styled } from "@mui/material";
import React from "react";
import { ToolsList } from "./ToolsList";

export const Tools = () => {
  return (
    <Container>
      <h3>Tools</h3>
      <ToolsList />
    </Container>
  );
};

const Container = styled("div")(() => ({
  flex: "3",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "21px",
  background: "#111111",
  borderRadius: "24px",
  padding: "1rem 1rem 1.5rem",
  h3: {
    margin: 0,
    color: "#FFFFFF99",
    fontWeight: "600",
    fontSize: "1rem",
  },
}));
