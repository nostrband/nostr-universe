import React, { useContext } from "react";
import { styled } from "@mui/material";

import { ProfileAvatar } from "./ProfileAvatar";
import { Tools } from "./tools/Tools";
import { AppContext } from "../../store/app-context";
import {
  getProfileImage,
  getRenderedUsername,
} from "../../utils/helpers/general";
import { AccountsMenu } from "./accounts-menu/AccountsMenu";
import { useSearchParams } from "react-router-dom";

const MODAL_SEARCH_PARAM = "change-account";

export const Profile = () => {
  const contextData = useContext(AppContext);
  const { npub, onSelectKey, profile, profiles, onAddKey } = contextData || {};

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

  const currentUsername = getRenderedUsername(profile, npub);

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
        accounts={profiles}
        currentUserNpub={npub}
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
