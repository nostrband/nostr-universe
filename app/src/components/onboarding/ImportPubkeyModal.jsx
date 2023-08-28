import React, { useState, useEffect } from "react";
import { Modal } from "../UI/modal/Modal";
import { CircularProgress, IconButton, InputBase, Typography, styled } from "@mui/material";
import { CloseIcon, SearchIcon } from "../../assets";
import { searchProfiles } from "../../nostr";
import { nip19 } from "@nostrband/nostr-tools";
import { TrendingProfileItem } from "../trending-profiles/TrendingProfileItem";

export const ImportPubkeyModal = ({
  isOpen,
  onClose,
  onSelect
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [profiles, setProfiles] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setSearchValue("");
    setProfiles(null);
    setIsLoading(false);
  }, [isOpen]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const { type, data } = nip19.decode(searchValue);
      if (type === 'npub') {
	select(data);
	return;
      }      
    } catch {}
	  
    setIsLoading(true);
    searchProfiles(searchValue)
      .then(setProfiles)
      .finally(() => setIsLoading(false))
    ;
  };

  const select = (pubkey) => {
    onSelect(pubkey);
    onClose();
  };
  
  const onProfileClick = async (pubkey) => {
    console.log("select", pubkey);
    select(pubkey);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} direction="left">
      <Container>
	<header>
          <h2>Add read-only keys</h2>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
	  <hr className="m-0" />	
	</header>
	<main>
	  <Form onSubmit={submitHandler}>
	    <StyledInput
	      placeholder="Enter npub or a username"
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

	  <Hint>Paste an npub of some existing user to log in.</Hint>
	  <Hint>Or type something to search for matching profiles, then click on one to import it.</Hint>
	  
	</main>
      </Container>
    </Modal>
  );
};

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

    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;

    & > h2 {
      flex-grow: 1;
    }
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

const Hint = styled("p")(() => ({
  margin: "0",
  fontSize: "0.875rem",
  fontWeight: 500,
  margin: "1rem",
}));
