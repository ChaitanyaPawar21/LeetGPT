import dotenv from "dotenv";
dotenv.config();

const config = {
    mongoURI: process.env.MONGO_URI,
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || "fallback_secret",
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    frontendURL: process.env.FRONTEND_URL || "http://localhost:5173",
    sessionSecret: process.env.SESSION_SECRET || "session_secret",
};

export default config;