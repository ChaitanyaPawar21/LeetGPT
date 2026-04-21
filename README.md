# 🧠 LeetGPT — AI-Powered DSA Tutor

> **LeetGPT** is a full-stack AI-powered Data Structures & Algorithms tutoring platform. It acts like a senior developer mentoring a junior — guiding users through LeetCode problems step-by-step, resisting the urge to just hand over solutions, and keeping conversations focused on coding topics.

---

## 🚀 Live Demo

| Service  | URL |
|----------|-----|
| Frontend | [https://leetgpt.vercel.app](https://leetgpt.vercel.app) |
| Backend  | Deployed on Render |

---

## 📸 Features

- 🤖 **AI DSA Tutor** — Powered by Groq (`llama-3.3-70b-versatile`) with a custom system prompt that teaches, not just solves
- 🔐 **Authentication** — Email/password + Google OAuth 2.0
- 💬 **Persistent Chat History** — All conversations saved to MongoDB, tied to your account
- 🔗 **Shareable Chats** — Generate a public link to share any conversation
- 🧭 **Guided Problem Solving** — Detects famous LeetCode problems and offers a structured menu (understand → approach → solve)
- 🚫 **Topic Filter** — Blocks off-topic questions (only DSA/coding allowed)
- ⚙️ **Customizable System Prompt** — Users can tune the AI's tutoring style from settings
- 📱 **Fully Responsive** — Works on mobile, tablet, and desktop
- 🌙 **Dark Mode UI** — Sleek dark theme out of the box

---

## 🏗️ Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 19 | UI Framework |
| Vite | Build tool & dev server |
| TailwindCSS 4 | Utility-first styling |
| Framer Motion | Animations |
| React Router v7 | Client-side routing |
| Axios | HTTP client |
| react-markdown | Render markdown in chat |
| react-syntax-highlighter | Code block syntax highlighting |
| lucide-react | Icon library |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js + Express 5 | REST API server |
| MongoDB + Mongoose | Database & ODM |
| Groq SDK / OpenAI SDK | AI model interface |
| Passport.js | Google OAuth 2.0 strategy |
| JSON Web Tokens (JWT) | Stateless authentication |
| bcrypt | Password hashing |
| Helmet | HTTP security headers |
| express-rate-limit | API abuse protection |
| Morgan | HTTP request logging |
| dotenv | Environment variable management |

---

## 📁 Project Structure

```
leetgpt/
├── backend/
│   ├── server.js                  # Entry point — starts server & DB connection
│   ├── package.json
│   └── src/
│       ├── app.js                 # Express app setup (middleware, routes, error handler)
│       ├── config/
│       │   ├── config.js          # Centralised env config with required-var validation
│       │   ├── database.js        # MongoDB connection logic
│       │   └── passport.js        # Google OAuth passport strategy
│       ├── controllers/
│       │   ├── authController.js  # register, login, logout, getMe, googleSuccess, updateProfile
│       │   └── chatController.js  # chat, getUserChats, deleteChat, deleteAllChats, toggleChatPublic, getSharedChat
│       ├── middleware/
│       │   └── authMiddleware.js  # JWT protect middleware
│       ├── models/
│       │   ├── User.js            # User schema (email, password, googleId, avatar, systemPrompt)
│       │   └── Chat.js            # Chat schema (messages[], isPublic, shareableId)
│       ├── routes/
│       │   ├── authRoutes.js      # /api/auth/*
│       │   └── chatRoutes.js      # /api/chat/*
│       └── services/
│           └── aiService.js       # Core AI logic — prompts, topic filter, problem detection, Groq API call
│
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── vercel.json                # SPA rewrite rules for Vercel deployment
    ├── package.json
    └── src/
        ├── App.jsx                # Root component with routing
        ├── main.jsx               # React entry point
        ├── index.css              # Global styles
        ├── context/
        │   ├── AuthContext.jsx    # Auth state: user, login, register, logout, updateProfile
        │   └── ChatContext.jsx    # Chat state: messages, sendMessage, chats, sharing, delete
        ├── components/
        │   ├── auth/
        │   │   └── ProtectedRoute.jsx   # Redirects unauthenticated users to /login
        │   ├── chat/
        │   │   ├── ChatWindow.jsx       # Renders message history
        │   │   ├── InputBox.jsx         # Message input with submit
        │   │   ├── MessageBubble.jsx    # Individual message with markdown + code rendering
        │   │   └── ProblemPanel.jsx     # Optional problem context panel
        │   ├── layout/
        │   │   ├── Sidebar.jsx          # Chat history list with create/delete/pin/share
        │   │   └── TopBar.jsx           # Top navigation bar with settings & share buttons
        │   └── modals/
        │       ├── SettingsModal.jsx    # Update display name & custom system prompt
        │       └── ShareModal.jsx       # Toggle sharing & copy shareable link
        ├── pages/
        │   ├── LoginPage.jsx            # Email/password + Google OAuth login
        │   ├── RegisterPage.jsx         # Registration form
        │   ├── AuthCallback.jsx         # Handles Google OAuth token redirect
        │   └── SharedChatPage.jsx       # Public read-only view of a shared chat
        └── utils/
            ├── api.js                   # Axios instance with baseURL & auth header injection
            ├── auth.js                  # Auth utility helpers
            └── cn.js                   # clsx + tailwind-merge utility
```

---

## 🔌 API Reference

### Auth Routes — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/register` | ❌ | Create a new account |
| `POST` | `/login` | ❌ | Login with email & password |
| `GET` | `/logout` | ❌ | Clear auth cookie |
| `GET` | `/me` | ✅ | Get current authenticated user |
| `PATCH` | `/profile` | ✅ | Update name or custom system prompt |
| `GET` | `/google` | ❌ | Initiate Google OAuth flow |
| `GET` | `/google/callback` | ❌ | Google OAuth redirect callback |

### Chat Routes — `/api/chat`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ✅ | Send a message (creates or continues a chat) |
| `GET` | `/` | ✅ | Get all chats for the current user |
| `DELETE` | `/:id` | ✅ | Delete a specific chat |
| `DELETE` | `/all` | ✅ | Delete all chat history |
| `PATCH` | `/:id/share` | ✅ | Toggle public sharing on/off |
| `GET` | `/shared/:shareableId` | ❌ | View a publicly shared chat |

---

## 🧠 AI Service — How It Works

The core tutoring logic lives in `backend/src/services/aiService.js` and works as a multi-layer pipeline:

```
User Message
     │
     ▼
1. Greeting Detection ──────────────────────► Friendly welcome response
     │
     ▼
2. Famous Problem Detection
   (Static regex patterns → AI fallback if no match)
     │
     ├── Problem found + NOT a solution request ──► Guided menu (5 options)
     │
     ▼
3. Topic Filter (isCodingRelated?)
     │
     ├── Non-coding + not a follow-up ──────────► Off-topic redirect message
     │
     ▼
4. Problem Statement Detection
   (Input/Output/Constraints/Examples pattern)
     │
     ├── Looks like a problem + no solution request ──► Guided menu
     │
     ▼
5. Pass to Groq LLM (llama-3.3-70b-versatile)
     │
     ▼
6. Solution Blocker
   (If AI sneaks in a solution without being asked ──► Block it)
     │
     ▼
   Final Response sent to client
```

**Key behaviors:**
- Detects 40+ famous DSA problems via regex (Two Sum, Trapping Rain Water, LRU Cache, etc.)
- Falls back to a cheap AI call (`max_tokens: 20`) for unrecognized problem names
- Blocks full code solutions unless explicitly requested (`"give me the solution"`, `"complete code"`, `"option 5"`, etc.)
- Restricts responses to coding/DSA topics only

---

## 🗃️ Database Schema

### User
```js
{
  name:         String,          // Required
  email:        String,          // Required, unique, lowercase
  password:     String,          // Required only for non-Google accounts (bcrypt hashed)
  googleId:     String,          // Unique, sparse (null for email users)
  avatar:       String,          // Profile picture URL (from Google)
  systemPrompt: String,          // Custom AI instruction (default: "Explain simply...")
  createdAt:    Date,
  updatedAt:    Date
}
```

### Chat
```js
{
  userId:      ObjectId,         // Ref to User
  title:       String,           // First 5 words of the first message
  pinned:      Boolean,          // Client-side favouriting
  isPublic:    Boolean,          // Whether chat is publicly shareable
  shareableId: String,           // 12-char hex token for public link (sparse unique)
  messages: [{
    role:      "user" | "assistant" | "system",
    content:   String,
    timestamp: Date
  }],
  createdAt:   Date,
  updatedAt:   Date
}
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

```env
# MongoDB
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# JWT
JWT_SECRET=your_super_secret_jwt_key

# Session (for Google OAuth)
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback

# URLs
FRONTEND_URL=https://leetgpt.vercel.app

# AI
GROK_API_KEY=gsk_xxxxxxxxxxxxxxxxxxxxxxxx   # Groq key (starts with gsk_)
                                             # or an xAI key for grok-beta

# Environment
NODE_ENV=production
PORT=3000
```

> **Note:** The app auto-detects the AI provider based on the key prefix:
> - `gsk_...` → Groq API (`llama-3.3-70b-versatile`)
> - Anything else → xAI (`grok-beta`)

---

## 🚦 Getting Started (Local Development)

### Prerequisites

- Node.js >= 18
- MongoDB Atlas account (or local MongoDB)
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Google OAuth credentials (from [Google Cloud Console](https://console.cloud.google.com))

### 1. Clone the repository

```bash
git clone https://github.com/ChaitanyaPawar21/LeetGPT.git
cd LeetGPT
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` using the template above, then:

```bash
npm run dev      # Development (nodemon auto-reload)
# or
npm start        # Production
```

Backend will start at `http://localhost:3000`

### 3. Setup the Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will start at `http://localhost:5173`

> Make sure your backend `FRONTEND_URL` env var allows `http://localhost:5173` as an origin (it is whitelisted by default in `app.js`).

---

## 🌐 Deployment

### Frontend — Vercel

1. Push the `frontend/` directory (or the entire monorepo) to GitHub
2. Connect to Vercel, set the **root directory** to `frontend`
3. Vercel auto-detects Vite — no extra build config needed
4. The `vercel.json` handles SPA routing (all paths → `index.html`)

### Backend — Render

1. Create a new **Web Service** on [Render](https://render.com)
2. Set **Root Directory** to `backend`
3. **Build Command:** `npm install`
4. **Start Command:** `npm start`
5. Add all environment variables from the template above
6. Set `NODE_ENV=production`

> **CORS & Cookies:** The backend uses `trust proxy: 1` and sets `sameSite: 'none'` + `secure: true` in production for cross-domain cookie support between Render (backend) and Vercel (frontend).

---

## 🔒 Security Notes

| Feature | Implementation |
|---------|---------------|
| Password hashing | bcrypt with 10 salt rounds |
| Auth tokens | HTTP-only cookies + JWT (7-day expiry) |
| Google OAuth | Passport.js, token returned via URL redirect |
| Rate limiting | 100 requests per 15 min per IP on `/api/` |
| HTTP headers | Helmet.js (CSP, HSTS, X-Frame-Options, etc.) |
| CORS | Strict allowlist of origins |
| Proxy trust | `trust proxy: 1` for Render's reverse proxy |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📜 License

This project is licensed under the **ISC License**.

---

## 👨‍💻 Author

**Chaitanya Pawar**  
GitHub: [@ChaitanyaPawar21](https://github.com/ChaitanyaPawar21)

---

*Built with ❤️ to make DSA practice less painful and more guided.*
