import { Task } from '../models/Task.js';
import { Notification } from '../models/Notification.js';
import { TASK_STATUSES, NOTIFICATION_TYPES } from '../config/constants.js';
import { createAndSendNotification } from '../services/notificationService.js';

export async function runDeadlineReminderJob() {
  try {
    const now = new Date();
    const next24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find tasks due in next 24 hours that are not Done
    const tasksDueSoon = await Task.find({
      dueDate: { $gte: now, $lte: next24Hours },
      status: { $ne: TASK_STATUSES.DONE },
      assignee: { $ne: null }
    }).populate('project', 'title key');

    let notificationsSent = 0;

    for (const task of tasksDueSoon) {
      // Check if a reminder was already sent in the past 24 hours
      const existingReminder = await Notification.findOne({
        recipient: task.assignee,
        task: task._id,
        type: NOTIFICATION_TYPES.DEADLINE_REMINDER,
        createdAt: { $gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
      });

      if (!existingReminder) {
        await createAndSendNotification({
          recipientId: task.assignee,
          type: NOTIFICATION_TYPES.DEADLINE_REMINDER,
          title: 'Upcoming Task Deadline',
          message: `Reminder: Task "${task.key}: ${task.title}" is due soon (${new Date(task.dueDate).toLocaleDateString()})`,
          projectId: task.project?._id,
          taskId: task._id,
          link: `/app/projects/${task.project?._id}/board?task=${task._id}`
        });
        notificationsSent++;
      }
    }

    console.log(`[DeadlineReminderJob] Completed. Processed ${tasksDueSoon.length} tasks, sent ${notificationsSent} reminders.`);
    return { tasksProcessed: tasksDueSoon.length, notificationsSent };
  } catch (err) {
    console.error('[DeadlineReminderJob] Error executing reminder job:', err.message);
    throw err;
  }
}
