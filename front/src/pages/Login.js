import { useState } from "react";
import { loginUser } from "../services/authApi";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const [toast, setToast] = useState({ message: "", type: "" });


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await loginUser(email, password);

      // localStorage.setItem("token", token); ❌
      localStorage.setItem("user", JSON.stringify(user));

      setToast({ message: "Login successful ✅", type: "success" });

      setTimeout(() => {
        navigate("/");
      }, 1500);

    } catch (err) {
      setToast({ message: "Invalid email or password ❌", type: "error" });

      setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 2500);
    }
  };

  return (
    <div className="form-container">
      <h2>Login</h2>

      {error && <p className="error-message">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input className="form-input" value={email} onChange={(e) => setEmail(e.target.value)}
          type="email" required placeholder="Email" />

        <input className="form-input" value={password} onChange={(e) => setPassword(e.target.value)}
          type="password" required placeholder="Password" />

        <button className="btn-submit">Login</button>
      </form>

      <p>
        Don't have an account? <Link to="/register" className="link-underline">Register here</Link>
      </p>

      <Toast message={toast.message} type={toast.type} />

    </div>
  );
}
