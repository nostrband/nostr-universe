import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { nostrbandRelay } from "../../nostr";
import { TrendingNoteItem } from "./TrendingNoteItem";

export const TrendingNotes = ({ onOpenNote }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const notes = currentWorkspace?.trendingNotes || [];

  const onNoteClick = async (id) => {
    console.log("show", id);

    const nevent = nip19.neventEncode({
      id,
      relays: [nostrbandRelay],
    });

    onOpenNote(nevent);
  };

  return (
    <StyledSection>
      <SectionTitle color="#CBA3E8">Trending notes</SectionTitle>
      <NotesContainer>
        {notes.map((note) => {
          return (
            <TrendingNoteItem
              author={note.author.profile}
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
