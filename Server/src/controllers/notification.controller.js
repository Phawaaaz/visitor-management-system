const NotificationService = require('../services/notification.service');

const notificationController = {
  // Get unread notifications for the current user
  getUnreadNotifications: async (req, res) => {
    try {
      const notifications = await NotificationService.getUnreadNotifications(req.user._id);
      res.json({
        status: 'success',
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Mark a notification as read
  markAsRead: async (req, res) => {
    try {
      const notification = await NotificationService.markAsRead(
        req.params.notificationId,
        req.user._id
      );

      if (!notification) {
        return res.status(404).json({
          status: 'error',
          message: 'Notification not found'
        });
      }

      res.json({
        status: 'success',
        data: notification
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Mark all notifications as read
  markAllAsRead: async (req, res) => {
    try {
      await NotificationService.markAllAsRead(req.user._id);
      res.json({
        status: 'success',
        message: 'All notifications marked as read'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = notificationController; 