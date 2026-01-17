import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// Zod schema with validations
const loginSchema = z.object({
  identifier: z
    .string()
    .min(1, "Email or username is required")
    .refine(
      (val) => {
        // Valid email or username
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        // Username: 3-30 characters, only letters, numbers, -, . and _
        const usernameRegex = /^[a-zA-Z0-9._-]{3,30}$/;
        
        return emailRegex.test(val) || usernameRegex.test(val);
      },
      {
        message: "Enter a valid email or username",
      }
    ),
  
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password is too long"),
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

  const onSubmit = async (data) => {
    try {
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
        {/* Email OR Username */}
        <input
          className="form-input"
          placeholder="Email or Username"
          data-testid="login-email-username"
          autoComplete="username"
          {...register("identifier")}
        />
        {errors.identifier && (
          <span style={{ color: "red" }} data-testid="email-username-error">
            {errors.identifier.message}
          </span>
        )}

        {/* Password */}
        <input
          className="form-input"
          type="password"
          placeholder="Password"
          data-testid="login-password"
          autoComplete="current-password"
          {...register("password")}
        />
        {errors.password && (
          <span style={{ color: "red" }} data-testid="password-error">
            {errors.password.message}
          </span>
        )}

        <button 
          className="btn-submit" 
          disabled={isSubmitting}
          data-testid="login-button"
        >
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