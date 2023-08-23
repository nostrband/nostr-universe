import React, { useContext } from "react";
import { AppItem } from "./AppItem";
import { AppContext } from "../../store/app-context";
import { SectionTitle } from "../UI/SectionTitle";
import { styled } from "@mui/material";

export const AppsList = () => {
  const contextData = useContext(AppContext);
  const { apps, onOpenApp } = contextData || {};

  return (
    <StyledSection>
      <SectionTitle color="#a3e8c4">Popular Apps</SectionTitle>
      <AppsContainer>
        {apps.map((app, index) => {
          return (
	    <AppItem
              app={app}
              onOpenApp={onOpenApp}
              key={app.name + "" + index}
	    />
          );
        })}
      </AppsContainer>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "1rem",
  minHeight: "5rem",
}));

const AppsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));
