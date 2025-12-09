import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import React from "react";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

import GradientBackgroundPage from "./pages/GradientBackgroundPage";
import AboutPage from "./pages/AboutPage";
import ShopPage from "./pages/ShopPage";
import ContactPage from "./pages/ContactPage";
import CollectionPage from "./pages/CollectionPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/shop" element={<ShopPage />} />
      <Route path="/collectionPage" element={<CollectionPage />} />
      <Route path="/contact" element={<ContactPage />} />


      
      <Route path="/gradient" element={<GradientBackgroundPage />} />

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
            <AppRouter />
          </BrowserRouter>
       
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// function App() {
//   return (
//     <div className="h-screen bg-black flex items-center justify-center">
//       <h1 className="text-5xl font-bold text-pink-500">
//         Tailwind Working 🎉
//       </h1>
//     </div>
//   );
// }


export default App;
