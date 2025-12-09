"use client";

import { useState } from "react";

export default function Navbar({ activePage = "home", cartCount = 0 }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "HOME", href: "/", id: "home" },
    { name: "ABOUT", href: "/about", id: "about" },
    { name: "SHOP", href: "/shop", id: "shop" },
    { name: "CONTACT", href: "/contact", id: "contact" }
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 pointer-events-auto">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between backdrop-blur-md bg-black/20 border border-white/10 rounded-full px-8 py-4">
            {/* Logo */}
            <a href="/" className="text-2xl font-light tracking-widest hover:text-gray-300 transition-colors duration-300">
              VERONA
            </a>
            
            {/* Navigation Links - Desktop */}
            <div className="hidden md:flex items-center gap-8 text-sm tracking-wider">
              {navLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.href}
                  className={`transition-colors duration-300 ${
                    activePage === link.id
                      ? "text-white border-b border-white"
                      : "hover:text-gray-300"
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </div>

            {/* Right Side - Cart & Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Shopping Cart Icon (optional) */}
              {/* {cartCount !== undefined && (
                <a href="/cart" className="relative p-2 hover:bg-white/5 rounded-full transition hidden md:block">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-white text-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-medium">
                      {cartCount}
                    </span>
                  )}
                </a>
              )} */}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-white p-2 hover:bg-white/5 rounded-full transition"
              >
                {isMobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="fixed top-28 left-0 right-0 z-40 md:hidden pointer-events-auto">
          <div className="mx-6">
            <div className="backdrop-blur-md bg-black/90 border border-white/10 rounded-2xl overflow-hidden">
              <div className="flex flex-col">
                {navLinks.map((link, index) => (
                  <a
                    key={link.id}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-8 py-4 text-sm tracking-wider transition-colors duration-300 ${
                      activePage === link.id
                        ? "bg-white/10 text-white"
                        : "hover:bg-white/5"
                    } ${index !== navLinks.length - 1 ? "border-b border-white/10" : ""}`}
                  >
                    {link.name}
                  </a>
                ))}
                
                {/* Cart in Mobile Menu */}
                {cartCount !== undefined && (
                  <a
                    href="/cart"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-8 py-4 text-sm tracking-wider hover:bg-white/5 transition-colors duration-300 border-t border-white/10 flex items-center justify-between"
                  >
                    <span>CART</span>
                    {cartCount > 0 && (
                      <span className="bg-white text-black text-xs px-2 py-1 rounded-full font-medium">
                        {cartCount}
                      </span>
                    )}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}