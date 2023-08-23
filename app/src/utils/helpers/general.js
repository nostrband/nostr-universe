import { nip19 } from "@nostrband/nostr-tools";

export const getShortenText = (str) => {
  const string = String(str);
  return `${string.substring(0, 10)}...${string.substring(59)}`;
};

export const getNpub = (key) => {
  return nip19.npubEncode(key);
};

export const getNoteId = (key) => {
  return nip19.noteEncode(key);
};

export const getProfileImage = (profile) => {
  if (profile && profile?.picture) {
    return profile.picture;
  }
  return "";
};

export const isGuest = (pubkey) => {
  return !pubkey || pubkey.length !== 64;
};

export const getRenderedUsername = (profile, pubkey) => {
  return (
    profile?.display_name ||
    profile?.name ||
    (isGuest(pubkey) ? "Guest" : getShortenText(getNpub(pubkey)))
  );
};

export const renderDefaultAppIcon = (title) => {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;

  const ctx = canvas.getContext("2d");

  // background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // text
  ctx.font = "bold 92px Outfit";
  ctx.fillStyle = "purple";
  ctx.fillText(title.substring(0, 1).toUpperCase(), 32, 95);
  const dataURL = canvas.toDataURL();
  return dataURL;
};

export const formatTime = (tm) => {
  let o = Date.now() / 1000 - tm;

  const future = o < 0;
  
  o = Math.abs (o);

  let s = o + "s";
  o /= 60;
  if (o >= 1.0)
    s = Math.round(o) + "m";
  o /= 60;
  if (o >= 1.0)
    s = Math.round(o) + "h";
  o /= 24;
  if (o >= 1.0)
    s = Math.round(o) + "d";

  return (future ? "+" : "") + s;
}
