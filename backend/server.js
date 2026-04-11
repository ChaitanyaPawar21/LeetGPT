import app from "./src/app.js";
import connectDB from "./src/config/database.js";
import config from "./src/config/config.js";

const port = config.port;

// Connect to Database
connectDB();

// Start Server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});