import express from "express";
import passport from "passport";
import { register, login, logout, getMe, googleSuccess, updateProfile } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";
import config from "../config/config.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);
router.get("/me", protect, getMe);
router.patch("/profile", protect, updateProfile);


// Google OAuth routes
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/google/callback", 
    passport.authenticate("google", { failureRedirect: `${config.frontendURL}/login`, session: false }),
    googleSuccess
);

// Redirect based success/failure for Google
router.get("/google/success", googleSuccess);

export default router;
