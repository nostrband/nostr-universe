import React, { useState, useEffect } from "react";
import { Modal } from "../UI/modal/Modal";

import { CircularProgress, IconButton, InputBase, Typography, styled } from "@mui/material";
import { Header } from "../../layout/Header";
import { SearchIcon } from "../../assets";
import {
  nostrbandRelay,
  searchProfiles,
  searchNotes,
  searchLongNotes,
  getTagValue,
  createAddrOpener
} from "../../nostr";
import { nip19 } from "@nostrband/nostr-tools";
import { TrendingProfileItem } from "../trending-profiles/TrendingProfileItem";
import { TrendingNoteItem } from "../trending-notes/TrendingNoteItem";
import { LongNoteItem } from "../long-notes/LongNoteItem";
import { ContactList } from "../contact-list/ContactList";

export const SearchModal = ({
  isOpen,
  onClose,
  onSearch,
  onOpenEvent,
  onOpenContact,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [profiles, setProfiles] = useState(null);
  const [notes, setNotes] = useState(null);
  const [longNotes, setLongNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchValue("");
    setProfiles(null);
    setNotes(null);
    setLongNotes(null);
    setIsLoading(false);
  }, [isOpen]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (onSearch(searchValue)) {
      onClose();
    }

    setIsLoading(true);
    searchProfiles(searchValue)
      .then(setProfiles)
      .then(() => searchNotes(searchValue))
      .then(setNotes)
      .then(() => searchLongNotes(searchValue))
      .then(setLongNotes)
      .finally(() => setIsLoading(false))
    ;
  };

  const open = (addr) => {
    onOpenEvent(addr);
    onClose();
  };
  
  const onProfileClick = async (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({
      pubkey,
      relays: [nostrbandRelay],
    });

    open(nprofile);
  };

  const onEventClick = async (id) => {
    console.log("show", id);

    const nevent = nip19.neventEncode({
      id,
      relays: [nostrbandRelay],
    });

    open(nevent);
  };

  const onAddrClick = async (event) => {
    console.log("show", event);

    const naddr = nip19.naddrEncode({
      pubkey: event.pubkey,
      kind: event.kind,
      identifier: getTagValue(event, 'd'),
      relays: [nostrbandRelay],
    });

    open(naddr);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} direction="left">
      <Container>
	<Header searchMode onClose={onClose} />
	<main>
	  <Form onSubmit={submitHandler}>
	    <StyledInput
	      placeholder="Search"
	      endAdornment={
		<StyledIconButton type="submit">
		  <SearchIcon />
		</StyledIconButton>
	      }
	      onChange={({ target }) => setSearchValue(target.value)}
	      autoFocus={true}
	      inputProps={{
		autoFocus: true,
	      }}
	    />
	  </Form>

	  {!searchValue && <ContactList onOpenProfile={onOpenContact} />}

	  <div className="ms-3">
	    {isLoading && (
	      <SpinnerContainer>
		<CircularProgress className="spinner" />
	      </SpinnerContainer>
	    )}
	  </div>
	  {profiles && (
	    <StyledContainer>
              <h1>Profiles</h1>
              <EventsContainer>
		{profiles.map((e) => {
		  const p = e.profile;
		  return (
		    <TrendingProfileItem
                      key={p.pubkey}
                      profile={p}
                      onClick={onProfileClick}
		    />
		  );
		})}
              </EventsContainer>
	    </StyledContainer>
	  )}
	  {notes && (
	    <StyledContainer>
              <h1 style={{color:"#CBA3E8"}}>Notes</h1>
              <EventsContainer>
		{notes.map((note) => {
		  return (
		    <TrendingNoteItem
                      key={note.id}
		      author={note.author?.profile}
		      content={note}
		      onClick={onEventClick}
		    />
		  )
		})}
              </EventsContainer>
	    </StyledContainer>
	  )}
	  {longNotes && (
	    <StyledContainer>
              <h1 style={{color:"#a3dfe8"}}>Long posts</h1>
              <EventsContainer>
		{longNotes.map((note) => {
		  return (
		    <LongNoteItem
                      key={note.id}
		      author={note.author?.profile}
		      content={note}
		      onClick={createAddrOpener(open)}
		    />
		  )
		})}
              </EventsContainer>
	    </StyledContainer>
	  )}
	</main>
      </Container>
    </Modal>
  );
};

const Container1 = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

const Container = styled("div")`
  min-height: 100dvh;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    "header"
    "main";

  & > header {
    grid-area: header;
    position: sticky;
    background: #000;
    z-index: 1199;
    top: 0;
  }

  & > main {
    grid-area: main;
    overflow: scroll;
    max-height: 100%;
    padding-bottom: 2rem;
  }
`;

const Form = styled("form")(() => ({
  marginTop: "1rem",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "1rem",
  padding: "0 1rem",
}));

const StyledInput = styled(InputBase)(() => ({
  background: "#222222",
  width: "100%",
  borderRadius: "16px",
  color: "#fff",
  fontFamily: "Outfit",
  fontSize: "16px",
  fontWeight: 400,
  padding: "4px 16px",
  "&:placeholder": {
    color: "#C9C9C9",
  },
  gap: "0.5rem",
}));

const StyledIconButton = styled(IconButton)(() => ({
  transition: "background 0.3s ease-out",
  "&:active": {
    background: "rgba(255, 255, 255, 0.1)",
  },
}));

const StyledContainer = styled("div")(() => ({
  marginTop: "1.3rem",
  h1: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#E2E8A3",
    marginBottom: "0.75rem",
    marginLeft: "1rem",
  },
}));

const EventsContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));

const SpinnerContainer = styled("div")(() => ({
  display: "grid",
  placeItems: "center",
  height: "100%",
  width: "100%",
  marginTop: "1rem",
  "& .spinner": {
    color: "#fff",
  },
}));
