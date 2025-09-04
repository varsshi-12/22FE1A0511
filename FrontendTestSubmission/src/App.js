import React from "react";
import { Routes, Route } from "react-router-dom";
import Container from "@mui/material/Container";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Stats from "./pages/Stats";
import RedirectPage from "./pages/RedirectPage";
import { StoreProvider } from "./lib/store";

export default function App() {
  return (
    <StoreProvider>
      <NavBar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/:code" element={<RedirectPage />} />
        </Routes>
      </Container>
    </StoreProvider>
  );
}
