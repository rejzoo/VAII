'use client';

import { login, signup } from '../../api/auth/actions/actions'

interface LoginProps {
  onClose: () => void;
  isLogin: boolean;
}

//LOGIN A REGISTER JE ASI SPRAVENY - TREBA SPRAVIT RENDEROVANIE LOGOUT

export default function LoginSigninForm({ onClose, isLogin }: LoginProps) {
  return (
    <form>
      <h1>{isLogin}</h1>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white hover:text-gray-900"
      >
        ✕
      </button>
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full p-2 mt-7 mb-3 rounded bg-gray-600"
      />
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full p-2 mb-3 rounded bg-gray-600"
      />
      
      { isLogin ? 
        <button formAction={login} className="w-full bg-red-600 text-white p-2 rounded" >Log in</button> 
        :
        <button formAction={signup} className="w-full bg-red-600 text-white p-2 rounded" >Sign up</button>
      }
    </form>
  );
}
