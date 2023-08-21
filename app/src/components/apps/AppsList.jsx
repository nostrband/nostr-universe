import React, { useContext } from "react";
import { AppItem } from "./AppItem";
import { AppContext } from "../../store/app-context";

export const AppsList = () => {
  const contextData = useContext(AppContext);
  const { apps, onOpenApp } = contextData || {};

  return (
    <div className="mt-4">
      <h3 className="ps-3" style={{color: "#A3B2E8"}}>Popular Apps</h3>
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
