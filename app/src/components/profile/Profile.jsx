import React, { useContext } from "react";
import { styled } from "@mui/material";

import { ProfileAvatar } from "./ProfileAvatar";
import { Tools } from "./tools/Tools";
import { AppContext } from "../../store/app-context";
import { getProfileImage, getShortenText } from "../../utils/helpers/general";
import { nip19 } from "@nostrband/nostr-tools";
import { AccountsMenu } from "./accounts-menu/AccountsMenu";
import { useSearchParams } from "react-router-dom";

const MODAL_SEARCH_PARAM = "change-account";

const getEncodedKeys = (keys) => {
  if (!keys || keys.length === 0) {
    return [];
  }
  return keys.map((key) => nip19.npubEncode(key));
};

const getRenderedUsername = (profile, npub) => {
  return (
    profile?.profile?.display_name ||
    profile?.profile?.name ||
    getShortenText(npub)
  );
};

export const Profile = () => {
  const contextData = useContext(AppContext);
  const { npub, keys, onSelectKey, profile } = contextData || {};

  const [searchParams, setSearchParams] = useSearchParams();
  const isChangeAccountModalOpen = Boolean(
    searchParams.get(MODAL_SEARCH_PARAM)
  );

  const openChangeAccountModalHandler = () => {
    searchParams.set(MODAL_SEARCH_PARAM, true);
    setSearchParams(searchParams);
  };

  const closeModalHandler = () => {
    searchParams.delete(MODAL_SEARCH_PARAM);
    setSearchParams(searchParams);
  };

  const changeAccountHandler = (index) => {
    onSelectKey(index);
    closeModalHandler();
  };

  const currentUsername = getRenderedUsername(profile, npub);
  const encodedKeys = getEncodedKeys(keys);

  return (
    <>
      <Container>
        <ProfileAvatar
          username={currentUsername}
          profileImage={getProfileImage(profile?.profile)}
          onOpenChangeAccountModal={openChangeAccountModalHandler}
        />
        <Tools />
      </Container>

      <AccountsMenu
        isOpen={isChangeAccountModalOpen}
        onClose={closeModalHandler}
        accounts={encodedKeys}
        currentUsername={npub}
        onChangeAccount={changeAccountHandler}
      />
    </>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));
