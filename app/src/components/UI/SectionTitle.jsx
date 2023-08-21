import { styled } from "@mui/material";
import React from "react";

export const SectionTitle = ({ children, color = "#fff" }) => {
  return (
    <StyledTitle color={color} className="ps-3">
      {children}
    </StyledTitle>
  );
};

const StyledTitle = styled("h3")(({ color }) => ({
  fontWeight: 600,
  color: color,
  marginBottom: "0.75rem",
}));
