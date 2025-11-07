import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, logoutUser } from "../services/authApi";
import api from "../services/api";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(true);

  // ✅ Intentar restaurar sesión al cargar la app
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {
        // Si falla /me, intentamos refresh
        try {
          await api.post("/auth/refresh");

          const me = await api.get("/auth/me");
          setUser(me.data.user);
          localStorage.setItem("user", JSON.stringify(me.data.user));
        } catch {
          setUser(null);
          localStorage.removeItem("user");
        }
      }
      setLoading(false);
    };

    restoreSession();
  }, []);

  // ✅ Login
  const login = async (email, password) => {
    const data = await loginUser(email, password);
    const loggedUser = data.user;

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    return loggedUser;
  };

  // ✅ Register
  const register = async (email, password) => {
    return await registerUser(email, password);
  };

  // ✅ Logout
  const logout = async () => {
    await logoutUser();
    setUser(null);
    localStorage.removeItem("user");
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
