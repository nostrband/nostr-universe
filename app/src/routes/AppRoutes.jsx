import { Box, styled, CircularProgress } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AnimatePresence } from "framer-motion";

const MainPage = lazy(() => import("../pages/Main.Page"));
const ProfilePage = lazy(() => import("../pages/Profile.Page"));

const AppRoutes = () => {
  const location = useLocation();

  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <CircularProgress size={40} thickness={4} className="spinner" />
        </LoaderContainer>
      }
    >
      <AnimatePresence mode="wait">
        <Routes key={location.pathname} location={location}>
          <Route index path="/" element={<MainPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AnimatePresence>
    </Suspense>
  );
};

const LoaderContainer = styled(Box)(() => ({
  position: "fixed",
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  display: "grid",
  placeItems: "center",
  "& .spinner": {
    color: "white",
  },
}));

export default AppRoutes;
