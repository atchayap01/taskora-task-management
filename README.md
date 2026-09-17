# Taskora — Task Management Application

**Plan. Prioritize. Get things done.**

A full-stack task management app built for the Thiranex Full Stack Development Internship. Users register, log in, and manage their own tasks (create, edit, complete, delete, filter, search) on a clean, responsive dashboard. Every task is scoped to its owner, so one user can never see or modify another user's tasks.

> Internal project folder name is `TaskBuddy` for historical reasons; the product itself is branded **Taskora**. This is a standalone project — separate from any other portfolio project you may have.
## 🚀 Live Demo

**Frontend:** https://taskora-bice.vercel.app/

**Backend API:** https://taskora-backend-pkzl.onrender.com/

## Features

- **Authentication**: Register, log in, log out, JWT-based sessions
- **Authorization**: Every task API call is scoped to `req.user.id` — no user can read/edit/delete another user's task, even by guessing an ID in the URL
- **Task CRUD**: Create, read, update, delete tasks
- **Task properties**: title, description, status (Pending / In Progress / Completed), priority (Low / Medium / High), due date
- **Quick complete/undo** toggle on each task card
- **Search** by title/description, **filter** by status and priority
- **Dashboard stats**: total, pending, in progress, completed, high-priority counts
- **Responsive UI**: works on desktop, tablet, and mobile
- **Proper error handling**: validation errors, duplicate email, invalid login, expired/invalid tokens, 404s, and server errors are all handled gracefully — no uncaught exceptions
- **Confirmation dialog** before deleting a task
- **Loading and empty states** throughout
- **Accurate dashboard stats**: the five stat cards (Total, Pending, In Progress, Completed, High Priority) always reflect *all* of the user's tasks, independent of the current search/filter — only the task grid below responds to search and filters
- **Safe search**: search text is treated as literal text, not regex, so queries like `C++`, `C#`, `Node.js`, or `test?` work without errors

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, React Router, Axios, plain CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT (jsonwebtoken), bcryptjs for password hashing |
| Deployment | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

## Folder Structure

```
TaskBuddy/
├── frontend/
│   ├── src/
│   │   ├── components/    # TaskCard, TaskModal, ConfirmDialog, StatsBar, ProtectedRoute
│   │   ├── pages/         # Login, Register, Dashboard
│   │   ├── context/       # AuthContext (global auth state)
│   │   ├── services/      # api.js, authService.js, taskService.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
│
├── backend/
│   ├── config/db.js               # MongoDB connection
│   ├── controllers/               # authController.js, taskController.js
│   ├── middleware/                # auth.js (JWT check), errorHandler.js
│   ├── models/                    # User.js, Task.js
│   ├── routes/                    # authRoutes.js, taskRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Local Setup

### Prerequisites
- Node.js 18+
- A MongoDB connection string (either local MongoDB, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env`:
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=a-long-random-string
PORT=5000
CLIENT_URL=http://localhost:5173
```

Generate a strong `JWT_SECRET` with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run the backend:
```bash
npm run dev
```
You should see `MongoDB connected: ...` and `Taskora backend running on port 5000` in the console. Visit `http://localhost:5000/api/health` — it should return `{"success":true,"status":"ok"}`.

### 2. Frontend

In a new terminal:
```bash
cd frontend
npm install
cp .env.example .env
```

Edit `.env`:
```
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:
```bash
npm run dev
```
Open `http://localhost:5173`. You should land on the login page.

## Environment Variables

**backend/.env**
| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB Atlas (or local) connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens — keep this private |
| `PORT` | Port for the Express server (default 5000) |
| `CLIENT_URL` | Allowed frontend origin(s) for CORS, comma-separated |

**frontend/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the backend API, e.g. `http://localhost:5000/api` |

Neither `.env` file is committed to git — both are listed in their respective `.gitignore` files. Only the `.env.example` files (with no real secrets) are committed.

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register with name, email, password, confirmPassword |
| POST | `/api/auth/login` | Public | Log in with email + password, returns JWT |
| GET | `/api/auth/me` | Private | Get the current logged-in user's profile |

### Tasks (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Get all tasks for the logged-in user. Supports `?status=`, `?priority=`, `?search=` query params |
| POST | `/api/tasks` | Create a new task |
| PUT | `/api/tasks/:id` | Update a task (only if it belongs to you) |
| PATCH | `/api/tasks/:id/status` | Quickly update just the status field |
| DELETE | `/api/tasks/:id` | Delete a task (only if it belongs to you) |

Every task route double-checks `user: req.user._id` on the query, so requesting or modifying someone else's task ID returns `404 Task not found` instead of leaking data.

## How to Test It Manually

1. Register a new account on `/register`.
2. You're redirected straight to `/dashboard` — try refreshing the page; you should stay logged in (JWT persisted in localStorage).
3. Click **Logout**, then try visiting `/dashboard` directly in the URL bar — you should be redirected to `/login` (protected route working).
4. Log back in, click **+ Add Task**, fill in a title, description, status, priority, and due date, and save.
5. Try the **Complete** button on a task — status flips to Completed and back.
6. Edit a task, delete a task (with the confirmation dialog), search by title, and filter by status/priority.
7. To verify authorization: log in as two different users in two browser windows, create a task as User A, copy its `_id` from the network tab, and try to `PUT`/`DELETE` it while logged in as User B — you should get a 404, not the task.

## Deployment

### Backend → Render
1. Push the `backend/` folder to a GitHub repo (or push the whole monorepo and set Render's root directory to `backend`).
2. In Render, create a **Web Service**, connect the repo, set:
   - Build command: `npm install`
   - Start command: `npm start`
   - Root directory: `backend` (if monorepo)
3. Add environment variables in Render's dashboard: `MONGODB_URI`, `JWT_SECRET`, `PORT` (Render sets this automatically, but you can leave your own too), `CLIENT_URL` (your deployed Vercel URL, added after step below).

### Frontend → Vercel
1. Push the `frontend/` folder (or the monorepo, setting Vercel's root directory to `frontend`).
2. In Vercel, import the repo, framework preset: **Vite**.
3. Add environment variable `VITE_API_URL` = your Render backend URL + `/api` (e.g. `https://taskora-backend.onrender.com/api`).
4. Deploy. Once you have the Vercel URL, go back to Render and set `CLIENT_URL` to that URL so CORS allows it.

### Database → MongoDB Atlas
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a database user and allow network access from anywhere (`0.0.0.0/0`) for Render to connect.
3. Copy the connection string into `MONGODB_URI` on Render.

## Security Notes

- Passwords are hashed with bcryptjs (10 salt rounds) — plain-text passwords are never stored or returned.
- The `password` field is excluded from all Mongoose queries by default (`select: false`) and stripped again in `toJSON()` as a safety net.
- JWTs expire after 30 days; expired or malformed tokens are rejected with a 401 and the frontend automatically logs the user out and redirects to `/login`.
- All task operations are scoped server-side to the authenticated user's ID — this cannot be bypassed from the frontend.
