import React, { useContext } from "react";
import { AppItem } from "./AppItem";
import { AppContext } from "../../store/app-context";

export const AppsList = () => {
  const contextData = useContext(AppContext);
  const { apps, onOpenApp } = contextData || {};

  return (
    <div>
      <h3 className="ps-3">Apps</h3>
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
