'use client';

import { login, signup } from '../../api/auth/actions/actions'
import { validateEmail, validatePassword, validateName} from '../../utils/validators/validators'

interface LoginProps {
  onClose: () => void;
  isLogin: boolean;
}

export default function LoginSigninForm({ onClose, isLogin }: LoginProps) {
  const handleResult = (result: { success?: boolean; error?: string }, successMessage: string) => {
    const resultDiv = document.getElementById('result');
    if (resultDiv) {
      if (result?.success) {
        resultDiv.textContent = successMessage;
        resultDiv.style.color = 'green';
        onClose();
      } else if (result?.error) {
        resultDiv.textContent = result.error;
        resultDiv.style.color = 'red';
      }
    }
  };

  const validateInput = (formData: FormData): string | null => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string | null;
    
    if (!isLogin && name != null && !validateName(name)) {
      return 'CLIENT CHECK: Name must be 3-15 characters long and can only include letters, numbers, or underscores.';
    }
    if (!validateEmail(email)) {
      return 'CLIENT CHECK: Invalid email format.';
    }
    if (!validatePassword(password)) {
      return 'CLIENT CHECK: Password must be at least 6 characters, contain one uppercase letter, and one number.';
    }

    console.log("DATA OK");
    return null;
  };

  return (
    <form onSubmit={(e) => e.preventDefault()}>
      <div className='mb-10'>
      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-white hover:text-gray-900"
      >
        ✕
      </button>
      </div>
      { !isLogin &&
      <input
        id="name"
        type="text"
        name="name"
        placeholder="Nickname"
        required
        className="w-full p-2 mb-3 rounded bg-gray-600"
      />
      }
      <input
        id="email"
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full p-2 mb-3 rounded bg-gray-600"
      />
      <input
        id="password"
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full p-2 mb-3 rounded bg-gray-600"
      />
      {isLogin ?
        <button onClick={async () => {
          const form = document.querySelector('form');
          const formData = new FormData(form!);
          const validationError = validateInput(formData);
            if (validationError) {
              console.log("LOG IN ERROR VALIDATION");
              handleResult({ success: false, error: validationError }, '');
              return;
            }
          const result = await login(formData);
          handleResult(result || { success: false, error: 'Unexpected error occurred.' }, 'Login successful!');
        }} 
        type="button" className="w-full bg-red-600 text-white p-2 rounded">
          Log in
        </button> 
        :
        <button onClick={async () => {
          console.log("SIGN IN");
          const form = document.querySelector('form');
          const formData = new FormData(form!);
          const validationError = validateInput(formData);
            if (validationError) {
              console.log("SIGN UP ERROR VALIDATION");
              handleResult({ success: false, error: validationError }, '');
              return;
            }
          const result = await signup(formData);
          handleResult(result || { success: false, error: 'Unexpected error occurred.' }, 'Signup successful!');
        }}
        type="button" className="w-full bg-red-600 text-white p-2 rounded">
          Sign up
        </button>
      }
      <div id="result" className="mt-3 text-center text-sm"></div>
    </form>
  );
}
