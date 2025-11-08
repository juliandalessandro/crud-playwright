import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema Zod con validaciones serias estilo SaaS
const loginSchema = z.object({
  identifier: z
    .string()
    .min(3, "Debe tener al menos 3 caracteres.")
    .refine(
      (val) => {
        // email válido o username válido
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const usernameRegex = /^[a-zA-Z0-9_.-]{3,}$/;
        return emailRegex.test(val) || usernameRegex.test(val);
      },
      {
        message: "Debe ser un email válido o un usuario alfanumérico.",
      }
    ),
  password: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres.")
    .max(100, "La contraseña es demasiado larga."),
});

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  // ✅ Mantengo tu lógica de login intacta
  const onSubmit = async (data) => {
    try {
      // Ahora mandamos "identifier" (email O username)
      await login(data.identifier, data.password);

      showToast("Login successful ✅", "success");

      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      showToast("Invalid credentials ❌", "error");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ✅ Email OR Username */}
        <input
          className="form-input"
          placeholder="Email or Username"
          {...register("identifier")}
        />
        {errors.identifier && (
          <span style={{ color: "red" }}>{errors.identifier.message}</span>
        )}

        {/* ✅ Password */}
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          {...register("password")}
        />
        {errors.password && (
          <span style={{ color: "red" }}>{errors.password.message}</span>
        )}

        <button className="btn-submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p>
        Don't have an account?{" "}
        <Link to="/register" className="link-underline">
          Register here
        </Link>
      </p>
    </div>
  );
}
