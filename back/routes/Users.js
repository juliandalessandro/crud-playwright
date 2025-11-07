const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { users } = require("../models");
const router = express.Router();
const auth = require("../middleware/auth");
const csrf = require("../middleware/csrf");

const JWT_SECRET = "ACCESS_SECRET";
const JWT_REFRESH_SECRET = "REFRESH_SECRET";

// ✅ REGISTER
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  const hashed = await bcrypt.hash(password, 10);

  try {
    const user = await users.create({ email, password: hashed });
    res.json({ message: "User created", user });
  } catch {
    res.status(400).json({ error: "User already exists" });
  }
});

// ✅ LOGIN (CORREGIDO para devolver user)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await users.findOne({ where: { email } });
  if (!user) return res.status(401).json({ error: "Invalid login" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid login" });

  const accessToken = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: "7d" });

  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/",
    maxAge: 1000 * 60 * 15
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  // ✅ CSRF Token
  const csrfToken = crypto.randomBytes(40).toString("hex");
  res.cookie("XSRF-TOKEN", csrfToken, {
    secure: false,
    sameSite: "Lax",
    domain: "localhost",
    path: "/",
    maxAge: 1000 * 60 * 60 * 24 * 7
  });

  return res.json({
    message: "Login successful",
    user: {
      id: user.id,
      email: user.email
    }
  });
});

// ✅ REFRESH TOKEN
router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    const newAccess = jwt.sign({ id: decoded.id }, JWT_SECRET, { expiresIn: "15m" });

    res.cookie("accessToken", newAccess, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 15,
      path: "/"
    });

    return res.json({ message: "Token refreshed" });
  } catch {
    return res.status(401).json({ error: "Invalid refresh token" });
  }
});

// ✅ CHECK SESSION
router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

// ✅ LOGOUT
router.post("/logout", auth, csrf, (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/"
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/"
  });

  res.clearCookie("XSRF-TOKEN", {
    secure: false,
    sameSite: "lax",
    domain: "localhost",
    path: "/"
  });

  return res.json({ message: "Logged out" });
});

module.exports = router;
