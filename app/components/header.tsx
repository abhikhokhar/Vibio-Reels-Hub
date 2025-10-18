"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, User, Upload, LogOut } from "lucide-react";
import { useNotification } from "./Notification";
import { ThemeToggleButton } from "./themeToggleButton";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Handle outside click to close menus
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: "/login" });
      showNotification("Signed out successfully", "success");
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <header
      ref={dropdownRef} // Attach ref here to handle outside clicks for both menus
      className="sticky top-0 z-50 border-purple-600 bg-black text-gray-200 bg-base-300 border-b border-base-200 shadow-sm"
    >
      <div className="container mx-auto flex justify-between items-center px-4 py-3 lg:px-8">
        {/* Left: Logo */}
        <Link
          href="/"
          className="flex items-center text-2xl font-extrabold text-foreground tracking-tight"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-8 h-8 text-purple-600 mr-2"
          >
            <path d="M15 10.5V6a2 2 0 0 0-2-2H5A2 2 0 0 0 3 6v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4.5l6 4.5V6l-6 4.5z" />
          </svg><span className="text-gray-200">Vib</span><span className="text-purple-600">io</span>
        </Link>

        {/* Right: Desktop Menu (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6">
          {session ? (
            <>
              <Link
                href="/upload"
                className="flex items-center gap-1 text-lg font-semibold transition-colors"
                onClick={() => showNotification("Upload your video 🎥", "info")}
              >
                <Upload className="w-4 h-4 text-purple-600" /> Upload
              </Link>

              <div className="relative">
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  className="flex items-center gap-2 px-3 py-2 bg-base-200 rounded-xl hover:bg-base-100 transition"
                >
                  <User className="w-5 h-5 text-purple-600" />
                  <span className="text-lg font-semibold truncate max-w-[120px]">
                    {session?.user?.email?.split("@")[0]}
                  </span>
                </button>

                {menuOpen && (
                  <ul className="absolute right-0 mt-3 w-56 bg-white/95 shadow-xl rounded-2xl border border-gray-200 overflow-hidden animate-fade-in backdrop-blur-md">
                    <li>
                      <button
                        onClick={handleSignOut}
                        className="flex items-center w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200 gap-2 group"
                      >
                        <div className="p-2 bg-red-100 rounded-full transition-transform duration-200 group-hover:-translate-x-1">
                          <LogOut className="w-5 h-5" />
                        </div>
                        <span className="transition-transform duration-200 group-hover:translate-x-1">
                          Sign Out
                        </span>
                      </button>
                    </li>
                  </ul>
                )}


              </div>
            </>
          ) : (
            <Link
              href="/login"
              onClick={() =>
                showNotification("Please sign in to continue", "info")
              }
              className="text-sm font-medium hover:text-purple-600 transition-colors"
            >
              Login
            </Link>
          )}
          <ThemeToggleButton />
        </div>

        {/* Right: Mobile Controls (visible on mobile) */}
        <div className="flex items-center gap-4 md:hidden">

          {session && (
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center justify-center p-2 rounded-md hover:bg-base-200 transition"
            >
              <User className="w-5 h-5 text-purple-600" />
              <span className="text-md font-semibold truncate max-w-[120px]">
                {session?.user?.email?.split("@")[0]}
              </span>
            </button>

          )}


          <ThemeToggleButton />
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden rounded-xl  border-base-200 bg-base-100 shadow-inner animate-slide-down">
          <nav className="flex flex-col space-y-1 p-4 ">
            {session ? (
              <>
                <Link
                  href="/upload"
                  onClick={() => {
                    setMenuOpen(false);
                    showNotification("Upload your video 🎬", "info");
                  }}
                  className="flex items-center gap-2 py-2 text-sm font-medium hover:text-purple-600"
                >
                  <Upload className="w-4 h-4 text-purple-600" /> Upload
                </Link>

                <button
                  onClick={() => {
                    setMenuOpen(false);
                    handleSignOut();
                  }}
                  className="flex items-center gap-2 py-2 text-sm font-medium text-error hover:text-red-700"
                >
                  <LogOut className="w-4 h-4 text-purple-600" /> Sign Out
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => {
                  setMenuOpen(false);
                  showNotification("Please sign in to continue", "info");
                }}
                className="py-2 text-sm font-medium hover:text-purple-600"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}