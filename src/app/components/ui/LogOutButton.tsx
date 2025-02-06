'use client'

import { logout } from "@/app/api/auth/actions/actions";

interface LogoutButtonProps {
  setIsLoggedIn: (status: boolean) => void;
}

export default function LogoutButton({ setIsLoggedIn } : LogoutButtonProps) {
  
  const LogOut = async () => {
      const success = await logout();
      if (success) {
        setIsLoggedIn(false);
        location.reload();
      }
  }

  return (
    <button
      onClick={LogOut}
      className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
    >
      Log out
    </button>
  );
}
