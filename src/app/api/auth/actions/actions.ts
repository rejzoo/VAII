'use server';

import { createClient } from '../../../utils/supabase/server';
import { validateEmail, validatePassword, validateName } from '../../../utils/validators/validators'

const emailErrorMessage = 'Invalid email format.';
const passwordErrorMessage = 'Password must be at least 6 characters, contain one uppercase letter, and one number.';
const nameErrorMessage = 'Name must be 3-15 characters long and can only include letters, numbers, or underscores.';

export async function login(formData: FormData) {
  console.log("SERVER LOGIN");
  if (!formData) return;
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
}

export async function signup(formData: FormData) {
  if (!formData) return;
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

  const { data: existingUser, error: nicknameCheckError } = await supabase
    .from('UserData')
    .select('user_id')
    .eq('nickname', name)
    .single();

  //PGRST116 no rows found
  if (nicknameCheckError && nicknameCheckError.code !== 'PGRST116') {
    console.error('Error checking nickname:', nicknameCheckError.message);
    return { success: false, error: 'Unexpected error occurred while checking nickname availability.' };
  }

  if (existingUser) {
    return { success: false, error: 'Nickname is already taken.' };
  }

  const { data: signUpResult, error: signUpError  } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    console.error('Signup failed:', signUpError.message);
    return { success: false, error: signUpError.message};
  }

  const userId = signUpResult.user?.id;
  if (!userId) {
    console.error('Signup succeeded, but user ID is missing.');
    return { success: false, error: 'Unexpected error occurred after registration.' };
  }

  const { error: insertError } = await supabase
    .from('UserData')
    .insert({ user_id: userId, nickname: name });

  if (insertError) {
    console.error('Failed to insert nickname into UserData:', insertError.message);
    return { success: false, error: 'Signup succeeded, but failed to save user data.' };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error('Logout failed:', error.message);
    return false;
  }
  return true;
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

export async function updateNickname(newNickname: string): Promise<boolean> {
  if (!validateName(newNickname)) {
    console.log("ZLE MENO");
    return false;
  }

  const supabase = await createClient();
  const userID = (await supabase.auth.getUser()).data.user?.id;

  const { error } = await supabase
    .from('UserData')
    .update({ nickname: newNickname })
    .eq('user_id', userID);

  return !error;
}

export async function deleteUser(): Promise<boolean> {
  const supabase = await createClient();
  const userID = (await supabase.auth.getUser()).data.user?.id;
  const shouldSoftDelete = false;

  if (!userID) return false;
  logout();

  const { error } = await supabase.auth.admin.deleteUser(userID, shouldSoftDelete);

  console.log(error);

  return !error;
}

export async function getNickname(): Promise<string | null> {
  const supabase = await createClient();
  const userID = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from('UserData')
    .select('nickname')
    .eq('user_id', userID)
    .single();

    if (error) {
      console.error('Error fetching nickname:', error);
      return null;
    }

  return data.nickname;
}

export async function getUserDetails(): Promise<{ email: string | null; createdAtDate: string | null; role: string | null }> {
  const supabase = await createClient();
  const user = (await supabase.auth.getUser()).data.user;
  
  if (!user) {
    console.error("No user logged in.");
    return { email: null, createdAtDate: null, role: null };
  }

  const email = user.email;
  const createdAt = user.created_at;

  const { data } = await supabase
    .from('UserData')
    .select('role')
    .eq('user_id', user.id)
    .single();

  if (!data?.role || !email || !createdAt) {
    console.error("Data missing.");
    return { email: null, createdAtDate: null , role: null};
  }

  const createdAtDate = new Date(createdAt).toISOString().replace("T", " ").split(".")[0];;

  return { email: email, createdAtDate: createdAtDate, role: data.role };
}

export async function getUserRole(): Promise<string | null> {
  const supabase = await createClient();
  const userID = (await supabase.auth.getUser()).data.user?.id;

  const { data, error } = await supabase
    .from('UserData')
    .select('role')
    .eq('user_id', userID)
    .single();

    if (error) {
      console.error('Error fetching role:', error);
      return null;
    }

  return data.role;
}
