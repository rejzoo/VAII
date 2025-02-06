'use client'

import { SearchBarPlayer } from "./ui/SearchBar";
import { useState, useEffect } from "react";
import LoginPage from "../login/page";
import LogoutButton from "./ui/LogOutButton";
import { isLoggedIn } from "../api/auth/actions/actions";

export default function Header() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLoggedInAtr, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const status = await isLoggedIn();
        setIsLoggedIn(status);
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus();
  }, []);

  return (
    <div className="flex items-center justify-between p-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600">
      <div className="flex-1 flex justify-center">
        <SearchBarPlayer isLarge={false} />
      </div>
      <div className="w-24 flex items-center justify-end">
        {isLoggedInAtr ? (
          <LogoutButton setIsLoggedIn={(status) => setIsLoggedIn(status)} />
        ) : (
          <button
            className="bg-white/10 border border-white/30 text-white py-2 px-4 rounded-lg hover:bg-white/20 focus:outline-none"
            onClick={() => setIsLoginOpen(true)}
          >
            Login
          </button>
        )}
      </div>
      {isLoginOpen && (
        <LoginPage
          onClose={() => setIsLoginOpen(false)}
          setIsLoggedIn={(status) => setIsLoggedIn(status)}
        />
      )}
    </div>
  );
}
