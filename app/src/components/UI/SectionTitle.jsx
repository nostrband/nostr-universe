import { styled } from "@mui/material";
import React from "react";

export const SectionTitle = ({ children, color = "#fff" }) => {
  return <StyledTitle color={color}>{children}</StyledTitle>;
};

const StyledTitle = styled("h1")(({ color }) => ({
  fontSize: "20px",
  fontWeight: 600,
  color: color,
  marginBottom: "0.75rem",
}));
