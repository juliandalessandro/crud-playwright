import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { login } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password);

      showToast("Login successful ✅", "success");

      // redirección limpia (reemplaza el historial para evitar volver atrás al login)
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 1000);
    } catch (err) {
      showToast("Invalid email or password ❌", "error");
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          placeholder="Email"
        />

        <input
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          placeholder="Password"
        />

        <button className="btn-submit">Login</button>
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
