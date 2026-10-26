# CollabFlow — Real-Time Collaborative Project Management Platform

> **Plan. Collaborate. Track. Complete.**

CollabFlow is a production-oriented, full-stack team collaboration and project management platform. Inspired by the speed of Linear, the clarity of Trello, the depth of Jira, and the immediacy of Slack, CollabFlow empowers modern engineering teams, departments, and organizations to coordinate complex initiatives with real-time Kanban synchronization, agile sprints, project discussions, and performance analytics.

---

## 🌟 Key Features

- **⚡ Real-Time Drag-and-Drop Kanban Boards**: Move cards across columns (*Backlog*, *Todo*, *In Progress*, *In Review*, *Done*) with instant WebSocket synchronization to all active collaborators via `@hello-pangea/dnd` and Socket.IO.
- **🛡️ 4-Tier Role-Based Access Control (RBAC)**: Enforced across organizations and projects (*Admin*, *Project Manager*, *Team Member*, *Viewer*) with database-level isolation against IDOR.
- **💬 Contextual Project Chat**: Dedicated project chat rooms with typing indicators, online presence, message threading, and author editing/deletion.
- **🔔 Live In-App Notifications**: Real-time alerts for task assignments, reassignments, task comments, and workspace invitations.
- **📅 Interactive Deadlines Calendar**: Monthly timeline views mapping deliverable due dates and project milestones with priority color-coding.
- **🏃 Agile Sprint Management**: Create time-boxed sprint cycles, set objectives, track task burndown velocity, and complete iterations.
- **📊 Reports & Safe CSV Exports**: Real-time task completion rate calculations, status distributions via Recharts, team workload metrics, and formula-injection-safe CSV export.
- **📁 Secure File Attachments**: Upload documents and media with MIME validation, safe storage names, and authorization-checked downloads.
- **🔍 Global Cmd+K Search**: Debounced search across accessible projects, tasks, and team members.
- **🌓 Light & Dark Theme**: Full theme engine persisted in `localStorage`.
- **🚀 Zero-Configuration Development**: Automatic fallback to an embedded in-memory MongoDB server (`mongodb-memory-server`) if a local MongoDB service is not present.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite 6, Tailwind CSS, React Router v7, `@hello-pangea/dnd`, Recharts, Lucide React, Axios, Socket.IO Client |
| **Backend** | Node.js (ESM), Express.js 4, Socket.IO 4, Mongoose 8, JWT, bcryptjs, Zod, Helmet, Cookie-Parser, Multer |
| **Database** | MongoDB (MongoDB Atlas in production; local or auto memory server in development) |
| **Testing** | Node.js Test Runner + Supertest (Backend), Vitest + React Testing Library (Frontend) |

---

## 🏗️ Monorepo Structure

```
CollabFlow/
├── client/                     # Vite + React SPA
│   ├── public/                 # Static assets & SVG logo
│   ├── src/
│   │   ├── components/         # Common, Layout, Tasks, Kanban, Admin, etc.
│   │   ├── context/            # Auth, Theme, Socket, Org, Notification contexts
│   │   ├── pages/              # Landing, Auth, Dashboard, Projects, Chat, etc.
│   │   ├── routes/             # ProtectedRoute, AdminRoute, AppRoutes
│   │   ├── services/           # Axios API services
│   │   └── styles/             # Tailwind directives & CSS
│   └── package.json
├── server/                     # Node.js + Express API & Socket.IO
│   ├── scripts/                # create-admin.js & seed-data.js
│   ├── src/
│   │   ├── config/             # DB connection, Env validation, Memory server
│   │   ├── controllers/        # Thin business logic controllers
│   │   ├── middleware/         # Auth, RBAC, OrgAuth, ProjectAuth, ErrorHandler
│   │   ├── models/             # 17 Mongoose database schemas
│   │   ├── routes/             # Versioned REST endpoints (/api/v1/*)
│   │   ├── services/           # Audit, Notifications, File storage
│   │   ├── sockets/            # Socket.IO handlers, rooms & presence
│   │   └── utils/              # Token hashing, CSV sanitizer, responses
│   ├── tests/                  # Automated backend test suites
│   └── package.json
├── docs/                       # API.md, SOCKET_EVENTS.md, ARCHITECTURE.md
├── .env.example                # Template environment variables
├── package.json                # Monorepo scripts
└── README.md
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20 or higher (v22 recommended)
- **npm**: v10 or higher
- **MongoDB**: (Optional for local development; embedded in-memory database activates automatically if not detected)

### 2. Installation
Clone the repository and install dependencies:

```bash
# In project root:
npm install
npm --prefix server install
npm --prefix client install
```

### 3. Environment Setup
Copy the example environment file:

```bash
cp .env.example .env
```

Configure your secrets in `.env`:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/collabflow
JWT_ACCESS_SECRET=your_super_secret_jwt_access_key_min_32_characters_long
JWT_REFRESH_SECRET=your_super_secret_jwt_refresh_key_min_32_characters_long
ADMIN_BOOTSTRAP_PASSWORD=ChangeMeNow123!
```

---

## 🔑 Demo Data & Administrator Bootstrap

### Bootstrap Initial Administrator
Create a platform administrator account using environment credentials:

```bash
npm run bootstrap:admin
```
*(Default: `admin@collabflow.dev` / configured `ADMIN_BOOTSTRAP_PASSWORD`)*

### Populate Development Seed Data
Populate demo workspaces, projects, tasks, sprints, and chat messages:

```bash
npm run seed
```

#### Pre-Configured Demo Credentials:
| Role | Email | Password |
|---|---|---|
| **Global Admin** | `admin@collabflow.dev` | `Password123!` |
| **Project Manager** | `alex.pm@collabflow.dev` | `Password123!` |
| **Team Member** | `sarah.dev@collabflow.dev` | `Password123!` |
| **Team Member** | `david.dev@collabflow.dev` | `Password123!` |
| **Viewer** | `olivia.view@collabflow.dev` | `Password123!` |

*(Tip: On the `/login` page, you can use the 1-click quick login buttons to switch between roles instantly).*

---

## 💻 Running the Application

### Start Full Application (Client + Server concurrently)
```bash
npm run dev
```
- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)
- Health Check: [http://localhost:5000/health](http://localhost:5000/health)

---

## 🧪 Automated Testing

### Run Backend Tests (16 Suites)
Tests cover registration, login, cookie sessions, RBAC, organization boundaries, project isolation, and task Kanban operations:

```bash
npm run test:server
```

### Run Frontend Tests
Tests cover landing page, authentication forms, and password strength validation:

```bash
npm run test:client
```

### Production Build
```bash
npm run build
```

---

## 📖 Detailed Documentation

- [REST API Reference](docs/API.md) — Comprehensive endpoints and request/response specifications.
- [Socket.IO Events](docs/SOCKET_EVENTS.md) — Real-time event protocol and room architecture.
- [System Architecture](docs/ARCHITECTURE.md) — Technical diagrams, security specifications, and RBAC matrix.

---

## ☁️ Deployment Guide

### Database (MongoDB Atlas)
1. Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a database user and whitelist network access (`0.0.0.0/0` or cloud provider IP).
3. Set `MONGODB_URI` in server environment variables.

### Backend (Render / Railway)
1. Connect repository to Render Web Service.
2. Set Root Directory to `server`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configure Environment Variables:
   - `NODE_ENV=production`
   - `PORT=10000`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `MONGODB_URI=mongodb+srv://...`
   - `JWT_ACCESS_SECRET=...` (minimum 32 random characters)
   - `JWT_REFRESH_SECRET=...` (minimum 32 random characters)
   - `COOKIE_SECURE=true`

### Frontend (Vercel)
1. Connect repository to [Vercel](https://vercel.com).
2. Set Root Directory to `client`.
3. Framework Preset: `Vite`.
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Set Environment Variables:
   - `VITE_API_BASE_URL=https://your-backend.onrender.com/api/v1`

---

## 🔒 Security Hardening

- **HTTP-Only Cookies**: Prevents client-side script access to session tokens.
- **CSRF & SameSite**: Cookies set with `SameSite=Lax` and HTTPS flag in production.
- **NoSQL Injection Defense**: Input validation and Mongoose schema typing.
- **Formula Injection Mitigation**: Exported CSV text beginning with `=`, `+`, `-`, `@`, `\t` is escaped.
- **Rate Limiting**: Protects authentication endpoints from credential-stuffing attacks.
- **Path Traversal Shield**: Uploaded files use cryptographic server-side filenames with directory validation.

---

## 📄 License
MIT License. Built for high-velocity teams.
