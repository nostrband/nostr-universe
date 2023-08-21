import { useState, useEffect, useContext, useRef } from "react";
import { fetchAppsForEvent } from "../../nostr";
import { AppContext } from "../../store/app-context";
import { EventApp } from "./EventApp";
import {
  CircularProgress,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  styled,
} from "@mui/material";
import { CloseIcon, SearchIcon } from "../../assets";
import { useDebounce } from "use-debounce";
import { AppAvatar } from "./AppAvatar";

export const EventApps = ({ addr, onClose, onSelect }) => {
  const contextData = useContext(AppContext);
  const { onOpenApp, currentWorkspace } = contextData || {};

  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const searchInputRef = useRef();

  const [enteredSearch, setEnteredSearch] = useState("");
  const [searchTerm] = useDebounce(enteredSearch, 600);
  const [foundApps, setFoundApps] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(null);

  const handleClick = (event) => {
    setIsMenuOpen(true);
  };
  const handleClose = () => {
    setIsMenuOpen(null);
  };

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

      console.log("apps", JSON.stringify(apps));
      setApps(apps);
    };

    if (addr) {
      load().finally(() => setIsLoading(false));
      return undefined;
    }
    return setApps([]);
  }, [addr]);

  const onOpen = (app) => {
    onSelect();
    onOpenApp({ ...app, kind });
  };

  useEffect(() => {
    const isSearchTermValid = searchTerm.trim().length;
    if (!isSearchTermValid) {
      return setFoundApps([]);
    }
    if (isSearchTermValid) {
      setFoundApps(
        apps.filter((app) =>
          app.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setIsMenuOpen(true);
    }
  }, [searchTerm, apps]);

  const searchValueChangeHandler = (e) => setEnteredSearch(e.target.value);

  const renderSearchInput = () => {
    return (
      <>
        <StyledInput
          placeholder="Search"
          endAdornment={
            <StyledIconButton onClick={handleClick}>
              <SearchIcon />
            </StyledIconButton>
          }
          onChange={searchValueChangeHandler}
          value={enteredSearch}
          ref={searchInputRef}
        />
        <StyledMenu
          anchorEl={searchInputRef.current}
          open={isMenuOpen}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          slotProps={{
            paper: {
              className: "paper",
            },
          }}
          paperwidth={searchInputRef.current?.offsetWidth}
        >
          {!foundApps.length && (
            <MenuItem sx={{ justifyContent: "center" }} disabled>
              No apps
            </MenuItem>
          )}
          {foundApps.map((app) => {
            return (
              <MenuItem key={app.naddr}>
                <EventApp
                  app={app}
                  isMenuItem
                  onClick={() => onOpen(app.url, app)}
                />
              </MenuItem>
            );
          })}
        </StyledMenu>
      </>
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
              {apps.map((app) => (
                <EventApp app={app} onClick={() => onOpen(app.url, app)} />
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
  padding: "11px 16px",
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

const StyledMenu = styled(Menu)(({ paperwidth }) => ({
  padding: 0,
  "& .MuiMenuItem-root": {
    padding: 0,
  },
  "& .paper": {
    background: "#111111",
    color: "white",
    boxShadow: "0px -4px 8px 0px #00000033",
    borderRadius: "16px",
    width: paperwidth || "calc(100% - 32px)",
    maxHeight: "60vh",
  },
}));
