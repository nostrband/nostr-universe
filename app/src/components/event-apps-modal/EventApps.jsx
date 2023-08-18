import { useState, useEffect, useContext } from "react";
import { fetchAppsForEvent } from "../../nostr";
import { AppContext } from "../../store/app-context";
import { EventApp } from "./EventApp";
import {
  Autocomplete,
  CircularProgress,
  IconButton,
  InputBase,
  styled,
} from "@mui/material";
import { CloseIcon, SearchIcon } from "../../assets";

export const EventApps = ({ addr, onClose, onSelect }) => {
  const contextData = useContext(AppContext);
  const { onOpenApp } = contextData || {};

  const [apps, setApps] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    setSelectedApp(null);
  }, []);

  useEffect(() => {
    const load = async () => {
      console.log("addr", addr);
      setIsLoading(true);
      const info = await fetchAppsForEvent(addr);
      // FIXME convert info to apps
      console.log("info", info);

      const apps = [];
      for (const id in info.apps) {
        const app = info.apps[id].handlers[0];
        if (!app.eventUrl) continue;

        apps.push({
          naddr: app.naddr,
          url: app.eventUrl,
          name: app.profile?.display_name || app.profile?.name,
          about: app.profile?.about || "",
          picture: app.profile?.picture,
          order: app.order || apps.length,
        });
      }

      // FIXME attach 'pinned' state, sort pinned-first

      apps.sort((a, b) => b.order - a.order);

      console.log("apps", apps);
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
    onOpenApp(app);
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
        <Autocomplete
          options={apps.length ? apps : []}
          freeSolo={false}
          selectOnFocus
          disableClearable
          renderInput={(params) => {
            return (
              <StyledInput
                placeholder="Search"
                endAdornment={<SearchIcon />}
                {...params.InputProps}
                inputProps={params.inputProps}
              />
            );
          }}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => {
            return <EventApp app={option} {...props} />;
          }}
          ListboxProps={{
            sx: {
              background: "#111111",
              color: "white",
              boxShadow: "0px -4px 8px 0px #00000033",
              borderRadius: "1rem",
            },
          }}
          value={selectedApp}
          slotProps={{
            paper: {
              sx: {
                background: "transparent",
              },
            },
          }}
          onChange={(_, app) => {
            setSelectedApp(app);
            onOpen(app.url, app);
          }}
        />
        {!isLoading && apps.length && (
          <EventsContainer>
            {apps.map((app) => (
              <EventApp app={app} onClick={() => onOpen(app.url, app)} />
            ))}
          </EventsContainer>
        )}
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
