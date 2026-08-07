import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      if (response.data.success) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    if (response.data.success) {
      setUser(response.data.data.user);
    }
    return response.data;
  };

  const logout = async () => {
    await api.post("/auth/logout");
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    refreshUser: fetchUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
