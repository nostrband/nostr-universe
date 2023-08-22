import { useState, useEffect, useContext, useRef } from "react";
import { fetchAppsForEvent } from "../../nostr";
import { AppContext } from "../../store/app-context";
import { EventApp } from "./EventApp";
import { CircularProgress, IconButton, InputBase, styled } from "@mui/material";
import { CloseIcon, SearchIcon } from "../../assets";

export const EventApps = ({ addr, onClose, onSelect }) => {
  const contextData = useContext(AppContext);
  const { onOpenApp, currentWorkspace } = contextData || {};

  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInputRef = useRef();

  const [enteredSearch, setEnteredSearch] = useState("");

  const [kind, setKind] = useState();

  useEffect(() => {
    const load = async () => {
      console.log("addr", addr);
      setIsLoading(true);
      const info = await fetchAppsForEvent(addr);
      console.log("info", info);

      // save event kind
      setKind(info.addr.kind);

      let lastAppNaddr = "";
      console.log(
        "addr kind",
        info.addr.kind,
        "lastKindApps",
        JSON.stringify(currentWorkspace.lastKindApps)
      );
      if (info.addr.kind in currentWorkspace.lastKindApps)
        lastAppNaddr = currentWorkspace.lastKindApps[info.addr.kind];

      const apps = [];
      for (const id in info.apps) {
        const app = info.apps[id].handlers[0];
        if (!app.eventUrl) continue;

        const pinned = currentWorkspace.pins.find(
          (p) => p.appNaddr === app.naddr
        );
        const lastUsed = app.naddr === lastAppNaddr;

        let order = app.order;
        // last app always at the top
        if (lastUsed) order = 1000;
        // pinned are a priority
        else if (pinned) order += 100;

        apps.push({
          naddr: app.naddr,
          url: app.eventUrl,
          name: app.profile?.display_name || app.profile?.name,
          about: app.profile?.about || "",
          picture: app.profile?.picture,
          lastUsed,
          pinned,
          order,
        });
      }

      apps.sort((a, b) => b.order - a.order);

      setApps(apps);
    };

    if (addr) {
      load().finally(() => setIsLoading(false));
      return undefined;
    }
    return setApps([]);
  }, [addr]);

  const onOpen = (app) => {
    console.log("app", app, kind);
    onSelect();
    onOpenApp({ ...app, kind });
  };

  const searchValueChangeHandler = (e) => setEnteredSearch(e.target.value);

  const renderedApps = apps.filter((app) => {
    return app.name.toLowerCase().includes(enteredSearch.toLowerCase());
  });

  const renderSearchInput = () => {
    return (
      <StyledInput
        placeholder="Search"
        endAdornment={
          <StyledIconButton>
            <SearchIcon />
          </StyledIconButton>
        }
        onChange={searchValueChangeHandler}
        value={enteredSearch}
        ref={searchInputRef}
      />
    );
  };

  return (
    <Container>
      <div className="header">
        <h2>Select App</h2>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </div>
      <hr className="m-0" />
      <div className="m-3" style={{ flex: "1" }}>
        {(isLoading || apps.length === 0) && (
          <SpinnerContainer>
            <CircularProgress className="spinner" />
          </SpinnerContainer>
        )}

        {!isLoading && apps.length ? (
          <>
            {renderSearchInput()}
            <EventsContainer>
              {renderedApps.map((app) => (
                <EventApp app={app} onClick={() => onOpen(app)} />
              ))}
            </EventsContainer>
          </>
        ) : null}
      </div>
    </Container>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  "& .header": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0.5rem 1rem",
    h2: {
      margin: 0,
    },
  },
}));

const EventsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  maxWidth: "100%",
  overflow: "hidden",
  textOverflow: "ellipsis",
  width: "100%",
  margin: "1rem 0",
  gap: "0.5rem",
}));

const SpinnerContainer = styled("div")(() => ({
  display: "grid",
  placeItems: "center",
  height: "100%",
  width: "100%",
  "& .spinner": {
    color: "#fff",
  },
}));

const StyledInput = styled(InputBase)(() => ({
  background: "#222222",
  width: "100%",
  borderRadius: "16px",
  color: "#fff",
  fontFamily: "Outfit",
  fontSize: "16px",
  fontWeight: 400,
  padding: "4px 16px",
  "&:placeholder": {
    color: "#C9C9C9",
  },
  gap: "0.5rem",
}));

const StyledIconButton = styled(IconButton)(() => ({
  transition: "background 0.3s ease-out",
  "&:active": {
    background: "rgba(255, 255, 255, 0.1)",
  },
}));
