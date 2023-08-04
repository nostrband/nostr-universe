import React, { useContext } from "react";
import { TrendingProfileItem } from "./TrendingProfileItem";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { styled } from "@mui/material";

function createDuplicateList() {
  return Array.from({ length: 10 }, () => {
    return { name: null, picture: null };
  });
}

const getRenderedProfiles = (profiles, isLoading) => {
  if (!isLoading) {
    return createDuplicateList();
  }
  return profiles;
};

export const TrendingProfiles = () => {
  const contextData = useContext(AppContext);
  const { workspaces, currentPubkey, apps, open } = contextData || {};

  const ws = workspaces.find((w) => w.pubkey === currentPubkey);
  const trendingProfiles = ws?.trendingProfiles || [];

  const onProfileClick = (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({
      pubkey,
      relays: ["wss://relay.nostr.band"],
    });
    const pin = ws.pins.find(
      (p) => p.perms && p.perms.find((k) => k === 0) !== undefined
    );
    console.log("pin", JSON.stringify(pin));
    const app = apps.find((a) => a.naddr === pin.appNaddr);
    console.log("app", JSON.stringify(app));
    const handler = app.handlers[0];
    const url = handler.url.replace("<bech32>", nprofile);

    console.log("profile app", app, pin, url);

    open(url, pin);
  };

  const renderedProfiles = getRenderedProfiles(
    trendingProfiles,
    trendingProfiles.length > 0
  );

  return (
    <StyledContainer>
      <h1>Trending profiles</h1>
      <TrendingProfilesContainer>
        {renderedProfiles.map((p) => (
          <TrendingProfileItem
            key={p.npub}
            profile={p}
            onClick={onProfileClick}
          />
        ))}
      </TrendingProfilesContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled("div")(() => ({
  marginTop: "2.3rem",
  paddingLeft: "1rem",
  h1: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#E2E8A3",
    marginBottom: "0.75rem",
  },
}));

const TrendingProfilesContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));
