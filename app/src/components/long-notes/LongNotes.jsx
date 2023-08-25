import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { nostrbandRelay, getTagValue } from "../../nostr";
import { LongNoteItem } from "./LongNoteItem";

export const LongNotes = ({ onOpenAddr }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const notes = currentWorkspace?.longNotes || [];

  const onNoteClick = async (event) => {
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
      <SectionTitle color="#a3dfe8">Long posts</SectionTitle>
      <NotesContainer>
        {notes.map((note) => {
          return (
            <LongNoteItem
	      key={note.id}
              author={note.author?.profile}
              content={note}
              onClick={onNoteClick}
            />
          );
        })}
      </NotesContainer>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "1rem",
  minHeight: "5rem",
}));

const NotesContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
}));
