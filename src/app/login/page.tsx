'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import LoginForm from '../components/auth/Login';

export default function LoginPage({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [isLoginPage, setIsLoginPage] = useState<boolean>(true);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const endpoint = isLoginPage ? '../api/auth/login' : '../api/auth/register';
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
    
      const result = await response.json();
    
      if (response.ok) {
        router.push('/profile');
      } else {
        console.error('Request failed:', result.error);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    }
  }

  function toggleForms() {
    setIsLoginPage(!isLoginPage);
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
        <LoginForm onSubmit={handleSubmit} onClose={onClose} isLogin={isLoginPage} /> 
        <button className="mt-4 text-white underline" onClick={toggleForms}>
          { isLoginPage ? 'No account? Sign up' : 'Already have an account? Sign in' }
        </button>
      </div>
    </div>
  );
}
