import React, { useContext } from "react";
import { TrendingProfileItem } from "./TrendingProfileItem";
import { AppContext } from "../../store/app-context";
import { nip19 } from "@nostrband/nostr-tools";
import { styled } from "@mui/material";
import { nostrbandRelay } from "../../nostr";
import { SectionTitle } from "../UI/SectionTitle";

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

export const TrendingProfiles = ({ onOpenProfile }) => {
  const contextData = useContext(AppContext);
  const { currentWorkspace } = contextData || {};
  const trendingProfiles = currentWorkspace?.trendingProfiles || [];

  const onProfileClick = async (pubkey) => {
    console.log("show", pubkey);

    const nprofile = nip19.nprofileEncode({
      pubkey,
      relays: [nostrbandRelay],
    });

    onOpenProfile(nprofile);
  };

  const renderedProfiles = getRenderedProfiles(
    trendingProfiles,
    trendingProfiles.length > 0
  );

  return (
    <StyledSection>
      <SectionTitle color="#E2E8A3">Trending profiles</SectionTitle>
      <TrendingProfilesContainer>
        {trendingProfiles.length > 0 &&
          renderedProfiles.map((p) => (
            <TrendingProfileItem
              key={p.pubkey}
              profile={p}
              onClick={onProfileClick}
            />
          ))}
      </TrendingProfilesContainer>
    </StyledSection>
  );
};

const StyledSection = styled("section")(() => ({
  marginTop: "2.3rem",
  paddingLeft: "1rem",
}));

const TrendingProfilesContainer = styled("div")(() => ({
  display: "flex",
  flexDirection: "row",
  flexWrap: "nowrap",
  overflow: "auto",
}));
