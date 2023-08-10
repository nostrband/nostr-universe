import { nip19 } from "@nostrband/nostr-tools";

export const getShortenText = (str) => {
  const string = String(str);
  return `${string.substring(0, 10)}...${string.substring(59)}`;
};

export const getNpub = (key) => {
  return nip19.npubEncode(key);
};

export const getProfileImage = (profile) => {
  if (profile && profile?.picture) {
    return profile.picture;
  }
  return "";
};

export const getRenderedUsername = (profile, pubkey) => {
  return (
    profile?.profile?.display_name ||
    profile?.profile?.name ||
    (pubkey.length == 64 ? getShortenText(getNpub(pubkey)) : "Guest")
  );
};
