import Notification from '../../model/notification/index.js';

export const notificationController = {
  createNotification: async (data, io) => {
    try {
      const notification = new Notification(data);
      const savedNotification = await notification.save();
      if (io && data.userId) {
        io.to(data.userId.toString()).emit('new_notification', {
          message: savedNotification.message,
          notificationId: savedNotification._id,
          type: savedNotification.type,
          createdAt: savedNotification.createdAt,
        });
        console.log('Emitting new notification:', savedNotification);
      }

      return savedNotification;
    } catch (error) {
      console.error('Error creating notification:', error.message);
      throw new Error('Failed to create notification.');
    }
  },

  getNotifications: async (io, req, res) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.find({ userId })
        .sort({ createdAt: -1 })
        .select('message isRead createdAt type listingId')

      res.status(200).json({
        message: 'Notifications fetched successfully.',
        notifications,
      });
    } catch (error) {
      console.error('Error fetching notifications:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  getUnreadNotifications: async (io, req, res) => {
    try {
      const userId = req.user.id;
      const notifications = await Notification.find({ userId, isRead: false })
        .sort({ createdAt: -1 });
        if (io) {
          io.to(userId.toString()).emit('get_unread_notifications', notifications);
          console.log('Emitting unread notifications to user:', notifications);
        }

      res.status(200).json({
        message: 'Unread notifications fetched successfully.',
        notifications,
      });
    } catch (error) {
      console.error('Error fetching unread notifications:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },

  markAsRead: async (io, req, res) => {
    try {
      const notificationId = req.params.notificationId;
      const notification = await Notification.findById(notificationId);

      if (!notification) {
        return res.status(404).json({ message: 'Notification not found.' });
      }

      notification.isRead = true;
      await notification.save();

      if (io) {
        io.to(notification.userId.toString()).emit('notification_updated', {
          message: 'Notification marked as read.',
          notification,
        });
        console.log('Emitting updated notification:', notification);
      }

      res.status(200).json({
        message: 'Notification marked as read successfully.',
        notification,
      });
    } catch (error) {
      console.error('Error marking notification as read:', error.message);
      res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
  },
};
