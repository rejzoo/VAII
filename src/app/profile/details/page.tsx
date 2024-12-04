'use client'

import { useState, useEffect } from "react";
import { updateNickname, deleteUser, getNickname, isLoggedIn } from "@/app/api/auth/actions/actions";
import { validateName } from "@/app/utils/validators/validators";

export default function ProfileDetails() {
    const [nickname, setNickname] = useState('');
    const [nicknameToSet, setNicknameToSet] = useState('');
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const fetchNickname = async () => {
          try {
            const currentNickname = await getNickname();
            if (currentNickname) {
                setNickname(currentNickname);
            }
          } catch (error) {
            console.error('Error fetching nickname:', error);
            setMessage('Failed to fetch nickname.');
          }
        };

        const checkLogged = async () => {
            try {
              const loggedIn = await isLoggedIn();
              setLoggedIn(loggedIn);
            } catch (error) {
              console.error('Error fetching nickname:', error);
              setMessage('Failed to fetch nickname.');
            }
          };
    
        fetchNickname();
        checkLogged();
      }, []);

    const handleNicknameChange = async () => {
        if (!validateName(nicknameToSet)) {
          setMessage('Name must be 3-15 characters long and can only include letters, numbers, or underscores.');
          return;
        }
        try {
          if (!nicknameToSet.trim()) {
            setMessage('Nickname cannot be empty.');
            return;
          }
          const success = await updateNickname(nicknameToSet.trim());
          if (success) {
            setMessage('Nickname updated successfully!');
            setNickname(nicknameToSet.trim());
          } else {
            setMessage('Failed to update nickname.');
          }
        } catch (error) {
          console.error('Error updating nickname:', error);
          setMessage('Unexpected error occurred.');
        }
      };

    const handleDeleteAccount = async () => {
        try {
            const confirmed = confirm('Are you sure you want to delete your account?');
            if (!confirmed) return;

            const success = await deleteUser();
            if (success) {
            alert('Account deleted successfully.');
            //redirect to the home page todo
            } else {
            setMessage('Failed to delete account.');
            }
        } catch (error) {
            console.error('Error deleting account:', error);
            setMessage('Unexpected error occurred.');
        }
    };

return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-gray-700 shadow-lg rounded-lg">
        <h1 className="font-bold text-4xl text-white mb-6 text-center">Profile Details</h1>
        
        { loggedIn && <>
        <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">
            Logged in as: <span className="text-red-500">{nickname}</span>
        </h2>
        </div>

        <div className="mb-6">
            <label htmlFor="nickname" className="block text-white font-semibold mb-2">
                Nickname:
            </label>
            <div className="flex items-center space-x-4">
                <input
                id="nickname"
                type="text"
                placeholder={nickname}
                value={nicknameToSet}
                onChange={(e) => setNicknameToSet(e.target.value)}
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                onClick={handleNicknameChange}
                className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                Update
                </button>
            </div>
            {message && <div className="mt-2 text-red-600">{message}</div>}
        </div>

        <div className="border-t border-gray-200 pt-6 mt-6">
            <h3 className="text-white font-semibold mb-4 text-lg">Account Management</h3>
            <div className="flex items-center justify-between">
                <p className="text-white">
                <span className="text-red-600 font-bold">Warning:</span> Permanently delete your account.
                </p>
                <button
                onClick={handleDeleteAccount}
                className="bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300"
                >
                DELETE
                </button>
            </div>
        </div>
        </> }
    </div>
  );
}