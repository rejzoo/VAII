'use client'

import { useState, useEffect } from "react";
import { updateNickname, deleteUser, getNickname, isLoggedIn, getUserDetails } from "@/app/api/auth/actions/actions";
import { validateName } from "@/app/utils/validators/validators";

export default function ProfileDetails() {
    const [nickname, setNickname] = useState('');
    const [nicknameToSet, setNicknameToSet] = useState('');
    const [message, setMessage] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [userData, setUserData] = useState<{ email: string | null; createdAtDate: string | null; role: string | null }>({
      email: null,
      createdAtDate: null,
      role: null
  });

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

    useEffect(() => {
        const fetchUserDetails = async () => {
            const details = await getUserDetails();
            setUserData(details);
        };

        fetchUserDetails();
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
      <div className="max-w-3xl mx-auto mt-10 p-6 bg-gradient-to-b from-indigo-800 to-purple-800 shadow-lg rounded-lg">
        <h1 className="font-bold text-4xl text-white mb-6 text-center">Profile Details</h1>
        {loggedIn && (
          <>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                Logged in as: <span className="text-red-500">{nickname}</span>
                <p>Email: {userData.email || 'Not available'}</p>
                <p>Account created: {userData.createdAtDate || 'Not available'}</p>
                <p>Role: {userData.role || 'Not available'}</p>
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
                  className="flex-1 bg-gray-900 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  onClick={handleNicknameChange}
                  className="bg-purple-700 text-white py-2 px-6 rounded-lg hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-600"
                >
                  Update
                </button>
              </div>
              {message && <div className="mt-2 text-red-500">{message}</div>}
            </div>
    
            <div className="border-t border-purple-200 pt-6 mt-6">
              <h3 className="text-white font-semibold mb-4 text-lg">Account Management</h3>
              <div className="flex items-center justify-between">
                <p className="text-white">
                  <span className="text-red-500 font-bold">Warning:</span> Permanently delete your account.
                </p>
                <button
                  onClick={handleDeleteAccount}
                  className="bg-red-600 text-white py-2 px-6 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400"
                >
                  DELETE
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
    
    
    
}