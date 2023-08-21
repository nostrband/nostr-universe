import React, { useState, useEffect } from "react";
import { Modal } from "../UI/modal/Modal";

import { IconButton, InputBase, styled } from "@mui/material";
import { Header } from "../../layout/Header";
import { SearchIcon } from "../../assets";
import { nostrbandRelay, searchProfiles } from "../../nostr";
import { nip19 } from "@nostrband/nostr-tools";
import { TrendingProfileItem } from "../trending-profiles/TrendingProfileItem";
import { ContactList } from "../contact-list/ContactList";

export const SearchModal = ({ isOpen, onClose, onSearch, onOpenEvent, onOpenContact }) => {
  const [searchValue, setSearchValue] = useState("");
  const [profiles, setProfiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setProfiles(null);
    setIsLoading(false);
  }, [isOpen]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (onSearch(searchValue)) {
      onClose();
    }

    setIsLoading(true);
    const profiles = await searchProfiles(searchValue);
    setProfiles(profiles);
    setIsLoading(false);
  };

  const onProfileClick = async (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({
      pubkey,
      relays: [nostrbandRelay],
    });

    onOpenEvent(nprofile);
    onClose();
  };
  
  return (
    <Modal isOpen={isOpen} onClose={onClose} direction="left">
      <Container>
	<Header searchMode onClose={onClose} />
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

	<div className="ms-3">{isLoading && (<>Searching...</>)}</div>
	{profiles && (
	  <StyledContainer>
	    <h1>Profiles</h1>
	    <ProfilesContainer>
              {profiles.map((e) => {
		const p = e.profile;
		return (
		  <TrendingProfileItem
		    key={p.pubkey}
			profile={p}
			onClick={onProfileClick}
		  />
              )})}
	    </ProfilesContainer>
	  </StyledContainer>
	)}

      </Container>
    </Modal>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
}));

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
  paddingLeft: "1rem",
  h1: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#E2E8A3",
    marginBottom: "0.75rem",
  },
}));

const ProfilesContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));
