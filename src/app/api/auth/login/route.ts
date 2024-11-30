import { NextResponse } from 'next/server';
import { supabase } from '../../../../../lib/initSupabase';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { user: data.user, session: data.session },
      { status: 200 }
    );
  } catch (err) {
    console.error('Error during login:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
