import dotenv from "dotenv";
dotenv.config();

const requireEnv = (key) => {
    if (!process.env[key]) {
        console.error(`[CRITICAL] Missing required environment variable: ${key}`);
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return process.env[key];
};

const config = {
    mongoURI: requireEnv("MONGO_URI"),
    port: process.env.PORT || 3000,
    jwtSecret: requireEnv("JWT_SECRET"),
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    frontendURL: process.env.FRONTEND_URL || "http://localhost:5173",
    sessionSecret: requireEnv("SESSION_SECRET"),
};

export default config;