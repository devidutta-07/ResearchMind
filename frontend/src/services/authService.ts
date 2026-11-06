
import { supabase } from "./supabase";
import type { User } from "../types";

// Fetch user profile from Supabase
export const getUserProfile = async (userId: string): Promise<User> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, name, email, role")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error("Unable to fetch user profile: " + error.message);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    role: data.role as User["role"],
  };
};

// Sign up
export const signup = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Signup failed. Please try again.");
  }

  if (!data.session) {
    throw new Error("Please verify your email before signing in.");
  }

  return await getUserProfile(data.user.id);
};

// Login
export const login = async (
  email: string,
  password: string
): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  if (!data.user) {
    throw new Error("Login failed. Please try again.");
  }

  return await getUserProfile(data.user.id);
};

// Logout
export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new Error(error.message);
  }
};

// Get currently logged-in user
export const getCurrentUser = async (): Promise<User | null> => {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw new Error(error.message);
  }

  const session = data.session;

  if (!session?.user) {
    return null;
  }

  return await getUserProfile(session.user.id);
};
