
import {
  createContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types";
import * as authService from "../services/authService";
import { supabase } from "../services/supabase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<User>;
  signupUser: (name: string, email: string, password: string) => Promise<User>;
  logoutUser: () => Promise<void>;
  googleLogin: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Restore the existing login session
    authService
      .getCurrentUser()
      .then((currentUser) => {
        if (mounted) setUser(currentUser);
      })
      .catch((error) => {
        console.error("Session restoration failed:", error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    // Listen for login, logout and session changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
        return;
      }

      // Fetch profile outside the auth callback
      setTimeout(() => {
        authService
          .getUserProfile(session.user.id)
          .then((profile) => {
            if (mounted) setUser(profile);
          })
          .catch((error) => {
            console.error("Profile loading failed:", error);
          });
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const loginUser = async (email: string, password: string) => {
    const loggedUser = await authService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const signupUser = async (
    name: string,
    email: string,
    password: string
  ) => {
    const newUser = await authService.signup(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const logoutUser = async () => {
    await authService.logout();
    setUser(null);
  };
  const googleLogin = async () => {
  await authService.signInWithGoogle();
};

  return (
    <AuthContext.Provider
      value={{ user, loading, loginUser, signupUser, logoutUser, googleLogin }}
    >
      {children}
    </AuthContext.Provider>
  );
};
