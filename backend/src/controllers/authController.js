import User from "../models/User.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: "7d",
  });
};
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user._id);

    const cookieOptions = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    };

    res
      .status(statusCode)
      .cookie("token", token, cookieOptions)
      .json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
        },
      });
};

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }
    user = await User.create({ name, email, password });
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Please provide email and password" });
    }
    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
  });
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ KEY CHANGE: redirect with token in URL
export const googleSuccess = (req, res) => {
  if (req.user) {
    const token = generateToken(req.user._id);
    res.redirect(`${config.frontendURL}/auth/callback?token=${token}`);
  } else {
    res.redirect(`${config.frontendURL}/login?error=Google_Auth_Failed`);
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { systemPrompt, name } = req.body;
    const user = await User.findById(req.user.id);
    if (name) user.name = name;
    if (systemPrompt !== undefined) user.systemPrompt = systemPrompt;
    await user.save();
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        systemPrompt: user.systemPrompt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};