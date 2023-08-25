import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { nostrbandRelay } from "../../nostr";
import { ZapItem } from "./ZapItem";

export const Zaps = ({ onOpen }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const events = currentWorkspace?.bigZaps || [];

  const onClick = async (eventAddr) => {
    console.log("show", eventAddr);

    let addr = eventAddr;
    if (typeof eventAddr !== 'string') {
      if (eventAddr.kind === 0) {
	addr = nip19.nprofileEncode({
	  pubkey: eventAddr.pubkey,
	  relays: [nostrbandRelay],
	});
      } else if ((eventAddr.kind >= 10000 && eventAddr.kind < 20000)
		 || (eventAddr.kind >= 10000 && eventAddr.kind < 20000)
      ) {
	addr = nip19.neventEncode({
	  pubkey: eventAddr.pubkey,
	  kind: eventAddr.kind,
	  identifier: eventAddr.identifier,
	  relays: [nostrbandRelay],
	});
      }
      else {
	addr = nip19.neventEncode({
	  id: eventAddr.id,
	  relays: [nostrbandRelay],
	});
      }
    }
      
    onOpen(addr);
  };

  return (
    <StyledSection>
      <SectionTitle color="#E2E8A3">Big zaps</SectionTitle>
      <Container>
        {events.map((event) => {
          return (
            <ZapItem
	      key={event.id}
              targetMeta={event.targetMeta?.profile}
              targetEvent={event.targetEvent}
              content={event}
              onClick={onClick}
            />
          );
        })}
      </Container>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "1rem",
  minHeight: "5rem",
}));

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
}));
