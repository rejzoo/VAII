'use client';

import { createClient } from '../../utils/supabase/client';

export default function LogoutButton() {
  const handleLogout = async () => {
        try {
        const supabase = createClient();
        const { error } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        console.log('Logged out successfully');
        window.location.href = '/';
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error during logout:', error.message);
                alert('Failed to log out. Please try again.');
            } else {
                console.error('Unexpected error during logout:', error);
                alert('An unexpected error occurred. Please try again.');
            }
        }
    };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-800 text-white p-2 rounded hover:bg-red-600"
    >
      Log out
    </button>
  );
}
