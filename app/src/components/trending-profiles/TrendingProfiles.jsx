import React, { useContext } from "react";
import { TrendingProfileItem } from "./TrendingProfileItem";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";

export const TrendingProfiles = () => {
  const contextData = useContext(AppContext);
  const { workspaces, currentPubkey, apps, open } = contextData || {};

  const ws = workspaces.find(w => w.pubkey == currentPubkey);
  const renderedProfiles = ws?.trendingProfiles || [];

  const onProfileClick = (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({
      pubkey,
      relays: ["wss://relay.nostr.band"],
    });
    const pin = ws.pins.find(
      (p) => p.perms && p.perms.find((k) => k == 0) !== undefined
    );
    console.log("pin", JSON.stringify(pin));
    const app = apps.find((a) => a.naddr == pin.appNaddr);
    console.log("app", JSON.stringify(app));
    const handler = app.handlers[0];
    const url = handler.url.replace("<bech32>", nprofile);

    console.log("profile app", app, pin, url);

    open(url, pin);
  };

  return (
    <div className="container-fluid p-1">
      <h3>Trending profiles</h3>
      <div className="d-flex flex-row flex-nowrap overflow-auto">
        {renderedProfiles.map((p) => (
          <TrendingProfileItem
            key={p.npub}
            profile={p}
            onClick={onProfileClick}
          />
        ))}
      </div>
    </div>
  );
};
