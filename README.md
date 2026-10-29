# CollabFlow — Real-Time Collaborative Project Management Platform

**Plan. Collaborate. Track. Complete.**

CollabFlow is a full-stack project management platform inspired by Linear, Trello, Jira, and Slack. It helps teams manage tasks, collaborate in real time, organize sprints, track deadlines, and analyze project performance.

## ✨ Key Features

- **Real-Time Kanban:** Drag-and-drop tasks with live synchronization using Socket.IO.
- **Role-Based Access Control:** Admin, Project Manager, Team Member, and Viewer roles.
- **Project Chat:** Messaging, typing indicators, online presence, and message management.
- **Notifications:** Instant updates for task assignments, comments, and invitations.
- **Calendar & Sprints:** Manage deadlines, milestones, sprint objectives, and progress.
- **Analytics & CSV Export:** Track completion rates, workloads, and project performance.
- **Secure File Attachments:** Validated uploads and permission-checked downloads.
- **Global Search:** Quickly find projects, tasks, and team members.
- **Dark & Light Themes:** Persistent theme preferences.
- **Flexible Database:** MongoDB Atlas, local MongoDB, or an optional in-memory development database.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite 6, Tailwind CSS, React Router |
| Backend | Node.js, Express.js, Socket.IO |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcryptjs, HTTP-only cookies |
| Validation & Security | Zod, Helmet, rate limiting |
| UI & Charts | Lucide React, Recharts, @hello-pangea/dnd |
| Testing | Node.js Test Runner, Supertest, Vitest, React Testing Library |

## 📁 Project Structure

```text
CollabFlow/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── routes/
│       └── services/
├── server/          # Express API and Socket.IO
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── sockets/
│   └── tests/
├── docs/            # API and architecture documentation
├── .env.example
└── package.json
```

## 🚀 Getting Started

**Prerequisites:** Node.js 20+, npm 10+, and MongoDB or the configured in-memory development database.

### 1. Install dependencies

```bash
npm install
npm --prefix server install
npm --prefix client install
```

### 2. Configure environment variables

Create `.env` from `.env.example` and configure:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://127.0.0.1:27017/collabflow
JWT_ACCESS_SECRET=your_32_character_or_longer_random_secret
JWT_REFRESH_SECRET=another_32_character_or_longer_random_secret
ADMIN_BOOTSTRAP_PASSWORD=your_strong_unique_password
```

Use unique secrets and strong passwords. Never commit `.env` to Git.

### 3. Run the application

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Health check: http://localhost:5000/health

### 4. Bootstrap and seed development data

```bash
npm run bootstrap:admin
npm run seed
```

Run seed scripts only in a development database. Never use predictable demo credentials in production.

## 🧪 Testing & Build

```bash
npm run test:server
npm run test:client
npm run build
```

## ☁️ Deployment

**Database:** MongoDB Atlas  
**Backend:** Render or Railway  
**Frontend:** Vercel

Configure production environment variables:

- `NODE_ENV=production`
- `MONGODB_URI`
- `CLIENT_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `COOKIE_SECURE=true`
- `VITE_API_BASE_URL=https://your-backend-domain/api/v1`

Set the frontend root directory to `client` and the backend root directory to `server`. Use `npm run build` for the frontend and `npm start` for the backend.

Restrict database network access wherever possible instead of allowing unrestricted access.

## 🔒 Security

- HTTP-only cookies and secure session handling.
- Server-side authentication, authorization, and role checks.
- Organization and project-level access isolation to prevent IDOR/BOLA.
- Input validation and NoSQL injection protection.
- Authentication rate limiting and secure password hashing.
- CSRF protection appropriate to the cookie configuration.
- Secure file uploads, storage, and authorized downloads.
- CSV formula-injection protection.
- Secrets managed through environment variables.
- Automated tests for authentication, permissions, and data isolation.

## 📚 Documentation

- `docs/API.md` — REST API reference.
- `docs/SOCKET_EVENTS.md` — Real-time event documentation.
- `docs/ARCHITECTURE.md` — System architecture and access-control design.


**CollabFlow — One workspace. Better teamwork.**
