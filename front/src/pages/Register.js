import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../services/authApi";
import "../App.css";
import Toast from "../components/Toast";

function Register() {

  const navigate = useNavigate();

  const [toast, setToast] = useState({ message: "", type: "" });

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await registerUser(form.email, form.password);

      setToast({ message: "Account created 🎉", type: "success" });

      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setToast({ message: "User already exists ❌", type: "error" });

      setTimeout(() => {
        setToast({ message: "", type: "" });
      }, 2500);
    }
  };

  return (
    <div className="form-container">
      <h2>Register</h2>

      {errorMsg && <p className="error-message">{errorMsg}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          className="form-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button className="btn-submit" type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login" className="link-underline">Log in here</Link>
      </p>

      <Toast message={toast.message} type={toast.type} />
    </div>
  );
}

export default Register;
