import React, { useContext } from "react";
import { ContactListItem } from "./ContactListItem";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { styled } from "@mui/material";
import { nostrbandRelay, fetchAppsForEvent } from '../../nostr'

function createDuplicateList() {
  return Array.from({ length: 10 }, () => {
    return { pubkey: "", name: null, picture: null };
  });
}

const getRenderedProfiles = (profiles, isLoading) => {
  if (!isLoading) {
    return createDuplicateList();
  }
  return profiles;
};

export const ContactList = ({ onOpenProfile }) => {
  const contextData = useContext(AppContext);
  const { contactList = {} } = contextData || {};

  const onProfileClick = async (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({
      pubkey,
      relays: [nostrbandRelay],
    });

    onOpenProfile(nprofile);
  };

  const renderedProfiles = getRenderedProfiles(
    contactList.contactEvents,
    contactList.contactEvents?.length > 0
  );
  
  return (
    <StyledContainer>
      <h1>Contacts</h1>
      <ContactListContainer>
        {renderedProfiles.length > 0 && renderedProfiles.map((p, i) => (
          <ContactListItem
            key={i}
            profile={p.profile}
            onClick={onProfileClick}
          />
        ))}
      </ContactListContainer>
    </StyledContainer>
  );
};

const StyledContainer = styled("div")(() => ({
  marginTop: "1rem",
  paddingLeft: "1rem",
  h1: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#E2E8A3",
    marginBottom: "0.75rem",
  },
}));

const ContactListContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));
