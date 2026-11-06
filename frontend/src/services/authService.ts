import type { User } from "../types";

const USERS_KEY = "researchmind_users";
const SESSION_KEY = "researchmind_session";

const getUsers = (): User[] => {
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]");
};

export const signup = (
  name: string,
  email: string,
  password: string
): User => {
  const users = getUsers();

  if (users.some((u) => u.email === email)) {
    throw new Error("Email already registered");
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    name,
    email,
    role: "user",
  };

  users.push({ ...newUser, password } as User);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));

  return newUser;
};

export const login = (email: string, password: string): User => {
  const users = getUsers() as (User & { password: string })[];

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    throw new Error("Invalid email or password");
  }

    const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    };

  localStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));

  return safeUser;
};

export const logout = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const getCurrentUser = (): User | null => {
  return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
};