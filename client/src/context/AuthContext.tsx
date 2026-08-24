import { useEffect, useState, type ReactNode } from "react";
import {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateCurrentUser,
} from "../services/auth.service";
import { AuthContext } from "./auth-context";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<import("../types/auth").User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        logoutUser();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (data: import("../types/auth").LoginInput) => {
    const result = await loginUser(data);
    setUser(result.user);
  };

  const register = async (data: import("../types/auth").RegisterInput) => {
    const registeredUser = await registerUser(data);
    setUser(registeredUser);
  };

  const updateProfile = async (data: { name?: string; email?: string }) => {
    const updatedUser = await updateCurrentUser(data);
    setUser(updatedUser);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        updateProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
