import {
  createContext,
  useState,
  type ReactNode,
} from "react";

import type { User } from "../types";
import * as authService from "../services/authService";

interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => User;
  signupUser: (name: string, email: string, password: string) => User;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(
    authService.getCurrentUser()
  );

  const loginUser = (email: string, password: string) => {
    const loggedUser = authService.login(email, password);
    setUser(loggedUser);
    return loggedUser;
  };

  const signupUser = (name: string, email: string, password: string) => {
    const newUser = authService.signup(name, email, password);
    setUser(newUser);
    return newUser;
  };

  const logoutUser = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loginUser, signupUser, logoutUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};