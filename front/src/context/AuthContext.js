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

  // ✅ Restaurar sesión al cargar la app
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get("/auth/me");
        if (res.data?.user) {
          setUser(res.data.user);
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }
      } catch {
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

  // ✅ Login actualizado: recibe "identifier" (email o username)
  const login = async (identifier, password) => {
    const data = await loginUser(identifier, password); // 🔹 aquí ya mandamos identifier
    const loggedUser = data.user;

    setUser(loggedUser);
    localStorage.setItem("user", JSON.stringify(loggedUser));

    return loggedUser;
  };

  // ✅ Register actualizado: recibe username, email y password
  const register = async (username, email, password) => {
    const data = await registerUser(email, password, username); // 🔹 username agregado
    return data;
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
