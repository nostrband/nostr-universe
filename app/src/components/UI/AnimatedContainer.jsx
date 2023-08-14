import React from "react";
import { motion } from "framer-motion";

const getAnimationVariants = (direction) => {
  const x = direction === "right" ? "-100%" : "200%";
  return {
    initial: { x, opacity: 0 },
    mount: { x: 0, opacity: 1 },
    exit: { x, opacity: 0 },
  };
};

export const AnimatedContainer = ({ children, direction = "right" }) => {
  return (
    <motion.div
      initial="initial"
      animate="mount"
      exit={"exit"}
      variants={getAnimationVariants(direction)}
      transition={{ duration: 0.1 }}
      style={{ height: "100%" }}
    >
      {children}
    </motion.div>
  );
};
