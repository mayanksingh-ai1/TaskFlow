# Task Flow Management System — Backend

A production-ready REST API built with Node.js, Express.js, and MongoDB.  
Supports JWT authentication, role-based access control (Admin / User), full task CRUD, and global error handling.

---

## 📁 Project Structure

```
task-manager-backend/
│
├── config/
│   └── db.js                    # MongoDB connection
│
├── controllers/
│   ├── authController.js        # Register, Login, Logout, GetMe
│   ├── taskController.js        # Task CRUD + status update
│   └── userController.js        # Admin user management
│
├── middleware/
│   ├── authMiddleware.js        # JWT protect + role authorize
│   ├── errorMiddleware.js       # Global error handler
│   └── validationMiddleware.js  # express-validator rules
│
├── models/
│   ├── User.js                  # User schema (name, email, password, role)
│   └── Task.js                  # Task schema (title, status, priority, etc.)
│
├── routes/
│   ├── authRoutes.js            # /api/auth/*
│   ├── taskRoutes.js            # /api/tasks/*
│   └── userRoutes.js            # /api/users/* (admin only)
│
├── utils/
│   ├── AppError.js              # Custom operational error class
│   └── tokenUtils.js           # JWT generation helper
│
├── .env                         # Environment variables (never commit this)
├── .env.example                 # Environment variables template
├── .gitignore
├── package.json
├── server.js                    # App entry point
└── README.md
```

---

## ⚙️ Initial Setup — Step by Step

### Prerequisites
- **Node.js** v18+ → https://nodejs.org
- **npm** v9+ (comes with Node.js)
- **MongoDB Atlas** account (free tier works)


---

### Step 3 — Configure environment variables

Copy the example file and fill in your values:

```bash
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskmanager?retryWrites=true&w=majority
JWT_SECRET=replace_this_with_a_long_random_secret_string
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:3000



---

## 🔌 API Endpoints

### Base URL
```
http://localhost:5000/api
```

---

### 🔐 Auth Routes — `/api/auth`

| Method | Endpoint           | Access  | Description          |
|--------|--------------------|---------|----------------------|
| POST   | `/auth/register`   | Public  | Register new user    |
| POST   | `/auth/login`      | Public  | Login and get token  |
| GET    | `/auth/me`         | Private | Get logged-in user   |
| POST   | `/auth/logout`     | Private | Logout               |



### ✅ Task Routes — `/api/tasks`

All routes require authentication.

| Method | Endpoint                  | Access       | Description                        |
|--------|---------------------------|--------------|------------------------------------|
| GET    | `/tasks`                  | Private      | Get tasks (admin=all, user=own)    |
| POST   | `/tasks`                  | Private      | Create a task                      |
| GET    | `/tasks/:id`              | Private      | Get a single task                  |
| PUT    | `/tasks/:id`              | Private      | Update a task                      |
| DELETE | `/tasks/:id`              | Private      | Delete a task                      |
| PATCH  | `/tasks/:id/status`       | Private      | Update task status only            |




---

### 👥 User Routes — `/api/users` (Admin Only)

| Method | Endpoint               | Access | Description                     |
|--------|------------------------|--------|---------------------------------|
| GET    | `/users`               | Admin  | Get all users                   |
| GET    | `/users/:id`           | Admin  | Get a single user               |
| PUT    | `/users/:id`           | Admin  | Update user role or status      |
| DELETE | `/users/:id`           | Admin  | Delete user + their tasks       |
| GET    | `/users/:id/tasks`     | Admin  | Get all tasks of a specific user|







## 📦 Dependencies

| Package             | Purpose                          |
|---------------------|----------------------------------|
| express             | Web framework                    |
| mongoose            | MongoDB object modeling          |
| bcryptjs            | Password hashing (12 rounds)     |
| jsonwebtoken        | JWT creation and verification    |
| express-validator   | Request body validation          |
| cors                | Cross-Origin Resource Sharing    |
| dotenv              | Environment variable management  |
| nodemon (dev)       | Auto server restart in dev       |
