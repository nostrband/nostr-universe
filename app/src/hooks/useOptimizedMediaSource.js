import { useEffect, useState } from "react";
import { defaultUserImage } from "../assets";
import { isGuest } from "../utils/helpers/general";

const MEDIA_NOSTR_BAND_BASE_URL = "https://media.nostr.band/thumbs";

const getPubkeyLast4Chars = (pubkey) => {
  if (pubkey.length >= 4) return pubkey.slice(-4);
  return pubkey;
};

export const useOptimizedMediaSource = ({
  pubkey,
  originalImage,
  mediaType = "picture",
  size = 64,
} = {}) => {
  const [isFailed, setIsFailed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const last4Chars = getPubkeyLast4Chars(pubkey);
  const generatedURL = `${MEDIA_NOSTR_BAND_BASE_URL}/${last4Chars}/${pubkey}-${mediaType}-${size}`;

  useEffect(() => {
    if (!pubkey || !originalImage || isGuest(pubkey)) return undefined;

    const image = new Image();
    image.onloadstart = function () {
      setIsLoading(true);
      setIsFailed(false);
    };
    image.onload = function () {
      setIsLoading(false);
      setIsFailed(false);
    };
    image.onerror = function () {
      setIsFailed(true);
      setIsLoading(false);
    };

    image.src = generatedURL;
  }, [pubkey, originalImage, generatedURL]);

  if (!pubkey || !originalImage || isGuest(pubkey)) {
    return defaultUserImage;
  }

  if (isLoading) {
    return defaultUserImage;
  }

  if (isFailed) {
    return originalImage;
  }

  return generatedURL;
};
