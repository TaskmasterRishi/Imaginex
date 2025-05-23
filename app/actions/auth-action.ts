'use server'

import { createClient } from "@/lib/supabase/server"

interface AuthResponse {
  error: string | null;
  success: boolean;
  data: unknown | null;
}

export async function signup(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      }
    }
  }

  const { data: signUpData, error } = await supabase.auth.signUp(data);
  
  return {
    error: error ? error.message : "There was an error signing up",
    success: !error,
    data: signUpData,
  }
}

export async function login(formData: FormData): Promise<AuthResponse> {
  const supabase = await createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        full_name: formData.get('full_name') as string,
      }
    }
  }

  const { data: signInData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password
  });
  
  return {
    error: error ? error.message : "There was an error logging in",
    success: !error,
    data: signInData,
  }
}