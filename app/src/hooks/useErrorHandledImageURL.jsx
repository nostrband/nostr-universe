import { useEffect, useRef, useState } from "react";

const getRandomColor = () => {
  const minBrightness = 50;
  const randomBrightness =
    Math.floor(Math.random() * (256 - minBrightness)) + minBrightness;
  const purpleHex = randomBrightness.toString(16).padStart(2, "0");
  return `#800080${purpleHex}`;
};

export const useErrorHandledImageURL = (imageUrl) => {
  const [url, setUrl] = useState(imageUrl);
  const colorRef = useRef(getRandomColor());

  useEffect(() => {
    setUrl(imageUrl);
  }, [imageUrl]);

  const errorHandler = () => setUrl("");

  return {
    onImageError: errorHandler,
    backgroundOnError: colorRef.current || "#800080",
    url: url,
  };
};
