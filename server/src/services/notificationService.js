import { Notification } from '../models/Notification.js';

let ioInstance = null;

export function setIoInstance(io) {
  ioInstance = io;
}

export async function createAndSendNotification({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  projectId = null,
  taskId = null,
  link = ''
}) {
  try {
    // If recipient is the sender (e.g. self-action), do not notify
    if (senderId && recipientId.toString() === senderId.toString()) {
      return null;
    }

    const notification = await Notification.create({
      recipient: recipientId,
      sender: senderId,
      type,
      title,
      message,
      project: projectId,
      task: taskId,
      link
    });

    const populated = await Notification.findById(notification._id)
      .populate('sender', 'name email avatarUrl')
      .populate('project', 'title key')
      .populate('task', 'title key');

    // Emit via socket to user's personal room
    if (ioInstance) {
      ioInstance.to(`user:${recipientId}`).emit('notification:new', populated);
    }

    return populated;
  } catch (err) {
    console.error('[NotificationService] Error creating notification:', err.message);
    return null;
  }
}
