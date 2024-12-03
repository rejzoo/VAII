'use client';

import { useState } from 'react';
import LoginForm from '../components/auth/Login';

export default function LoginPage({ onClose }: { onClose: () => void }) {
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
        <LoginForm onClose={onClose} isLogin={isLoginPage} />
        
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

/*

async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    const passwordRegex = /^(?=.*\d)[A-Za-z\d]{6,}$/;
    if (!isLoginPage && !passwordRegex.test(password)) {
      setErrorMessage('Password must be at least 6 characters long and contain at least one number.');
      return;
    }

    try {
      const endpoint = isLoginPage ? '../api/auth/login' : '../api/auth/register';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push('/');
      } else {
        setErrorMessage(result.error || 'An error occurred. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Unexpected error. Please try again later.');
      console.error('Unexpected error:', error);
    }
  }

*/