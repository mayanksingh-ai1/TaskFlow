# TaskFlow Frontend

A production-ready React frontend for the Task Flow Management System.  
Dark-themed, responsive, with role-based UI, protected routes, toast notifications, and a full task CRUD interface.

---

## 📁 Project Structure

```
task-manager-frontend/
│
├── public/
│   └── index.html               # HTML shell with Google Fonts
│
├── src/
│   ├── api/
│   │   └── index.js             # Axios instance + all API calls
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── ProtectedRoute.js   # ProtectedRoute, AdminRoute, PublicRoute
│   │   │   ├── TaskForm.js         # Create/Edit task modal
│   │   │   ├── ConfirmModal.js     # Delete confirmation dialog
│   │   │   ├── StatusBadge.js      # Coloured status badge
│   │   │   └── PriorityBadge.js    # Coloured priority badge
│   │   └── layout/
│   │       ├── Layout.js           # Sidebar + main content shell
│   │       └── Layout.css
│   │
│   ├── context/
│   │   └── AuthContext.js       # Global auth state (login/logout/register)
│   │
│   ├── pages/
│   │   ├── Login.js / Auth.css
│   │   ├── Register.js
│   │   ├── Dashboard.js / Dashboard.css
│   │   ├── Tasks.js / Tasks.css
│   │   ├── AdminUsers.js / AdminUsers.css
│   │   ├── AdminTasks.js
│   │   ├── Unauthorized.js / ErrorPages.css
│   │   └── NotFound.js
│   │
│   ├── App.js                   # Router + route configuration
│   ├── index.js                 # React entry point
│   └── index.css                # Global design system + utilities
│
├── .env                         # Environment variables
├── .env.example
└── package.json
```



### Prerequisites
- Node.js v18+
- Backend server running at `http://localhost:5000`


### Step 2 — Configure environment
```bash
cp .env.example .env
```

Edit `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```


### Step 3 — Start the app
```bash
npm start
```
Opens at `http://localhost:3000`

---

## 🔐 Auth Flow

1. Visit `/register` to create an account (choose role: user or admin)
2. Login at `/login` — JWT token stored in `localStorage`
3. Token is auto-attached to all API requests via Axios interceptor
4. On 401, user is auto-redirected to `/login`
5. Logout clears token and redirects to `/login`

---

## 🗺️ Pages & Routes

| Route              | Access       | Description                         |
|--------------------|--------------|-------------------------------------|
| `/`                | Public       | Redirects to `/dashboard`           |
| `/login`           | Public only  | Login form                          |
| `/register`        | Public only  | Registration form                   |
| `/dashboard`       | Authenticated | Stats, completion rate, recent tasks|
| `/tasks`           | Authenticated | Task list with CRUD & filters       |
| `/admin/users`     | Admin only   | User management                     |
| `/admin/tasks`     | Admin only   | All tasks across all users          |
| `/unauthorized`    | Any          | 403 page                            |
| `*`                | Any          | 404 Not Found                       |



---

## 📦 Dependencies

| Package          | Purpose                          |
|------------------|----------------------------------|
| react            | UI framework                     |
| react-dom        | DOM rendering                    |
| react-router-dom | Client-side routing              |
| axios            | HTTP client with interceptors    |
| react-hot-toast  | Toast notification system        |
| react-scripts    | CRA build tooling                |
