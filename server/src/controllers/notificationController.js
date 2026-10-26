import { Notification } from '../models/Notification.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

export async function getNotifications(req, res, next) {
  try {
    const { page = 1, limit = 30 } = req.query;
    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const query = { recipient: req.user._id };

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    const notifications = await Notification.find(query)
      .populate('sender', 'name email avatarUrl')
      .populate('project', 'title key')
      .populate('task', 'title key')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit, 10));

    return successResponse(res, {
      notifications,
      unreadCount
    }, 'Notifications retrieved', 200, {
      total,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10)
    });
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req, res, next) {
  try {
    const { notificationId } = req.params;
    const notification = await Notification.findOne({
      _id: notificationId,
      recipient: req.user._id
    });

    if (!notification) {
      return errorResponse(res, 'Notification not found', 404);
    }

    notification.isRead = true;
    notification.readAt = new Date();
    await notification.save();

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });

    return successResponse(res, { notification, unreadCount }, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req, res, next) {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return successResponse(res, { unreadCount: 0 }, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}

export async function deleteNotification(req, res, next) {
  try {
    const { notificationId } = req.params;
    await Notification.deleteOne({
      _id: notificationId,
      recipient: req.user._id
    });

    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    return successResponse(res, { unreadCount }, 'Notification deleted');
  } catch (err) {
    next(err);
  }
}
