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
        const userRole = await getUserRole();
        if (userRole) {
          setUserRole(userRole);
        }
      } catch (error) {
        console.error('Error fetching role:', error);
      }
    }

    fetchRole();
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen w-55 bg-gray-800 text-white flex-shrink-0 top-0 left-0 flex flex-col shadow-lg">
        <h1 className="text-2xl font-bold p-4 border-b border-gray-700">Seal Clubber</h1>
        <p className="p-4 text-center text-gray-400">Loading...</p>
      </div>
    );
  }

  console.log('isLoggedIn:', isLoggedIn);
  console.log('user:', user);
  console.log('loading:', loading);

  return (
    <div className="min-h-screen w-55 bg-gray-800 text-white flex-shrink-0 top-0 left-0 flex flex-col shadow-lg">
      <h1 className="text-2xl font-bold p-4 border-b border-gray-700">Seal Clubber</h1>

      <nav className="flex-1 mt-5">
        {isLoggedIn && (
          <>
            { userRole == "admin" && (<MenuLink href="/admin" text="ADMIN" color="text-red-600"/>)}
            <MenuLink href="/profile/details" text="Profile"/>
          </>
        )}
        <MenuLink href="/" text="Home"/>
        <MenuLink href="/tanks" text="Tanks"/>
        <MenuLink href="/servers/EU" text="Servers"/>
        <MenuLink href="/mastery/EU" text="Mastery"/>
        <MenuLink href="/moe/EU" text="MOE"/>
      </nav>
    </div>
  );
}
