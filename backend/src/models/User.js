import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: function() {
            return !this.googleId; // Password is required only if not using Google login
        },
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true, // Allows multiple null values
    },
    avatar: {
        type: String,
    },
    systemPrompt: {
        type: String,
        default: "Explain simply. Be Socratic. Focus on time and space complexity.",
    },
}, { timestamps: true });


// Hash password before saving
userSchema.pre("save", async function() {
    if (!this.isModified("password") || !this.password) return;
    
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
