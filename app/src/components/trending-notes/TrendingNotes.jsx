import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { nostrbandRelay } from "../../nostr";
import { TrendingNoteItem } from "./TrendingNoteItem";

export const TrendingNotes = ({ onOpenNote, highlight }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const notes = highlight
	      ? currentWorkspace?.highlights || [] 
	      : currentWorkspace?.trendingNotes || [];

  const onNoteClick = async (event) => {
    console.log("show", event);

    const nevent = nip19.neventEncode({
      id: event.id,
      relays: [nostrbandRelay],
    });

    onOpenNote(nevent);
  };

  return (
    <StyledSection>
      <SectionTitle color={highlight ? "#e8ada3" : "#CBA3E8"}>
	{highlight ? "Highlights" : "Trending notes"}
      </SectionTitle>
      <NotesContainer>
        {notes.map((note) => {
          return (
            <TrendingNoteItem
	      key={note.id}
              author={note.author?.profile}
              content={note}
              onClick={onNoteClick}
	      highlight={highlight}
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
