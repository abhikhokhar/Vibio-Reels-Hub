"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User } from "lucide-react";
import { useNotification } from "./Notification";
import Image from "next/image";
import { ThemeToggleButton } from "./themeToggleButton";

export default function Header() {
  const { data: session } = useSession();
  const { showNotification } = useNotification();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Toggle dropdown open/close
  const toggleDropdown = () => setOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        // ensure event.target is a Node before using contains
        event.target instanceof Node &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      showNotification("Signed out successfully", "success");
      setOpen(false);
    } catch {
      showNotification("Failed to sign out", "error");
    }
  };

  return (
    <div className="navbar bg-base-300 sticky top-0 z-40">
      <div className="container mx-auto">
        <div className="flex-1 px-2 lg:flex-none">
          <Link
            href="/"
            className="text-3xl gap-2 normal-case font-bold"
            prefetch={true}
            onClick={() =>
              showNotification("Welcome to ImageKit ReelsPro", "info")
            }
          >
            Vibio - Reels Hub
          </Link>
        </div>

        <div className="flex flex-1 justify-end px-2">
          <div className="flex items-stretch gap-2" ref={dropdownRef}>
            <div className="relative">
              {/* Button */}
              <button
                onClick={toggleDropdown}
                className="btn m-1  hover:cursor-pointer"
                aria-haspopup="true"
                aria-expanded={open}
              >
                <User className="w-7 h-7" />
                
              </button>
              <span className="hidden lg:inline hover:cursor-pointer text-xl font-semibold" onClick={toggleDropdown}>{session?.user?.email?.split("@")?.[0] ?? ""}</span>

              {/* Dropdown */}
              <ul
                className={`absolute right-0 w-64 mt-2 bg-base-100 rounded-box shadow-lg py-2 transition-all duration-200 ease-in-out transform origin-top z-[999] 
                ${open
                  ? "opacity-100 scale-100 translate-y-0"
                  : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
              >
                {session ? (
                  <>
                    <li className="px-4 py-1">
                      <span className="text-sm opacity-70">
                        {session.user?.email?.split("@")[0]}
                      </span>
                    </li>
                    <div className="divider my-1"></div>

                    <li>
                      <Link
                        href="/upload"
                        className="px-4 py-2 hover:bg-base-200 block w-full"
                        onClick={() => {
                          showNotification("Welcome to Admin Dashboard", "info");
                          setOpen(false);
                        }}
                      >
                        Video Upload
                      </Link>
                    </li>

                    <li>
                      <button
                        onClick={handleSignOut}
                        className="px-4 py-2 text-error hover:bg-base-200 w-full text-left"
                      >
                        Sign Out
                      </button>
                    </li>
                  </>
                ) : (
                  <li>
                    <Link
                      href="/login"
                      className="px-4 py-2 hover:bg-base-200 block w-full"
                      onClick={() => {
                        showNotification("Please sign in to continue", "info");
                        setOpen(false);
                      }}
                    >
                      Login
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <ThemeToggleButton />
        </div>
      </div>
    </div>
  );
}
