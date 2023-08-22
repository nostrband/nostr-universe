import React, { useContext } from "react";
import { AppItem } from "./AppItem";
import { AppContext } from "../../store/app-context";
import { SectionTitle } from "../UI/SectionTitle";
import { styled } from "@mui/material";

export const AppsList = () => {
  const contextData = useContext(AppContext);
  const { apps, onOpenApp } = contextData || {};

  return (
    <Container>
      <SectionTitle color="#a3e8c4">Popular Apps</SectionTitle>
      <div className="container d-flex align-items-start">
        <div className="contentWrapper d-flex gap-1">
          {apps.map((app, index) => {
            return (
              <AppItem
                app={app}
                onOpenApp={onOpenApp}
                key={app.name + "" + index}
              />
            );
          })}
        </div>
      </div>
    </Container>
  );
};

const Container = styled("section")(() => ({
  marginTop: "1rem",
}));
