import { styled } from "@mui/material";
import React, { useContext } from "react";
import { SectionTitle } from "../UI/SectionTitle";
import { AppContext } from "../../store/app-context";
import { TrendingNoteItem } from "./TrendingNoteItem";

export const TrendingNotes = () => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const notes = currentWorkspace?.trendingNotes || [];

  return (
    <StyledSection>
      <SectionTitle color="#CBA3E8">Trending notes</SectionTitle>

      <NotesContainer>
        {notes.map((note) => {
          return <TrendingNoteItem author={note.author} content={note.event} />;
        })}
      </NotesContainer>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "2.5rem",
  paddingLeft: "1rem",
}));

const NotesContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  overflow: "scroll",
}));
