import React, { createContext, useState, useEffect, useContext } from "react";
import { apiGet } from "../utils/api";

const AuthContext = createContext(null);

// The Provider wraps the whole app and manages who is logged in
export function AuthProvider({ children }) {
  // user = { role: 'P' | 'D' } logged in, null logged out
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await apiGet("/signin");
        setUser({ role: data.role }); // cookies were valid, restore user
      } catch {
        setUser(null); // cookies missing or expired, treat as logged out
      } finally {
        setAuthLoading(false); // verification done either way
      }
    };

    restoreSession();
  }, []);

  const login = (role) => {
    setUser({ role });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, authLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook — lets any component access auth state with one line
export function useAuth() {
  return useContext(AuthContext);
}
