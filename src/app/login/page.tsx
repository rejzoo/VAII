'use client';

import { useState } from 'react';
import LoginForm from '../components/auth/LoginSigninForm';

interface LoginPageProps {
  onClose: () => void;
  setIsLoggedIn: (status: boolean) => void;
}

export default function LoginPage({ onClose, setIsLoggedIn }: LoginPageProps) {
  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function toggleForms() {
    setIsLoginPage(!isLoginPage);
    setErrorMessage(null);
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md sm:max-w-lg relative border border-gray-600">
        <LoginForm onClose={onClose} isLogin={isLoginPage} setIsLoggedIn={setIsLoggedIn} />
        
        {errorMessage && (
          <div className="mt-4 text-red-500 bg-red-100 p-2 rounded text-sm">
            {errorMessage}
          </div>
        )}

        <button className="mt-4 text-white underline" onClick={toggleForms}>
          {isLoginPage ? 'No account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  );
}