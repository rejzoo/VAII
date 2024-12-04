'use server';

import { createClient } from '../../../utils/supabase/server';
import { revalidatePath } from 'next/cache';
import { validateEmail, validatePassword, validateName } from '../../../utils/validators/validators'

const emailErrorMessage = 'Invalid email format.';
const passwordErrorMessage = 'Password must be at least 6 characters, contain one uppercase letter, and one number.';
const nameErrorMessage = 'Name must be 3-15 characters long and can only include letters, numbers, or underscores.';

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!validateEmail(email)) {
    console.error('Invalid email format.');
    return { success: false, error: `Login failed. ${emailErrorMessage}` };
  }

  if (!validatePassword(password)) {
    console.error('Invalid password format.');
    return { success: false , error: `Login failed. ${passwordErrorMessage}`};
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.error('Login failed:', error.message);
    return { success: false, error: 'Login failed. Please check your credentials.' };
  }

  return { success: true };
  //revalidatePath('/');
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  if (!validateName(name)) {
    console.error('Invalid name format.');
    return { success: false, error: nameErrorMessage };
  }

  if (!validateEmail(email)) {
    console.error('Invalid email format.');
    return { success: false, error: `Signup failed. ${emailErrorMessage}` };
  }

  if (!validatePassword(password)) {
    console.error('Invalid password format.');
    return { success: false, error: passwordErrorMessage };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });

  if (error) {
    console.error('Signup failed:', error.message);
    return { success: false, error: error.message};
  }

  return { success: true };
  //revalidatePath('/');
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
  }

  revalidatePath('/');
}

export async function isLoggedIn() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) {
    console.log('User is not logged in.');
    return false;
  }

  console.log('User is logged in.');
  return true;
}