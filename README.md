<div align="center">

# 🚀 TaskFlow

### Full-Stack MERN Task Management System

*JWT Authentication · Role-Based Access Control · Real-Time Task Management*

---

## 🌐 Live Application

### **[👉 https://task-flow-two-beta.vercel.app/](https://task-flow-git-main-mayanksingh-ai1s-projects.vercel.app/)**

---

[![Live Demo](https://img.shields.io/badge/🔗_Live_Demo-Visit_App-7c6af7?style=for-the-badge)](https://task-flow-git-main-mayanksingh-ai1s-projects.vercel.app/)
[![Node](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb)](https://mongodb.com)

</div>

---

## 📖 What Is TaskFlow?

TaskFlow is a production-ready full-stack web application where teams can manage tasks with strict role-based access. Each user sees only what they're allowed to — users manage their own tasks, admins manage all users and tasks, and a hidden superadmin has full system authority.

---

## 👑 Role Hierarchy

```
SuperAdmin  ──►  Admin  ──►  User
  (Highest)                 (Lowest)
```

| Role | Symbol | What They Can Do |
|------|:------:|-----------------|
| **SuperAdmin** | 👑 | Full system access. Manages all Admins, Users, Tasks. Only role that can promote/demote Admins. |
| **Admin** | 🛡️ | Manages all Users and Tasks. Cannot touch other Admins. |
| **User** | 👤 | Creates, views, edits, and deletes only their own tasks. |

---

## 🛡️ Permissions Table

| Action | SuperAdmin | Admin | User |
|--------|:----------:|:-----:|:----:|
| Manage own tasks | ✅ | ✅ | ✅ |
| View all tasks | ✅ | ✅ | ❌ |
| Edit / delete any task | ✅ | ✅ | ❌ |
| Manage Users (view, edit, delete) | ✅ | ✅ | ❌ |
| Manage Admins | ✅ | ❌ | ❌ |
| Change user roles | ✅ | ❌ | ❌ |
| Full system access | ✅ | ❌ | ❌ |

---

## 📁 Project Structure

```
TaskFlow/
├── backend/                     ← Node.js + Express REST API
│   ├── config/
│   │   └── db.js                ← MongoDB Atlas connection
│   ├── controllers/
│   │   ├── authController.js    ← Register, Login, Logout, GetMe
│   │   ├── taskController.js    ← Task CRUD logic
│   │   └── userController.js    ← User management (Admin+)
│   ├── middleware/
│   │   ├── authMiddleware.js    ← JWT verification
│   │   ├── roleMiddleware.js    ← Role hierarchy enforcement
│   │   ├── errorMiddleware.js   ← Global error handler
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js              ← User schema (name, email, password, role)
│   │   └── Task.js              ← Task schema (title, status, priority, etc.)
│   ├── routes/
│   │   ├── authRoutes.js        ← /api/auth/*
│   │   ├── taskRoutes.js        ← /api/tasks/*
│   │   └── userRoutes.js        ← /api/users/* (Admin+ only)
│   ├── scripts/
│   │   └── seedSuperadmin.js    ← One-time script to create superadmin
│   ├── utils/
│   │   ├── AppError.js          ← Custom error class
│   │   └── tokenUtils.js        ← JWT helpers
│   ├── .env                     ← Your secret config (never commit this)
│   └── server.js                ← App entry point
│
├── frontend/                    ← React 18 SPA
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/index.js         ← Axios instance (auto token attach)
│   │   ├── context/
│   │   │   └── AuthContext.js   ← Global auth state
│   │   ├── components/
│   │   │   ├── common/          ← Badges, Modals, Guards, TaskForm
│   │   │   └── layout/          ← Sidebar + mobile navigation
│   │   └── pages/               ← All page components
│   └── .env                     ← Frontend environment config
│
├── package.json                 ← Root scripts (run both servers at once)
└── README.md
```

---

## ⚡ Quick Start — Run Locally

### Prerequisites

Make sure you have these installed:

- [Node.js v18+](https://nodejs.org) — check with `node --version`
- [npm v9+](https://npmjs.com) — check with `npm --version`
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/mayanksingh-ai1/TaskFlow.git
cd TaskFlow
```

---

### Step 2 — Configure Backend Environment

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

> 💡 Get your `MONGO_URI` from MongoDB Atlas → Connect → Connect your application

---

### Step 3 — Configure Frontend Environment

```bash
cd ../frontend
cp .env.example .env
```

Open `.env`:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

### Step 4 — Install All Dependencies

Go back to the root folder and run one command:

```bash
cd ..
npm run install-all
```

This automatically installs packages for **root + backend + frontend**.

---

### Step 5 — Start Both Servers

```bash
npm run dev
```

| Server | URL |
|--------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |

Your browser will open automatically at `http://localhost:3000` 🎉

---

## 👑 Create the SuperAdmin Account

The SuperAdmin cannot be created through the UI or any API — it must be created once via a script directly in the database.

---

### 🧭 How to Run the Seed Script (Step by Step)

**Step 1 — VS Code me Terminal kholo**

Press:
```
Ctrl + `
```

---

**Step 2 — backend folder me jao**

```bash
cd backend
```

Tera structure kuch aisa hoga:
```
TaskFlow/
  backend/
    scripts/
      seedSuperadmin.js   ← yahi file run karni hai
```

---

**Step 3 — Seed script run karo**

```bash
node scripts/seedSuperadmin.js
```

Agar successful hai to terminal me yeh dikhega:
```
✅ Connected to MongoDB
✅ Superadmin created successfully!
   Email:    superadmin@taskflow.com
   Name:     Super Admin
   Role:     superadmin

⚠️  IMPORTANT: Change the password immediately after first login.
```

Agar superadmin pehle se exist karta hai:
```
⚠️  Superadmin already exists: superadmin@taskflow.com
   Seed skipped — only one superadmin is allowed.
```

---

### 🔐 SuperAdmin Login Credentials

```
Email    :  superadmin@taskflow.com
Password :  SuperSecret@2024!
```

> ⚠️ Change the password immediately after your first login.

---

## 🗺️ Pages & Routes

| Route | Who Can Access | Description |
|-------|:--------------:|-------------|
| `/login` | Public | Login with email & password |
| `/register` | Public | Create a new account |
| `/dashboard` | Any logged-in user | Stats, progress bar, recent tasks |
| `/tasks` | Any logged-in user | Create, edit, delete, filter tasks |
| `/admin/users` | Admin + SuperAdmin | Manage all users and roles |
| `/admin/tasks` | Admin + SuperAdmin | View and manage all tasks |
| `/unauthorized` | Any | 403 Access Denied page |

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|:------:|-------------|
| `POST` | `/auth/register` | Public | Register new user |
| `POST` | `/auth/login` | Public | Login → returns JWT token |
| `GET` | `/auth/me` | Private | Get current logged-in user |
| `POST` | `/auth/logout` | Private | Logout |

### Tasks — `/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Admin/SA = all tasks · User = own tasks |
| `POST` | `/tasks` | Create a new task |
| `GET` | `/tasks/:id` | Get single task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |
| `PATCH` | `/tasks/:id/status` | Update task status only |

### Users — `/api/users` *(Admin+ only)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `GET` | `/users/:id` | Get single user |
| `PUT` | `/users/:id` | Update role / status |
| `DELETE` | `/users/:id` | Delete user + their tasks |
| `GET` | `/users/:id/tasks` | Get all tasks of a specific user |

**Authentication Header (all protected routes):**
```
Authorization: Bearer <your_jwt_token>
```

---

## ❌ Error Response Format

Every API error returns this consistent structure:

```json
{
  "success": false,
  "status": "fail",
  "message": "Task not found."
}
```

| Status Code | Meaning |
|:-----------:|---------|
| `400` | Bad request / validation failed |
| `401` | Not logged in / invalid token |
| `403` | Forbidden — wrong role |
| `404` | Resource not found |
| `409` | Conflict (e.g. duplicate email) |
| `500` | Internal server error |

---

## 🧰 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + React Router v6 | UI and client-side routing |
| State | React Context API | Global auth state |
| HTTP | Axios | API requests with auto token |
| Notifications | react-hot-toast | Success / error toasts |
| Backend | Node.js + Express.js | REST API server |
| Database | MongoDB Atlas + Mongoose | Data storage and modeling |
| Auth | JWT + bcryptjs | Secure token auth + password hashing |
| Validation | express-validator | API input validation |
| Deployment | Vercel (frontend) + Render (backend) | Cloud hosting |

---

## 🚀 Deployment

### Frontend → Vercel

1. Push the `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project → Import repo
3. Add environment variable: `REACT_APP_API_URL` = your Render backend URL
4. Deploy — Vercel handles everything automatically

> The included `vercel.json` handles SPA routing so page refreshes work correctly.

### Backend → Render

1. Push the `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service → Connect repo
3. Build command: `npm install`
4. Start command: `npm start`
5. Add all variables from your `.env` file
6. Deploy

---

## 🔒 Security Notes

- `superadmin` role **cannot** be assigned via any API request — it is blocked at middleware level
- Passwords are hashed with **bcryptjs** (12 salt rounds) — never stored in plain text
- JWT tokens expire after **7 days** by default
- All role checks are enforced on the **backend** — frontend guards are for UX only
- Admin cannot modify or delete other admins — enforced in `roleMiddleware.js`

---

## 👨‍💻 Submitted By

| | |
|--|--|
| **Name** | Mayank Singh |
| **Institution** | GNIOT (Greater Noida Institute of Technology) |
| **Roll No** | 2201320100097 |
| **Phone** | 8957798493 |
| **Email** | mayanksingh02728@gmail.com |
| **Live App** | [taskflow.vercel.app](https://task-flow-git-main-mayanksingh-ai1s-projects.vercel.app/) |
| **GitHub** | [github.com/mayanksingh-ai1/TaskFlow](https://github.com/mayanksingh-ai1/TaskFlow) |

---

<div align="center">

Made By Mayank❤️ using the MERN Stack

</div>