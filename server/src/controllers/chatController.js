import { ChatMessage } from '../models/ChatMessage.js';
import { Project } from '../models/Project.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

let ioInstance = null;
export function setChatIoInstance(io) {
  ioInstance = io;
}

export async function getProjectMessages(req, res, next) {
  try {
    const { projectId } = req.params;
    const { limit = 50, before } = req.query;

    const query = { project: projectId, isDeleted: false };
    if (before) {
      query.createdAt = { $lt: new Date(before) };
    }

    const messages = await ChatMessage.find(query)
      .populate('sender', 'name email avatarUrl role')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name' }
      })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit, 10));

    // Return in chronological order for chat UI
    messages.reverse();

    return successResponse(res, messages);
  } catch (err) {
    next(err);
  }
}

export async function sendMessage(req, res, next) {
  try {
    const { projectId } = req.params;
    const { content, replyTo, attachments } = req.body;

    if (!content || !content.trim()) {
      return errorResponse(res, 'Message content cannot be empty', 400);
    }

    const message = await ChatMessage.create({
      project: projectId,
      sender: req.user._id,
      content: content.trim(),
      replyTo: replyTo || null,
      attachments: attachments || []
    });

    const populated = await ChatMessage.findById(message._id)
      .populate('sender', 'name email avatarUrl role')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name' }
      });

    // Real-time delivery to project room
    if (ioInstance) {
      ioInstance.to(`project:${projectId}`).emit('chat:message', populated);
    }

    return successResponse(res, populated, 'Message sent', 201);
  } catch (err) {
    next(err);
  }
}

export async function editMessage(req, res, next) {
  try {
    const { messageId } = req.params;
    const { content } = req.body;

    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }

    if (message.sender.toString() !== req.user._id.toString()) {
      return errorResponse(res, 'You can only edit your own messages', 403);
    }

    message.content = content.trim();
    message.isEdited = true;
    await message.save();

    const populated = await ChatMessage.findById(message._id)
      .populate('sender', 'name email avatarUrl role')
      .populate({
        path: 'replyTo',
        populate: { path: 'sender', select: 'name' }
      });

    if (ioInstance) {
      ioInstance.to(`project:${message.project}`).emit('chat:edited', populated);
    }

    return successResponse(res, populated, 'Message edited');
  } catch (err) {
    next(err);
  }
}

export async function deleteMessage(req, res, next) {
  try {
    const { messageId } = req.params;

    const message = await ChatMessage.findById(messageId);
    if (!message) {
      return errorResponse(res, 'Message not found', 404);
    }

    // Only message sender, PM or Admin can delete
    const isSender = message.sender.toString() === req.user._id.toString();
    const isPm = req.projectRole === 'Project Manager';
    const isAdmin = req.user.role === 'Admin';

    if (!isSender && !isPm && !isAdmin) {
      return errorResponse(res, 'You do not have permission to delete this message', 403);
    }

    message.isDeleted = true;
    message.content = '[Message deleted]';
    await message.save();

    if (ioInstance) {
      ioInstance.to(`project:${message.project}`).emit('chat:deleted', {
        messageId: message._id,
        projectId: message.project
      });
    }

    return successResponse(res, { messageId: message._id }, 'Message deleted');
  } catch (err) {
    next(err);
  }
}
