import express from "express";
import { chat, getUserChats, deleteChat, deleteAllChats, toggleChatPublic, getSharedChat } from "../controllers/chatController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All chat routes except shared require authentication
router.post("/", protect, chat);
router.get("/", protect, getUserChats);
router.delete("/all", protect, deleteAllChats);
router.delete("/:id", protect, deleteChat);
router.patch("/:id/share", protect, toggleChatPublic);
router.get("/shared/:shareableId", getSharedChat);


export default router;
