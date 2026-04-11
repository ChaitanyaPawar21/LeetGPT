import { getAIResponse } from "../services/aiService.js";
import Chat from "../models/Chat.js";

// 🧠 Helper: Clean messages before sending to AI
const cleanMessagesForAI = (messages) => {
  return messages.map((msg) => ({
    role: msg.role === "assistant" ? "assistant" : "user",
    content: String(msg.content || ""),
  }));
};

// ─────────────────────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────────────────────
export const chat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { message, systemPrompt, chatId } = req.body;
    const userId = req.user._id;

    // ✅ Validate input
    if (!message || message.role !== "user") {
      return res.status(400).json({
        success: false,
        message: "Valid user message required",
      });
    }

    let chatDoc = null;

    // ✅ Fetch existing chat
    if (chatId) {
      chatDoc = await Chat.findOne({ _id: chatId, userId });

      if (!chatDoc) {
        return res.status(404).json({
          success: false,
          message: "Chat not found",
        });
      }
    }

    // 🧠 STEP 1: Build raw messages (DB + new message)
    const rawMessages = chatDoc
      ? [...chatDoc.messages, message]
      : [message];

    // 🧠 STEP 2: CLEAN messages (🔥 CRITICAL FIX)
    const contextMessages = cleanMessagesForAI(rawMessages);

    // 🧠 STEP 3: Call AI
    const aiResponse = await getAIResponse(contextMessages, systemPrompt);

    // 🧠 STEP 4: Save to DB (KEEP ORIGINAL STRUCTURE)
    if (chatDoc) {
      chatDoc.messages.push(message);
      chatDoc.messages.push({
        role: "assistant",
        content: aiResponse,
        timestamp: new Date(),
      });
    } else {
      chatDoc = new Chat({
        userId,
        title: message.content.split(" ").slice(0, 5).join(" "),
        messages: [
          message,
          {
            role: "assistant",
            content: aiResponse,
            timestamp: new Date(),
          },
        ],
      });
    }

    await chatDoc.save();

    // ✅ Response
    res.status(200).json({
      success: true,
      chat: chatDoc,
    });

  } catch (error) {
    console.error("Chat controller error:", error); // full error log

    res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/chat
// ─────────────────────────────────────────────────────────
export const getUserChats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const chats = await Chat.find({ userId: req.user._id })
      .sort({ updatedAt: -1 });

    res.status(200).json(chats);

  } catch (error) {
    console.error("Get chats error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/chat/:id
// ─────────────────────────────────────────────────────────
export const deleteChat = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const chat = await Chat.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: "Chat not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chat deleted",
    });

  } catch (error) {
    console.error("Delete chat error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ─────────────────────────────────────────────────────────
// DELETE /api/chat (All)
// ─────────────────────────────────────────────────────────
export const deleteAllChats = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await Chat.deleteMany({ userId: req.user._id });

    res.status(200).json({
      success: true,
      message: "All chats deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
// PATCH /api/chat/:id/share
// ─────────────────────────────────────────────────────────
export const toggleChatPublic = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const chat = await Chat.findOne({ _id: id, userId });

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    chat.isPublic = !chat.isPublic;

    if (chat.isPublic && !chat.shareableId) {
      const crypto = await import("crypto");
      chat.shareableId = crypto.randomBytes(6).toString("hex");
    }

    await chat.save();

    res.status(200).json({
      success: true,
      isPublic: chat.isPublic,
      shareableId: chat.shareableId,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─────────────────────────────────────────────────────────
// GET /api/chat/shared/:shareableId (Public)
// ─────────────────────────────────────────────────────────
export const getSharedChat = async (req, res) => {
  try {
    const { shareableId } = req.params;

    const chat = await Chat.findOne({ shareableId, isPublic: true })
      .select("-userId"); // Don't leak userId

    if (!chat) {
      return res.status(404).json({ success: false, message: "Shared chat not found" });
    }

    res.status(200).json({
      success: true,
      chat,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};