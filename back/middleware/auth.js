const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const token = req.cookies.accessToken; // ✅ nombre correcto

  if (!token) return res.status(401).json({ error: "Not authorized" });

  try {
    const data = jwt.verify(token, "ACCESS_SECRET"); // ✅ mismo secreto que usaste al firmar
    req.user = data;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};
