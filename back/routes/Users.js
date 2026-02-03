const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { users } = require("../models");
const router = express.Router();
const auth = require("../middleware/auth");
const csrf = require("../middleware/csrf");
const { Op } = require("sequelize");

const JWT_SECRET = "ACCESS_SECRET";
const JWT_REFRESH_SECRET = "REFRESH_SECRET";

// REGISTER (sin Zod)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validación mínima manual opcional
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Chequear si ya existe mail o username
    const existing = await users.findOne({
      where: {
        [Op.or]: [{ email }, { username }]
      }
    });

    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await users.create({
      username,
      email,
      password: hashed
    });

    return res.json({ message: "User created", user: newUser });

  } catch (err) {
    return res.status(400).json({ error: "Registration failed" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { identifier, password } = req.body;

  const user = await users.findOne({
    where: {
      [Op.or]: [{ email: identifier }, { username: identifier }]
    }
  });

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
      email: user.email,
      username: user.username
    }
  });
});

router.post("/refresh", (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ error: "No refresh token" });

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET);

    const newAccess = jwt.sign(
      { id: decoded.id },
      JWT_SECRET,
      { expiresIn: "15m" }
    );

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

router.get("/me", auth, (req, res) => {
  res.json({ user: req.user });
});

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
