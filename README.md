<div align="center">

# 🗂️ KanFlow

### A full-stack Kanban task-management platform — turn chaos into clear, moving work.

Drag-and-drop boards · priority intelligence · deadline tracking · multi-user workspaces · JWT auth

[![Live Demo](https://img.shields.io/badge/Live_Demo-dakshmehrotraa.github.io/Kanflow-6c5ce7?style=for-the-badge)](https://dakshmehrotraa.github.io/Kanflow/)

![Stack](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-5FA04E?style=flat&logo=node.js&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![License](https://img.shields.io/badge/license-MIT-blue)

</div>

---

![KanFlow screenshot](docs/screenshot.png)

## ✨ Overview

**KanFlow** is a Kanban-style productivity platform where teams organize work into
visual boards. Tasks move through columns via drag-and-drop, carry priority tags and
deadlines, and live inside isolated multi-user workspaces secured by stateless JWT
authentication with role-based access control.

> **🔗 Try it now:** **[dakshmehrotraa.github.io/Kanflow](https://dakshmehrotraa.github.io/Kanflow/)**
> Click **“Enter the live demo →”** — no sign-up needed. State persists in your browser.

## 🎯 Features

- **Drag-and-drop boards** — reorder tasks and move them across columns with a live drop indicator.
- **Priority intelligence** — Low / Medium / High / Urgent tags with a consistent color system and one-tap filtering.
- **Deadline tracking** — due-date badges that shift to *amber* when due soon and *red* with an overdue counter when late.
- **Multi-user workspaces** — switch between projects, each with its own columns, tasks, and members.
- **Workspace-level isolation + RBAC** — owner / editor / viewer roles; members only ever see workspaces they belong to.
- **Live stats** — total, urgent-open, overdue, and a completion ring that updates as cards reach *Done*.
- **Polished UX** — editable columns, task editor modal, search, light/dark themes, keyboard shortcuts.

## 🧱 Tech Stack

| Layer     | Technology |
|-----------|------------|
| Frontend  | Vanilla JS SPA (self-contained, zero-build) with a custom glassmorphism design system |
| Backend   | Node.js · Express (REST API) |
| Database  | MongoDB · Mongoose ODM |
| Auth      | JSON Web Tokens (stateless) · bcrypt password hashing |
| Access    | Role-based middleware with per-workspace resource isolation |

> The live demo runs the **frontend** on in-browser state so it needs no server.
> The **`/server`** folder is the production REST API that backs the same data model.

## 📁 Project Structure

```
Kanflow/
├── index.html              # Frontend SPA (the live demo)
├── docs/
│   └── screenshot.png
└── server/                 # REST API
    ├── server.js           # App entry — middleware, routes, error handling
    ├── config/db.js        # MongoDB connection
    ├── models/             # Mongoose schemas
    │   ├── User.js         #   auth + bcrypt + account role
    │   ├── Workspace.js    #   project + embedded columns + members/roles
    │   └── Card.js         #   task: priority, due, tags, column, order
    ├── middleware/
    │   ├── authMiddleware.js    # protect() JWT guard + requireRole()
    │   ├── workspaceAccess.js   # membership isolation + owner/editor/viewer RBAC
    │   └── errorMiddleware.js   # 404 + normalized error responses
    ├── controllers/        # auth / workspace / card logic
    ├── routes/             # /api/auth, /api/workspaces (+ nested cards)
    └── seed.js             # demo data seeder
```

## 🚀 Getting Started

### Frontend (the live app)

It’s a single self-contained file — just open it:

```bash
# any static server works, e.g.
npx serve .
# or simply open index.html in a browser
```

### Backend (REST API)

**Prerequisites:** Node.js 18+ and a MongoDB instance (local or Atlas).

```bash
cd server
npm install
cp .env.example .env          # then edit MONGO_URI and JWT_SECRET
npm run seed                  # optional: load demo data
npm run dev                   # starts on http://localhost:5000
```

Health check: `GET http://localhost:5000/api/health`

## 📡 API Reference

All `/api/workspaces` routes require an `Authorization: Bearer <token>` header.

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Create an account, returns a JWT |
| `POST` | `/api/auth/login` | Public | Authenticate, returns a JWT |
| `GET`  | `/api/auth/me` | Private | Current user |
| `GET`  | `/api/workspaces` | Member | List your workspaces |
| `POST` | `/api/workspaces` | Private | Create a workspace (you become owner) |
| `GET`  | `/api/workspaces/:id` | Viewer+ | Get a workspace with its cards |
| `PATCH`| `/api/workspaces/:id` | Editor+ | Update name / color / columns |
| `DELETE`| `/api/workspaces/:id` | Owner | Delete workspace + its cards |
| `POST` | `/api/workspaces/:id/members` | Owner | Add a member with a role |
| `GET`  | `/api/workspaces/:id/cards` | Viewer+ | List cards |
| `POST` | `/api/workspaces/:id/cards` | Editor+ | Create a card |
| `PATCH`| `/api/workspaces/:id/cards/:cardId` | Editor+ | Update a card |
| `PATCH`| `/api/workspaces/:id/cards/:cardId/move` | Editor+ | Move / reorder (drag & drop) |
| `DELETE`| `/api/workspaces/:id/cards/:cardId` | Editor+ | Delete a card |

### Example

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Ada","email":"ada@team.com","password":"secret123"}'

# Create a workspace with the returned token
curl -X POST http://localhost:5000/api/workspaces \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Product Launch"}'
```

## 🔐 Security Notes

- Passwords are hashed with **bcrypt** and never returned by the API (`select: false`).
- JWTs are **stateless** and verified on every private request — no session store.
- **Resource isolation:** non-members receive `404` (not `403`) so a workspace’s existence is never leaked.
- Role hierarchy enforced per route: `owner > editor > viewer`.

## 🗺️ Roadmap

- [ ] React frontend with context-based global state (consuming this API)
- [ ] Real-time board sync via WebSockets
- [ ] Member invites by email + activity feed
- [ ] File attachments on cards

## 📄 License

MIT © Daksh Mehrotra
