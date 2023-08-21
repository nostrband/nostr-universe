import React, { useContext } from "react";
import { AppItem } from "./AppItem";
import { AppContext } from "../../store/app-context";
import { SectionTitle } from "../UI/SectionTitle";

export const AppsList = () => {
  const contextData = useContext(AppContext);
  const { apps, onOpenApp } = contextData || {};

  return (
    <div className="mt-4">
      <SectionTitle color="#A3B2E8">Popular Apps</SectionTitle>
      <section className="container d-flex align-items-start">
        <div className="contentWrapper d-flex gap-4">
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
      </section>
    </div>
  );
};
