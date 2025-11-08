import { useNavigate, Link } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import { registerUser } from "../services/authApi";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "../App.css";

// ✅ Validación Zod
const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must have at least 3 characters")
    .regex(/^[a-zA-Z0-9_.-]+$/, "Only letters, numbers, _, -, . allowed"),
  email: z.string().email("Invalid email"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
});

export default function Register() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    try {
      await registerUser(data.email, data.password, data.username);

      showToast("Account created 🎉", "success");

      setTimeout(() => {
        navigate("/login", { replace: true });
      }, 1000);
    } catch (err) {
      showToast(err.message || "User already exists ❌", "error");
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        <input
          className="form-input"
          placeholder="Username"
          {...register("username")}
        />
        {errors.username && (
          <span style={{ color: "red" }}>{errors.username.message}</span>
        )}

        <input
          className="form-input"
          type="email"
          placeholder="Email"
          {...register("email")}
        />
        {errors.email && (
          <span style={{ color: "red" }}>{errors.email.message}</span>
        )}

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
          {isSubmitting ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account?{" "}
        <Link to="/login" className="link-underline">
          Log in here
        </Link>
      </p>
    </div>
  );
}
