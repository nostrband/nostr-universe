import { Box, styled, CircularProgress } from "@mui/material";
import React, { Suspense, lazy } from "react";
import { Routes, Route } from "react-router-dom";

const MainPage = lazy(() => import("../pages/Main.Page"));

const AppRoutes = () => {
  return (
    <Suspense
      fallback={
        <LoaderContainer>
          <CircularProgress size={40} thickness={4} className="spinner" />
        </LoaderContainer>
      }
    >
      <Routes>
        <Route index path="/" element={<MainPage />} />
      </Routes>
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
