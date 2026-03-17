import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { pingBackend } from "../api";

const navLinks = [
  { path: "/", label: "Home" },
  { path: "/analyze", label: "Analyze" },
  { path: "/about", label: "About" },
];

const Navbar = () => {
  const [isOnline, setIsOnline] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      const online = await pingBackend();
      setIsOnline(online);
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-primary/10 px-4 md:px-10 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo + Name */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="material-symbols-outlined text-primary text-4xl">
            energy_savings_leaf
          </span>
          <span className="font-extrabold tracking-tight text-slate-900 text-2xl">
            Leaf<span className="text-primary">Sense</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold no-underline transition-colors ${
                isActive(link.path)
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-slate-600 hover:text-primary"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Status + Hamburger */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                isOnline ? "bg-primary" : "bg-red-500"
              }`}
            />
            <span className="text-xs text-slate-500">
              {isOnline ? "API Online" : "API Offline"}
            </span>
          </div>

          <button
            className="md:hidden p-2 text-slate-600 hover:text-primary transition-colors"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            <span className="material-symbols-outlined text-2xl">
              {menuOpen ? "close" : "menu"}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen ? (
        <div className="md:hidden bg-white border-t border-slate-100 shadow-lg mt-3">
          <div className="px-4 py-3 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-sm font-medium no-underline ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-2 px-3 py-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  isOnline ? "bg-primary" : "bg-red-500"
                }`}
              />
              <span className="text-xs text-slate-500">
                {isOnline ? "API Online" : "API Offline"}
              </span>
            </div>
          </div>
        </div>
      ) : null}
    </nav>
  );
};

export default Navbar;
