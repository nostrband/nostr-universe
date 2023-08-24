import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { nostrbandRelay, getTagValue } from "../../nostr";
import { CommunityItem } from "./CommunityItem";

export const Communities = ({ onOpen }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const events = currentWorkspace?.communities || [];

  const onClick = async (event) => {
    console.log("show", event);

    const naddr = nip19.naddrEncode({
      pubkey: event.pubkey,
      kind: event.kind,
      identifier: getTagValue(event, 'd'),
      relays: [nostrbandRelay],
    });
    console.log("naddr", naddr);

    onOpen(naddr);
  };

  return (
    <StyledSection>
      <SectionTitle color="#CBA3E8">Active communities</SectionTitle>
      <Container>
        {events.map((event) => {
          return (
            <CommunityItem
	      key={event.id}
              author={event.author?.profile}
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
