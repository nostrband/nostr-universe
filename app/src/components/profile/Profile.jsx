import React, { useContext } from "react";
import { styled } from "@mui/material";

import { ProfileAvatar } from "./ProfileAvatar";
import { Tools } from "./tools/Tools";
import { AppContext } from "../../store/app-context";
import {
  getProfileImage,
  getRenderedUsername,
  getNpub,
  isGuest
} from "../../utils/helpers/general";
import { AccountsMenu } from "./accounts-menu/AccountsMenu";
import { useSearchParams } from "react-router-dom";

const MODAL_SEARCH_PARAM = "change-account";

export const Profile = () => {
  const contextData = useContext(AppContext);
  const { currentPubkey, onSelectKey, profile, keys, profiles, onAddKey } = contextData || {};

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
    setSearchParams(searchParams, { replace: true });
  };

  const changeAccountHandler = (index) => {
    onSelectKey(index);
    closeModalHandler();
  };

  const currentUsername = getRenderedUsername(profile, currentPubkey);

  const accounts = keys.map(k => { return {pubkey: k, ...profiles?.find(p => p.pubkey === k)} });

  return (
    <>
      <Container>
        <ProfileAvatar
          username={currentUsername}
          profileImage={getProfileImage(profile?.profile)}
          onOpenChangeAccountModal={openChangeAccountModalHandler}
	  onAddKey={onAddKey}
	  isGuest={isGuest(currentPubkey)}
        />
        <Tools />
      </Container>

      <AccountsMenu
        isOpen={isChangeAccountModalOpen}
        onClose={closeModalHandler}
        accounts={accounts}
        currentUserNpub={isGuest(currentPubkey) ? "" : getNpub(currentPubkey)}
        onChangeAccount={changeAccountHandler}
        onAddKey={onAddKey}
      />
    </>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));
