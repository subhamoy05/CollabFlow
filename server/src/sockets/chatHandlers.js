export function registerChatHandlers(io, socket) {
  socket.on('chat:typing:start', ({ projectId }) => {
    if (projectId) {
      socket.to(`project:${projectId}`).emit('chat:typing', {
        projectId,
        user: {
          id: socket.user._id,
          name: socket.user.name,
          avatarUrl: socket.user.avatarUrl
        },
        isTyping: true
      });
    }
  });

  socket.on('chat:typing:stop', ({ projectId }) => {
    if (projectId) {
      socket.to(`project:${projectId}`).emit('chat:typing', {
        projectId,
        user: {
          id: socket.user._id,
          name: socket.user.name
        },
        isTyping: false
      });
    }
  });
}
