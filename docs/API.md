# CollabFlow REST API Documentation

Base URL: `/api/v1`  
All responses follow the unified JSON structure:

```json
{
  "success": true,
  "message": "Human readable status",
  "data": { ... },
  "meta": { "total": 100, "page": 1, "limit": 20 }
}
```

---

## 1. Authentication (`/api/v1/auth`)

### POST `/api/v1/auth/register`
Creates a standard user account with default role `Team Member` and automatically provisions a personal workspace.
- **Request Body**:
  ```json
  {
    "name": "Alex Johnson",
    "email": "alex@company.com",
    "password": "Password123!",
    "confirmPassword": "Password123!"
  }
  ```
- **Responses**:
  - `201 Created`: Returns user object and access token; sets HTTP-only cookies `cf_access_token` and `cf_refresh_token`.
  - `409 Conflict`: Email already registered.
  - `422 Unprocessable Entity`: Password fails validation checks (min 8 chars, 1 uppercase, 1 lowercase, 1 number).

### POST `/api/v1/auth/login`
Authenticates a user and establishes a session.
- **Request Body**:
  ```json
  {
    "email": "alex@company.com",
    "password": "Password123!"
  }
  ```
- **Responses**:
  - `200 OK`: Returns user profile, workspaces, and accessToken; sets HTTP-only cookies.
  - `401 Unauthorized`: Invalid credentials.
  - `403 Forbidden`: Account suspended.

### POST `/api/v1/auth/logout`
Revokes active refresh session and clears authentication cookies.

### POST `/api/v1/auth/refresh`
Refreshes an expiring access token using the HTTP-only refresh token.

### GET `/api/v1/auth/me`
Retrieves current authenticated user profile and associated organizations.

### POST `/api/v1/auth/forgot-password`
Dispatches a single-use expiring password reset token (SHA-256 hashed in database).

### POST `/api/v1/auth/reset-password`
Validates reset token and sets new password.

---

## 2. Workspaces / Organizations (`/api/v1/organizations`)

- `GET /api/v1/organizations`: List workspaces the authenticated user belongs to.
- `POST /api/v1/organizations`: Create a new workspace.
- `GET /api/v1/organizations/:id`: Retrieve workspace details.
- `PATCH /api/v1/organizations/:id`: Update workspace settings (Owner/Admin only).
- `GET /api/v1/organizations/:id/members`: List members and pending invitations.
- `POST /api/v1/organizations/:id/invitations`: Invite a collaborator by email.
- `POST /api/v1/organizations/invitations/accept`: Accept invitation via token.
- `DELETE /api/v1/organizations/:id/members/:userId`: Remove workspace member.

---

## 3. Projects (`/api/v1/projects`)

- `GET /api/v1/projects`: List accessible projects. Filters: `organizationId`, `status`, `search`. Includes calculated task counts and progress percentages.
- `POST /api/v1/projects`: Create project. Auto-assigns creator as Project Manager.
- `GET /api/v1/projects/:id`: Get project with live task completion metrics.
- `PATCH /api/v1/projects/:id`: Update project details (Project Manager or Admin only).
- `POST /api/v1/projects/:id/archive`: Archive project.
- `POST /api/v1/projects/:id/restore`: Restore archived project.
- `GET /api/v1/projects/:id/members`: List project members and assigned roles.
- `POST /api/v1/projects/:id/members`: Add member to project (`Project Manager`, `Team Member`, or `Viewer`).
- `DELETE /api/v1/projects/:id/members/:userId`: Remove member from project.
- `GET /api/v1/projects/:id/activity`: View project activity logs.

---

## 4. Tasks & Kanban (`/api/v1/tasks`)

- `GET /api/v1/tasks`: List tasks. Supports filters: `projectId`, `assignee` (`me`, `unassigned`, or ID), `status`, `priority`, `sprint`, `search`.
- `POST /api/v1/tasks`: Create task. Automatically calculates sequential key (e.g. `CF-14`) and column order. Emits `task:created` via Socket.IO.
- `GET /api/v1/tasks/:id`: Get task details with populated subtasks, checklists, comments, and attachments.
- `PATCH /api/v1/tasks/:id`: Update task attributes. Emits `task:updated`.
- `PATCH /api/v1/tasks/:id/move`: Update status and column index for Kanban drag-and-drop. Emits `task:moved`.
- `DELETE /api/v1/tasks/:id`: Delete task and sub-records. Emits `task:deleted`.
- `GET /api/v1/tasks/:id/comments`: List task comments.
- `POST /api/v1/tasks/:id/comments`: Add comment and notify assignee/creator. Emits `task:comment:created`.
- `POST /api/v1/tasks/:id/checklist`: Add checklist item.
- `PATCH /api/v1/tasks/:id/checklist/:itemId/toggle`: Toggle checklist item state.
- `DELETE /api/v1/tasks/:id/checklist/:itemId`: Remove checklist item.

---

## 5. Project Chat (`/api/v1/chat`)

- `GET /api/v1/chat/:projectId/messages`: Retrieve paginated messages for project room.
- `POST /api/v1/chat/:projectId/messages`: Send message with optional reply quote and attachments. Emits `chat:message`.
- `PATCH /api/v1/chat/messages/:id`: Edit message content (author only). Emits `chat:edited`.
- `DELETE /api/v1/chat/messages/:id`: Delete message (author, PM, or Admin). Emits `chat:deleted`.

---

## 6. Notifications (`/api/v1/notifications`)

- `GET /api/v1/notifications`: List notifications for current user with unread count.
- `PATCH /api/v1/notifications/:id/read`: Mark notification as read.
- `PATCH /api/v1/notifications/read-all`: Mark all notifications as read.
- `DELETE /api/v1/notifications/:id`: Delete notification.

---

## 7. Calendar (`/api/v1/calendar`)

- `GET /api/v1/calendar/events`: Retrieve tasks with due dates and project milestones within date ranges.

---

## 8. Sprints (`/api/v1/sprints`)

- `GET /api/v1/sprints?projectId=...`: List project sprints with task progress and effort completion.
- `POST /api/v1/sprints`: Create sprint with dates and goals.
- `PATCH /api/v1/sprints/:id`: Update sprint.
- `POST /api/v1/sprints/:id/start`: Start sprint (enforces single active sprint per project).
- `POST /api/v1/sprints/:id/complete`: Complete sprint and set completion timestamp.

---

## 9. Reports & Exports (`/api/v1/reports`)

- `GET /api/v1/reports/overview`: Aggregated completion rates, status counts, priority counts, and member workloads.
- `GET /api/v1/reports/projects/:id`: Project-specific analytics.
- `GET /api/v1/reports/export.csv`: Download CSV export with spreadsheet formula injection prevention (`sanitizeCsvValue`).

---

## 10. File Management (`/api/v1/files`)

- `POST /api/v1/files/upload`: Multipart upload with MIME validation and safe disk name generation.
- `GET /api/v1/files/:id/download`: Authorized file download streaming (verifies project membership).
- `DELETE /api/v1/files/:id`: Remove file attachment.

---

## 11. Global Search (`/api/v1/search`)

- `GET /api/v1/search?q=...`: Search across authorized projects, tasks, and team members with debounced query matching.

---

## 12. Administration Console (`/api/v1/admin`)
*Restricted to Global Administrator role.*

- `GET /api/v1/admin/overview`: System-wide statistics and metrics.
- `GET /api/v1/admin/users`: User management with filtering and pagination.
- `PATCH /api/v1/admin/users/:id/status`: Suspend or activate user account.
- `PATCH /api/v1/admin/users/:id/role`: Change role (with protection against demoting last admin).
- `GET /api/v1/admin/projects`: Global project registry.
- `GET /api/v1/admin/organizations`: Organization directory.
- `GET /api/v1/admin/audit-logs`: Audit logs with actor, action, and target entity metadata.
- `GET /api/v1/admin/settings`: View platform system settings.
- `PATCH /api/v1/admin/settings`: Update safe platform configuration.
