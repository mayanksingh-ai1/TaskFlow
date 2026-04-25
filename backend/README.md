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

### Step 1 — Clone / Download the project

```bash
# If using git
git clone <your-repo-url>
cd task-manager-backend

# Or just navigate into the folder
cd task-manager-backend
```

---

### Step 2 — Install dependencies

```bash
npm install
```

This installs all packages listed in `package.json`:
- `express` — web framework
- `mongoose` — MongoDB ODM
- `bcryptjs` — password hashing
- `jsonwebtoken` — JWT auth
- `express-validator` — input validation
- `cors` — cross-origin requests
- `dotenv` — env variable loader
- `nodemon` (dev) — auto-restart on file changes

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
```

> ⚠️ **Never commit your `.env` file to GitHub.**

---

### Step 4 — MongoDB Atlas Setup (if not done)

1. Go to https://cloud.mongodb.com
2. Create a free cluster
3. Click **Database Access** → Add a new database user with read/write access
4. Click **Network Access** → Add IP Address → Allow from anywhere (`0.0.0.0/0`) for development
5. Click **Connect** → **Connect your application** → copy the connection string
6. Paste it into `MONGO_URI` in your `.env`, replacing `<username>` and `<password>`

---

### Step 5 — Run the server

**Development mode** (auto-restarts on changes):
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

You should see:
```
✅ MongoDB Connected: cluster0.mongodb.net
🚀 Server running in development mode on port 5000
📡 API Base URL: http://localhost:5000/api
❤️  Health Check: http://localhost:5000/api/health
```

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

**Register — Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "user"
}
```

**Login — Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Login — Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "664abc...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

> All protected routes require the header:  
> `Authorization: Bearer <your_token>`

---

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

**Query Parameters for GET /tasks:**
```
?status=Pending          # filter by status
?priority=High           # filter by priority
?page=1&limit=10         # pagination
```

**Create Task — Request Body:**
```json
{
  "title": "Fix login bug",
  "description": "The login button doesn't work on mobile",
  "status": "Pending",
  "priority": "High",
  "dueDate": "2024-12-31",
  "assignedTo": "664abc123..."
}
```

**Update Status — Request Body:**
```json
{
  "status": "In Progress"
}
```

---

### 👥 User Routes — `/api/users` (Admin Only)

| Method | Endpoint               | Access | Description                     |
|--------|------------------------|--------|---------------------------------|
| GET    | `/users`               | Admin  | Get all users                   |
| GET    | `/users/:id`           | Admin  | Get a single user               |
| PUT    | `/users/:id`           | Admin  | Update user role or status      |
| DELETE | `/users/:id`           | Admin  | Delete user + their tasks       |
| GET    | `/users/:id/tasks`     | Admin  | Get all tasks of a specific user|

**Update User — Request Body:**
```json
{
  "role": "admin",
  "isActive": true
}
```

---

## 🛡️ Role Permissions

| Feature                     | Admin | User (own tasks only) |
|-----------------------------|-------|-----------------------|
| View all tasks              | ✅    | ❌                    |
| View own tasks              | ✅    | ✅                    |
| Create task (for anyone)    | ✅    | ❌                    |
| Create task (for self)      | ✅    | ✅                    |
| Edit any task               | ✅    | ❌                    |
| Edit own task               | ✅    | ✅                    |
| Delete any task             | ✅    | ❌                    |
| Delete own task             | ✅    | ✅                    |
| View all users              | ✅    | ❌                    |
| Update user role/status     | ✅    | ❌                    |
| Delete users                | ✅    | ❌                    |

---

## ❌ Error Response Format

All errors follow this consistent format:

```json
{
  "success": false,
  "status": "fail",
  "message": "Task not found."
}
```

| Status Code | Meaning                          |
|-------------|----------------------------------|
| 400         | Bad request / validation error   |
| 401         | Unauthorized (no/invalid token)  |
| 403         | Forbidden (wrong role)           |
| 404         | Resource not found               |
| 409         | Conflict (duplicate email)       |
| 500         | Internal server error            |

---

## 🚀 Deployment

### Backend — Render (recommended free tier)

1. Push code to GitHub
2. Go to https://render.com → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
5. Add all environment variables from `.env`
6. Deploy

### Backend — Railway

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy automatically

> Set `NODE_ENV=production` in your deployment environment variables.

---

## 🧪 Testing with Postman / Thunder Client

1. Import the base URL: `http://localhost:5000/api`
2. Register a user → copy the `token` from response
3. Set Header: `Authorization: Bearer <token>` on all protected routes
4. Test all CRUD operations

---

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
