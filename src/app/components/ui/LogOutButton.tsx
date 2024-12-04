'use client'

import { logout } from "@/app/api/auth/actions/actions";

export default function LogoutButton() {
  
  return (
    <button
      onClick={logout}
      className="bg-gray-800 text-white p-2 rounded hover:bg-red-600"
    >
      Log out
    </button>
  );
}
