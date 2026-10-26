# CollabFlow Socket.IO Architecture & Event Protocol

CollabFlow uses real-time WebSockets powered by **Socket.IO** with authenticated handshakes and server-managed rooms.

---

## 1. Connection & Authentication Handshake

Sockets authenticate during handshake using either:
1. HTTP-Only Cookie: `cf_access_token`
2. Handshake Auth object: `{ auth: { token: "<JWT_ACCESS_TOKEN>" } }`
3. Authorization header: `Bearer <JWT_ACCESS_TOKEN>`

When authenticated, the socket connection automatically joins the user's personal notification room:
```
Room: user:<userId>
```

---

## 2. Server-Managed Rooms

| Room Pattern | Access Verification | Usage |
|---|---|---|
| `user:<userId>` | Handshake user verification | Targeted in-app notifications |
| `project:<projectId>` | Project membership or Admin check | Real-time Kanban board updates, project chat messages, presence |

---

## 3. Client-to-Server Events

### `project:join`
Joins a project channel after the server verifies project membership.
- **Payload**:
  ```json
  { "projectId": "65db8...4f" }
  ```
- **Acknowledgement**:
  ```json
  { "success": true, "room": "project:65db8...4f" }
  ```

### `project:leave`
Leaves the active project room and clears user presence.
- **Payload**:
  ```json
  { "projectId": "65db8...4f" }
  ```

### `chat:typing:start` / `chat:typing:stop`
Temporary ephemeral events indicating that the user is composing a message in the channel.
- **Payload**:
  ```json
  { "projectId": "65db8...4f" }
  ```

---

## 4. Server-to-Client Broadcast Events

### `task:created`
Dispatched to `project:<projectId>` when a new task is created.
- **Payload**: Populated `Task` document.

### `task:updated`
Dispatched to `project:<projectId>` when task properties (title, priority, assignee, etc.) are modified.
- **Payload**: Populated `Task` document.

### `task:moved`
Dispatched to `project:<projectId>` on Kanban column or order changes.
- **Payload**:
  ```json
  {
    "taskId": "65db...",
    "status": "In Progress",
    "order": 1,
    "task": { ... }
  }
  ```

### `task:deleted`
Dispatched to `project:<projectId>` when a task is removed.
- **Payload**:
  ```json
  {
    "taskId": "65db...",
    "projectId": "65db..."
  }
  ```

### `task:comment:created`
Dispatched to `project:<projectId>` when a comment is added to a task thread.
- **Payload**:
  ```json
  {
    "taskId": "65db...",
    "comment": { ... }
  }
  ```

### `chat:message`
Dispatched to `project:<projectId>` when a new chat message arrives.
- **Payload**: Populated `ChatMessage` document with sender avatar and reply quotes.

### `chat:edited` / `chat:deleted`
Dispatched to `project:<projectId>` when a message is updated or deleted.

### `chat:typing`
Dispatched to `project:<projectId>` when a collaborator begins or stops typing.
- **Payload**:
  ```json
  {
    "projectId": "65db...",
    "user": { "id": "...", "name": "Sarah Chen" },
    "isTyping": true
  }
  ```

### `project:presence`
Broadcasted to `project:<projectId>` when collaborators join or leave the project room.
- **Payload**:
  ```json
  {
    "projectId": "65db...",
    "onlineUsers": ["65db...", "65dc..."]
  }
  ```

### `notification:new`
Dispatched to `user:<recipientId>` personal room when assigned a task, mentioned in a comment, or receiving an invitation.
- **Payload**: Populated `Notification` document.
