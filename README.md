# Task Manager

A role-based task management application with admin oversight and activity tracking.

## Features

**Users**

- Sign up and sign in with JWT authentication
- Create, view, update, and delete their own tasks
- Mark tasks Pending or Completed
- Filter tasks by status

**Admins**

- Everything users can do, plus an admin dashboard
- Workspace overview with live stats (total users, total tasks, completed, pending) and a recent-activity strip
- User management — view all users, activate/deactivate accounts, delete users (cascades to their tasks)
- Task monitoring — view, filter, and search every task across the workspace; delete any task
- Activity logs — chronological feed of every login and task event, with action-type filters and search

**System**

- Role-based access control enforced on both the API (middleware) and the UI (route guards + conditional nav)
- Activity logging on login and task create/update/delete
- Inactive accounts blocked at login and on every authenticated request

## Tech Stack

- **Backend** — Node.js, Express 4, MongoDB (Mongoose 8), JWT, bcryptjs
- **Frontend** — React 18, Vite, React Router 6, Context API, native `fetch`, Tailwind CSS 3

## Project Structure

task-manager/
├── backend/
│ ├── config/ # DB connection
│ ├── controllers/ # auth, task, admin
│ ├── middleware/ # protect (JWT) + adminOnly (role gate)
│ ├── models/ # User, Task, ActivityLog
│ ├── routes/ # /api/auth, /api/tasks, /api/admin
│ ├── utils/ # generateToken, logActivity
│ ├── app.js # Express app
│ └── server.js # bootstrap
└── frontend/
└── src/
├── components/ # reusable UI (Modal, DataTable, StatCard, …)
├── context/ # AuthProvider + useAuth hook
├── lib/ # fetch wrapper, cn utility
├── pages/ # Login, Register, MyTasks, admin/\*
├── routes/ # ProtectedRoute, AdminRoute
└── App.jsx # route map

## Setup

### Prerequisites

- Node.js 18+
- A MongoDB instance (local or Atlas)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI, JWT_SECRET, and (optionally) CLIENT_URL/PORT in .env
npm run dev
```

The API runs on `http://localhost:5001` by default. Health check: `GET /api/health`.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env
# adjust VITE_API_URL if your backend isn't on http://localhost:5001/api
npm run dev
```

The app runs on `http://localhost:5173`.

### Creating the first admin

The register form always creates regular Users. To seed an admin, hit the register endpoint directly with `role: "Admin"`:

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Admin","email":"admin@example.com","password":"yourpassword","role":"Admin"}'
```

Then sign in through the UI with that account.

## API Reference

### Auth — `/api/auth`

| Method | Path        | Body                                 | Description          |
| ------ | ----------- | ------------------------------------ | -------------------- |
| POST   | `/register` | `name`, `email`, `password`, `role?` | Create account       |
| POST   | `/login`    | `email`, `password`                  | Sign in, returns JWT |

### Tasks (user) — `/api/tasks` _(JWT required)_

| Method | Path   | Description     |
| ------ | ------ | --------------- |
| GET    | `/`    | List own tasks  |
| POST   | `/`    | Create own task |
| PUT    | `/:id` | Update own task |
| DELETE | `/:id` | Delete own task |

### Admin — `/api/admin` _(JWT + Admin role required)_

| Method | Path                | Description                           |
| ------ | ------------------- | ------------------------------------- |
| GET    | `/stats`            | Dashboard counts                      |
| GET    | `/users`            | List all users                        |
| PUT    | `/users/:id/status` | Set user Active/Inactive              |
| DELETE | `/users/:id`        | Delete user (cascades to their tasks) |
| GET    | `/tasks`            | List all tasks across users           |
| DELETE | `/tasks/:id`        | Delete any task                       |
| GET    | `/logs`             | Latest 200 activity events            |

Authenticated requests must send `Authorization: Bearer <token>`.

## Environment Variables

### `backend/.env`

| Key              | Example                          |
| ---------------- | -------------------------------- |
| `PORT`           | `5001`                           |
| `MONGO_URI`      | `mongodb+srv://…/task-manager?…` |
| `JWT_SECRET`     | a long random string             |
| `JWT_EXPIRES_IN` | `7d`                             |
| `CLIENT_URL`     | `http://localhost:5173`          |

### `frontend/.env`

| Key            | Example                     |
| -------------- | --------------------------- |
| `VITE_API_URL` | `http://localhost:5001/api` |
