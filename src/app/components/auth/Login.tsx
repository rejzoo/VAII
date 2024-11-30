'use client';

import { FormEvent } from 'react';

interface LoginProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
  isLogin: boolean;
}

//LOGIN A REGISTER JE ASI SPRAVENY - TREBA SPRAVIT RENDEROVANIE LOGOUT A VALIDACIU ASI

export default function LoginSigninForm({ onSubmit, onClose, isLogin }: LoginProps) {
  return (
    <form onSubmit={onSubmit}>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white hover:text-gray-900"
      >
        ✕
      </button>
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full p-2 mt-7 mb-3 rounded bg-gray-600"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full p-2 mb-3 rounded bg-gray-600"
      />
      <button type="submit" className="w-full bg-red-600 text-white p-2 rounded">
        { isLogin ? 'Log in' : 'Sign up' }
      </button>
    </form>
  );
}
