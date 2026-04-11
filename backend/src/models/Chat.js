import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        default: "New Chat",
    },
    pinned: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    shareableId: {
        type: String,
        unique: true,
        sparse: true,
    },
    messages: [

        {
            role: {
                type: String,
                enum: ["user", "assistant", "system"],
                required: true,
            },
            content: {
                type: String,
                required: true,
            },
            timestamp: {
                type: Date,
                default: Date.now,
            }
        }
    ]
}, { timestamps: true });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
