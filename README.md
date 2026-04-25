# TaskFlow — Task Management System

> Full-stack MERN application with JWT authentication, role-based access control, and real-time task management.

**🔗 Live:** https://task-flow-git-main-mayanksingh-ai1s-projects.vercel.app/

---

## 👑 Role Hierarchy

```
Super Admin  →  Admin  →  User
```

| Role | Access Level |
|------|-------------|
| **Super Admin** | Full system authority. Manages all Admins, Users, and Tasks. The only role that can promote or demote Admins. Has every permission of Admin + User combined. |
| **Admin** | Manages all Users (view, edit role/status, delete) and all Tasks. Cannot manage other Admins. |
| **User** | Can only create, view, edit, and delete their own tasks. No access to other users' data. |

---

## 🔐 Super Admin Credentials

```
name     : "Super Admin"
email    : superadmin@taskflow.com
password : SuperSecret@2024!
role     : superadmin
```

---

## ⚡ Quick Start

```bash
git clone https://github.com/mayanksingh-ai1/TaskFlow.git
cd TaskFlow
# 1. Install all dependencies (root + backend + frontend)
npm run install-all

# 2. Start both servers
npm run dev
```

- Frontend → http://localhost:3000
- Backend  → http://localhost:5000

---

## 🗺️ Pages

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Login with email & password |
| `/register` | Public | Create a new account |
| `/dashboard` | Auth | Stats, progress bar, recent tasks |
| `/tasks` | Auth | Create, edit, delete, filter tasks |
| `/admin/users` | Admin+ | Manage all users and roles |
| `/admin/tasks` | Admin+ | View and manage all tasks |
| `/unauthorized` | Any | 403 Access Denied |

---

## 🛡️ Permissions

| Action | Super Admin | Admin | User |
|--------|:-----------:|:-----:|:----:|
| Manage own tasks | ✅ | ✅ | ✅ |
| View all tasks | ✅ | ✅ | ❌ |
| Edit / delete any task | ✅ | ✅ | ❌ |
| Manage Users | ✅ | ✅ | ❌ |
| Manage Admins | ✅ | ❌ | ❌ |
| Full system access | ✅ | ❌ | ❌ |

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint | Access |
|--------|----------|--------|
| `POST` | `/auth/register` | Public |
| `POST` | `/auth/login` | Public |
| `GET` | `/auth/me` | Private |
| `POST` | `/auth/logout` | Private |

### Tasks — `/api/tasks`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get tasks (admin = all, user = own) |
| `POST` | `/tasks` | Create task |
| `PUT` | `/tasks/:id` | Update task |
| `DELETE` | `/tasks/:id` | Delete task |
| `PATCH` | `/tasks/:id/status` | Update status only |

### Users — `/api/users` *(Admin+ only)*

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/users` | Get all users |
| `PUT` | `/users/:id` | Update role / status |
| `DELETE` | `/users/:id` | Delete user + their tasks |
| `GET` | `/users/:id/tasks` | Get tasks of specific user |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas + Mongoose |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| Deployment | Vercel (frontend) + Render (backend) |



---

## 👨‍💻 Submitted By

| | |
|--|--|
| **Name** | Mayank Singh |
| **Institution** | GNIOT (Greater Noida Institute of Technology) |
| **Roll No** | 2201320100097 |
| **Phone** | 8957798493 |
| **Email** | mayanksingh02728@gmail.com |