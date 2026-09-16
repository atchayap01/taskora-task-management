import { createContext, useContext, useState, useEffect } from "react";
import { loginUser, registerUser, fetchCurrentUser } from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true while we check for an existing session

  // On first load, check if a token already exists and, if so, verify it
  // against the backend so we don't trust stale localStorage data.
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("taskbuddy_token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await fetchCurrentUser();
        setUser(data.user);
      } catch (error) {
        // Token invalid/expired - clear it
        localStorage.removeItem("taskbuddy_token");
        localStorage.removeItem("taskbuddy_user");
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const data = await loginUser(email, password);
    localStorage.setItem("taskbuddy_token", data.token);
    localStorage.setItem("taskbuddy_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (name, email, password, confirmPassword) => {
    const data = await registerUser(name, email, password, confirmPassword);
    localStorage.setItem("taskbuddy_token", data.token);
    localStorage.setItem("taskbuddy_user", JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("taskbuddy_token");
    localStorage.removeItem("taskbuddy_user");
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
