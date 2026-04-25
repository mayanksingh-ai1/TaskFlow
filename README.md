# 🚀 TaskFlow — Full Stack MERN Task Management System

A complete MERN stack application with JWT authentication, role-based access control (Admin / User), full task CRUD, global error handling, and a polished dark-themed React frontend.

---

## 📁 Project Structure

```
taskflow-project/
├── backend/                    ← Node.js + Express REST API
│   ├── config/db.js            ← MongoDB Atlas connection
│   ├── controllers/            ← Auth, Task, User logic
│   ├── middleware/             ← JWT auth, role check, error handler, validation
│   ├── models/                 ← User & Task Mongoose schemas
│   ├── routes/                 ← /api/auth, /api/tasks, /api/users
│   ├── utils/                  ← AppError class, JWT helpers
│   ├── server.js               ← Express entry point
│   ├── .env                    ← ⚠️ Already filled with your MongoDB credentials
│   └── package.json
│
├── frontend/                   ← React 18 SPA
│   ├── public/index.html
│   ├── src/
│   │   ├── api/index.js        ← Axios instance with auto-auth + auto-logout
│   │   ├── context/AuthContext.js
│   │   ├── components/         ← Layout, TaskForm, Badges, Modals, Guards
│   │   └── pages/              ← Login, Register, Dashboard, Tasks, Admin pages
│   ├── .env                    ← Points to http://localhost:5000/api
│   └── package.json
│
├── package.json                ← Root: run both servers with one command
└── README.md
```

---

## ⚡ QUICK START (3 Steps)

### Step 1 — Open in VS Code

```
File → Open Folder → select "taskflow-project"
```

### Step 2 — Install all dependencies

Open the **VS Code Terminal** (`Ctrl + ~`) and run:

```bash
npm run install-all
```

This installs packages for the root, backend, and frontend automatically.

### Step 3 — Start both servers

```bash
npm run dev
```

✅ Backend starts at: **http://localhost:5000**
✅ Frontend starts at: **http://localhost:3000**

Your browser will open automatically at http://localhost:3000

---

## 🔑 MongoDB — Already Configured

Your `.env` file in `/backend/` is already set up with your MongoDB Atlas credentials:

```
MONGO_URI=mongodb+srv://mayanksingh02728_db_user:yz4MAFFVc5DPaj9p@cluster0.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_2024
PORT=5000
```

> ⚠️ Make sure your MongoDB Atlas cluster allows connections from your IP.
> Go to: Atlas Dashboard → Network Access → Add IP → Add Current IP Address

---

## 🗺️ All Pages

| URL                | Who Can Access | What It Does                        |
|--------------------|----------------|-------------------------------------|
| `/`                | Anyone         | Redirects to dashboard              |
| `/login`           | Public only    | Login with email + password         |
| `/register`        | Public only    | Create new account                  |
| `/dashboard`       | Logged in      | Stats, progress bar, recent tasks   |
| `/tasks`           | Logged in      | Create / edit / delete / filter tasks |
| `/admin/users`     | Admin only     | Manage all users, roles, status     |
| `/admin/tasks`     | Admin only     | View and manage all tasks           |
| `/unauthorized`    | Anyone         | 403 Access Denied page              |
| `*`                | Anyone         | 404 Not Found page                  |

---

## 🛡️ Role Permissions

| Action                        | Admin | User  |
|-------------------------------|-------|-------|
| View own tasks                | ✅   | ✅    |
| Create task (assign to self)  | ✅   | ✅    |
| Edit / Delete own task        | ✅   | ✅    |
| View ALL tasks                | ✅   | ❌    |
| Create task for any user      | ✅   | ❌    |
| Edit / Delete any task        | ✅   | ❌    |
| View all users                | ✅   | ❌    |
| Change user role / status     | ✅   | ❌    |
| Delete any user               | ✅   | ❌    |

---

## 📡 API Endpoints

### Auth — `/api/auth`
| Method | Endpoint        | Access  | Description        |
|--------|-----------------|---------|--------------------|
| POST   | /auth/register  | Public  | Register new user  |
| POST   | /auth/login     | Public  | Login → get token  |
| GET    | /auth/me        | Private | Get current user   |
| POST   | /auth/logout    | Private | Logout             |

### Tasks — `/api/tasks`
| Method | Endpoint              | Access  | Description                     |
|--------|-----------------------|---------|---------------------------------|
| GET    | /tasks                | Private | Get tasks (admin=all, user=own) |
| POST   | /tasks                | Private | Create task                     |
| GET    | /tasks/:id            | Private | Get one task                    |
| PUT    | /tasks/:id            | Private | Update task                     |
| DELETE | /tasks/:id            | Private | Delete task                     |
| PATCH  | /tasks/:id/status     | Private | Update status only              |

### Users — `/api/users` (Admin Only)
| Method | Endpoint           | Access | Description                  |
|--------|--------------------|--------|------------------------------|
| GET    | /users             | Admin  | Get all users                |
| GET    | /users/:id         | Admin  | Get single user              |
| PUT    | /users/:id         | Admin  | Update role/status           |
| DELETE | /users/:id         | Admin  | Delete user + their tasks    |
| GET    | /users/:id/tasks   | Admin  | Get tasks of specific user   |

---

## 🔐 Testing with Postman / Thunder Client

1. **Register** → POST `http://localhost:5000/api/auth/register`
   ```json
   { "name": "Admin User", "email": "admin@test.com", "password": "password123", "role": "admin" }
   ```
2. Copy the `token` from the response
3. Add header to all protected requests:
   `Authorization: Bearer <your_token>`

---

## 🚀 Deployment

### Backend → Render.com (Free)
1. Push `backend/` folder to a GitHub repo
2. Go to https://render.com → New Web Service
3. Connect your repo
4. Build command: `npm install`
5. Start command: `npm start`
6. Add environment variables from `backend/.env`
7. Deploy

### Frontend → Vercel (Free)
1. Push `frontend/` folder to a GitHub repo
2. Go to https://vercel.com → New Project
3. Import your repo
4. Add environment variable:
   `REACT_APP_API_URL` = your Render backend URL
5. Deploy (vercel.json handles SPA routing automatically)

---

## 🧰 Tech Stack

| Layer     | Technology                                    |
|-----------|-----------------------------------------------|
| Frontend  | React 18, React Router v6, Axios, react-hot-toast |
| Backend   | Node.js, Express.js                           |
| Database  | MongoDB Atlas + Mongoose                      |
| Auth      | JWT (jsonwebtoken) + bcryptjs                 |
| Validation| express-validator                             |
| Styling   | Pure CSS with custom design system (no UI lib)|
| Fonts     | Syne (display) + DM Sans (body)               |

---

## ❌ Error Format (All API errors)

```json
{
  "success": false,
  "status": "fail",
  "message": "Task not found."
}
```

---

## 💡 Tips

- After registering, log in and check the `/dashboard` for your stats
- Register with `"role": "admin"` to unlock the Admin panel
- Use the inline status dropdown on the Tasks page to quickly update task status
- On mobile, use the hamburger menu to open the sidebar
