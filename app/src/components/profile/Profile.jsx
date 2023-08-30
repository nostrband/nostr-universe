import React, { useContext } from "react";
import { styled } from "@mui/material";

import { ProfileAvatar } from "./ProfileAvatar";
import { Tools } from "./tools/Tools";
import { AppContext } from "../../store/app-context";
import {
  getRenderedUsername,
  getNpub,
  isGuest,
} from "../../utils/helpers/general";
import { AccountsMenu } from "./accounts-menu/AccountsMenu";
import { useSearchParams } from "react-router-dom";
import { useOptimizedMediaSource } from "../../hooks/useOptimizedMediaSource";
import { ImportPubkeyModal } from "../onboarding/ImportPubkeyModal";
import {
  SafeIcon,
} from "../../assets";


const CHANGE_ACCOUNT_SEARCH_PARAM = "change-account";
const IMPORT_ACCOUNT_SEARCH_PARAM = "import-account";

export const Profile = () => {
  const contextData = useContext(AppContext);
  const {
    currentPubkey,
    onSelectKey,
    profile,
    keys,
    readKeys,
    profiles,
    onAddKey,
    onImportPubkey,
    deletePerms
  } = contextData || {};

  const { profile: originalProfile = {} } = profile || {};
  const { picture } = originalProfile || {};

  const profileImage = useOptimizedMediaSource({
    pubkey: currentPubkey,
    originalImage: picture,
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const isChangeAccountModalOpen = Boolean(
    searchParams.get(CHANGE_ACCOUNT_SEARCH_PARAM)
  );
  const isImportAccountModalOpen = Boolean(
    searchParams.get(IMPORT_ACCOUNT_SEARCH_PARAM)
  );

  const openChangeAccountModalHandler = () => {
    searchParams.set(CHANGE_ACCOUNT_SEARCH_PARAM, true);
    setSearchParams(searchParams);
  };

  const openImportAccountModalHandler = () => {
    searchParams.set(IMPORT_ACCOUNT_SEARCH_PARAM, true);
    searchParams.delete(CHANGE_ACCOUNT_SEARCH_PARAM);
    setSearchParams(searchParams, { replace: true });
  };

  const closeChangeModalHandler = () => {
    searchParams.delete(CHANGE_ACCOUNT_SEARCH_PARAM);
    setSearchParams(searchParams, { replace: true });
  };

  const closeImportModalHandler = () => {
    searchParams.delete(IMPORT_ACCOUNT_SEARCH_PARAM);
    searchParams.set(CHANGE_ACCOUNT_SEARCH_PARAM, true);
    setSearchParams(searchParams, { replace: true });
  };
  
  const changeAccountHandler = (pubkey) => {
    onSelectKey(pubkey);
    closeChangeModalHandler();
  };

  const importPubkeyHandler = (pubkey) => {
    onImportPubkey(pubkey);
    closeImportModalHandler();    
    closeChangeModalHandler();
  };
  
  const currentUsername = getRenderedUsername(profile?.profile, currentPubkey);

  const accounts = keys.map((k) => {
    return {
      pubkey: k,
      readOnly: readKeys.includes(k),
      ...profiles?.find((p) => p.pubkey === k)
    };
  });

  const tools = [
    {
      title: "Delete key permissions",
      id: "delete-perms",
      Icon: SafeIcon,
      onClick: () => deletePerms(),
    },
  ];
  
  return (
    <>
      <Container>
        <ProfileAvatar
          username={currentUsername}
          profileImage={profileImage}
          onOpenChangeAccountModal={openChangeAccountModalHandler}
          onAddKey={onAddKey}
          isGuest={isGuest(currentPubkey)}
        />
        <Tools tools={tools} />
      </Container>

      <AccountsMenu
        isOpen={isChangeAccountModalOpen}
        onClose={closeChangeModalHandler}
        accounts={accounts}
        currentUserNpub={isGuest(currentPubkey) ? "" : getNpub(currentPubkey)}
        onChangeAccount={changeAccountHandler}
        onAddKey={onAddKey}
        onImportPubkey={openImportAccountModalHandler}
      />

      <ImportPubkeyModal
	isOpen={isImportAccountModalOpen}
        onClose={closeImportModalHandler}
	       onSelect={importPubkeyHandler}
      />

    </>
  );
};

const Container = styled("div")(() => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
}));
