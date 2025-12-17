import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// import GradientBackgroundPage from "./pages/GradientBackgroundPage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import CollectionPage from "./pages/CollectionPage";
import { useEffect } from "react";
import Lenis from "lenis";

function LenisProvider() {
  useEffect(() => {
    const lenis = new Lenis({ autoRaf: true });
    return () => lenis.destroy();
  }, []);

  return null;
}

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/collectionPage" element={<CollectionPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Collections route */}
      <Route path="/collections" element={<CollectionPage />} />
      <Route path="/collections/:category" element={<CollectionPage />} />

      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <BrowserRouter>
         <LenisProvider />
          <AppRouter />
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
