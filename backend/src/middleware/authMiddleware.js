import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/config.js";

export const protect = async (req, res, next) => {
  let token;

  // ✅ Check Authorization header first (for localStorage token)
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.token) {
    // fallback for cookie-based (email/password login)
    token = req.cookies.token;
  }

  if (!token || token === "none") {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User no longer exists" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};