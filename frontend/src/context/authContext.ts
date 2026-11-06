import { createContext } from "react";

import type { User } from "../types";

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
