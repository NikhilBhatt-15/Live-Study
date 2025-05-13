import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import {
  login as loginApi,
  logout as logoutApi,
  getCurrentUser,
  refreshAccessToken,
} from "../api/auth.js";

const AuthContext = createContext();

const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    try {
      const res = await getCurrentUser();
      if (res.status === 200) {
        setUser(res.data.data);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  const tryRefreshToken = useCallback(async () => {
    try {
      const res = await refreshAccessToken();
      if (res.status === 200) {
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    async function checkAuth() {
      setLoading(true);
      let valid = await fetchUser();
      if (!valid) {
        const refreshed = await tryRefreshToken();
        if (refreshed) {
          valid = await fetchUser();
        }
      }
      if (!valid) setUser(null);
      setLoading(false);
    }
    checkAuth();
  }, [fetchUser, tryRefreshToken]);

  const login = async (email, password) => {
    try {
      const res = await loginApi(email, password);
      if (res.status === 200) {
        const user = await fetchUser();
        setUser(user);
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
