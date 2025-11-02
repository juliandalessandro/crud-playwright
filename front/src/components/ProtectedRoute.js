import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { refreshToken } from "../services/authApi";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        // 1️⃣ Intentar validar la sesión
        let res = await fetch("http://localhost:3001/auth/me", {
          method: "GET",
          credentials: "include"
        });

        // 2️⃣ Si token expiró → intentar refresh
        if (res.status === 401) {
          try {
            await refreshToken();

            // 3️⃣ Reintentar /me después del refresh
            res = await fetch("http://localhost:3001/auth/me", {
              method: "GET",
              credentials: "include"
            });

            if (!res.ok) throw new Error("Still unauthorized after refresh");
          } catch (error) {
            throw new Error("Refresh failed");
          }
        }

        setAuthorized(true);
      } catch (err) {
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) return <p>Loading...</p>;

  return authorized ? children : <Navigate to="/login" />;
}
