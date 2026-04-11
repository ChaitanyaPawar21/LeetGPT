import jwt from "jsonwebtoken";
import User from "../models/User.js";
import config from "../config/config.js";

export const protect = async (req, res, next) => {
    let token;

    if (req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    }

    if (!token || token === "none") {
        return res.status(401).json({ success: false, message: "Not authorized to access this route" });
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await User.findById(decoded.id);
        
        // ADD THIS CHECK
        if (!user) {
            return res.status(401).json({ 
                success: false, 
                message: "User no longer exists" 
            });
        }
        
        req.user = user;
        next();
    } catch (error) {
        console.error("Auth middleware error:", error); // Add logging
        return res.status(401).json({ 
            success: false, 
            message: "Not authorized to access this route" 
        });
    }
};