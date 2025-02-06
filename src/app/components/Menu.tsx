'use client'

import { useEffect, useState } from "react";
import MenuLink from "./ui/MenuLink";
import { useAuth } from '@/context/AuthContext';
import { getUserRole } from "../api/auth/actions/actions";

export default function Menu() {
  const { isLoggedIn, user, loading } = useAuth();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const role = await getUserRole();
        if (role) {
          setUserRole(role);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    };

    fetchRole();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col shadow-2xl">
        <h1 className="text-2xl font-bold p-6 border-b border-purple-400 text-purple-100">
          Seal Clubber
        </h1>
        <div className="flex flex-1 items-center justify-center">
          <p className="text-purple-200 text-lg animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-64 bg-gradient-to-b from-indigo-600 to-purple-600 text-white flex flex-col shadow-2xl">
      <h1 className="text-2xl font-bold p-6 border-b border-purple-400 text-purple-100">
        Seal Clubber
      </h1>

      <nav className="flex-1 mt-6 space-y-4 px-4">
        {isLoggedIn && (
          <>
            {userRole === "admin" && (
              <MenuLink 
                href="/admin" 
                text="ADMIN" 
                color="text-red-400 hover:text-red-600" 
              />
            )}
            <MenuLink 
              href="/profile/details" 
              text="Profile" 
              color="text-purple-100 hover:text-purple-200" 
            />
          </>
        )}
        <MenuLink 
          href="/" 
          text="Home" 
          color="text-purple-100 hover:text-purple-200" 
        />
        <MenuLink 
          href="/tanks" 
          text="Tanks" 
          color="text-purple-100 hover:text-purple-200" 
        />
        <MenuLink 
          href="/servers/EU" 
          text="Servers" 
          color="text-purple-100 hover:text-purple-200" 
        />
        <MenuLink 
          href="/mastery/EU" 
          text="Mastery" 
          color="text-purple-100 hover:text-purple-200" 
        />
        <MenuLink 
          href="/moe/EU" 
          text="MOE" 
          color="text-purple-100 hover:text-purple-200" 
        />
      </nav>

      <footer className="p-4 text-purple-200 text-sm text-center border-t border-purple-400">
        © {new Date().getFullYear()} Seal Clubber
      </footer>
    </div>
  );
}
