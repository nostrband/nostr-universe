import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { nostrbandRelay, getTagValue } from "../../nostr";
import { LiveEventItem } from "./LiveEventItem";

export const LiveEvents = ({ onOpenAddr }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const events = currentWorkspace?.liveEvents || [];

  const onClick = async (event) => {
    console.log("show", event);

    const naddr = nip19.naddrEncode({
      pubkey: event.pubkey,
      kind: event.kind,
      identifier: getTagValue(event, 'd'),
      relays: [nostrbandRelay],
    });
    console.log("naddr", naddr);

    onOpenAddr(naddr);
  };

  return (
    <StyledSection>
      <SectionTitle color="#daa3e8">Live streams</SectionTitle>
      <EventsContainer>
        {events.map((event) => {
          return (
            <LiveEventItem
	      key={event.id}
              host={event.hostMeta?.profile}
              content={event}
              onClick={onClick}
            />
          );
        })}
      </EventsContainer>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "1rem",
  minHeight: "5rem",
}));

const EventsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
}));
