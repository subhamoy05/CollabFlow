const onlineUsers = new Map(); // userId -> Set of socketIds
const projectPresence = new Map(); // projectId -> Set of userIds

export function registerPresenceHandlers(io, socket) {
  const userId = socket.user._id.toString();

  // Add socket to user's set
  if (!onlineUsers.has(userId)) {
    onlineUsers.set(userId, new Set());
  }
  onlineUsers.get(userId).add(socket.id);

  // Broadcast user online status
  io.emit('user:online', { userId, user: socket.user });

  socket.on('disconnect', () => {
    const userSockets = onlineUsers.get(userId);
    if (userSockets) {
      userSockets.delete(socket.id);
      if (userSockets.size === 0) {
        onlineUsers.delete(userId);
        io.emit('user:offline', { userId });
      }
    }

    // Clean up project presence
    for (const [projectId, userSet] of projectPresence.entries()) {
      if (userSet.has(userId)) {
        userSet.delete(userId);
        io.to(`project:${projectId}`).emit('project:presence', {
          projectId,
          onlineUsers: Array.from(userSet)
        });
      }
    }
  });
}

export function addProjectPresence(io, projectId, userId) {
  if (!projectPresence.has(projectId)) {
    projectPresence.set(projectId, new Set());
  }
  projectPresence.get(projectId).add(userId);
  io.to(`project:${projectId}`).emit('project:presence', {
    projectId,
    onlineUsers: Array.from(projectPresence.get(projectId))
  });
}

export function removeProjectPresence(io, projectId, userId) {
  if (projectPresence.has(projectId)) {
    projectPresence.get(projectId).delete(userId);
    io.to(`project:${projectId}`).emit('project:presence', {
      projectId,
      onlineUsers: Array.from(projectPresence.get(projectId))
    });
  }
}
