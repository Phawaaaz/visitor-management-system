const socketIO = require('socket.io');
const Notification = require('../models/notification.model');

class NotificationService {
  constructor() {
    this.io = null;
    this.connectedClients = new Map();
  }

  initialize(server) {
    this.io = socketIO(server, {
      cors: {
        origin: process.env.CLIENT_URL || '*',
        methods: ['GET', 'POST']
      }
    });

    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle user authentication
      socket.on('authenticate', (userId) => {
        this.connectedClients.set(userId, socket.id);
        console.log(`User ${userId} authenticated on socket ${socket.id}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        // Remove user from connected clients
        for (const [userId, socketId] of this.connectedClients.entries()) {
          if (socketId === socket.id) {
            this.connectedClients.delete(userId);
            console.log(`User ${userId} disconnected from socket ${socket.id}`);
            break;
          }
        }
      });
    });
  }

  // Emit to all connected clients
  broadcast(event, data) {
    if (this.io) {
      this.io.emit(event, data);
    }
  }

  // Emit to specific user
  emitToUser(userId, event, data) {
    if (this.io && this.connectedClients.has(userId)) {
      const socketId = this.connectedClients.get(userId);
      this.io.to(socketId).emit(event, data);
    }
  }

  // Emit to specific role
  emitToRole(role, event, data) {
    if (this.io) {
      this.io.to(`role:${role}`).emit(event, data);
    }
  }

  // Emit to specific department
  emitToDepartment(departmentId, event, data) {
    if (this.io) {
      this.io.to(`department:${departmentId}`).emit(event, data);
    }
  }

  // Helper method to create and save notification
  async createNotification(recipientId, type, title, message, data = {}, priority = 'low') {
    try {
      const notification = await Notification.create({
        recipient: recipientId,
        type,
        title,
        message,
        data,
        priority
      });

      // Emit to connected user if online
      this.emitToUser(recipientId, 'newNotification', notification);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  }

  // Notify about new visitor
  async notifyNewVisitor(visitor) {
    const notification = await this.createNotification(
      visitor.host,
      'newVisitor',
      'New Visitor Arrival',
      `${visitor.firstName} ${visitor.lastName} has arrived to visit you`,
      {
        visitorId: visitor._id,
        name: `${visitor.firstName} ${visitor.lastName}`,
        purpose: visitor.purpose,
        department: visitor.department,
        host: visitor.host,
        status: visitor.status
      },
      'medium'
    );

    this.broadcast('newVisitor', notification);
  }

  // Notify about visitor check-in
  async notifyVisitorCheckIn(visitor) {
    const notification = await this.createNotification(
      visitor.host,
      'visitorCheckIn',
      'Visitor Checked In',
      `${visitor.firstName} ${visitor.lastName} has checked in`,
      {
        visitorId: visitor._id,
        name: `${visitor.firstName} ${visitor.lastName}`,
        department: visitor.department,
        host: visitor.host,
        checkInTime: visitor.checkInTime
      }
    );

    this.broadcast('visitorCheckIn', notification);
  }

  // Notify about visitor check-out
  async notifyVisitorCheckOut(visitor) {
    const notification = await this.createNotification(
      visitor.host,
      'visitorCheckOut',
      'Visitor Checked Out',
      `${visitor.firstName} ${visitor.lastName} has checked out`,
      {
        visitorId: visitor._id,
        name: `${visitor.firstName} ${visitor.lastName}`,
        department: visitor.department,
        host: visitor.host,
        checkOutTime: visitor.checkOutTime
      }
    );

    this.broadcast('visitorCheckOut', notification);
  }

  // Notify about QR code generation
  async notifyQRCodeGenerated(visitor, qrType) {
    const notification = await this.createNotification(
      visitor.host,
      'qrCodeGenerated',
      'QR Code Generated',
      `New ${qrType} QR code generated for ${visitor.firstName} ${visitor.lastName}`,
      {
        visitorId: visitor._id,
        name: `${visitor.firstName} ${visitor.lastName}`,
        qrType: qrType
      }
    );

    this.emitToUser(visitor.host, 'qrCodeGenerated', notification);
  }

  // Notify about QR code validation
  async notifyQRCodeValidation(visitor, isValid) {
    const notification = await this.createNotification(
      visitor.host,
      'qrCodeValidation',
      'QR Code Validation',
      `${visitor.firstName} ${visitor.lastName}'s QR code validation ${isValid ? 'succeeded' : 'failed'}`,
      {
        visitorId: visitor._id,
        name: `${visitor.firstName} ${visitor.lastName}`,
        isValid: isValid
      },
      isValid ? 'low' : 'high'
    );

    this.emitToUser(visitor.host, 'qrCodeValidation', notification);
  }

  // Notify about security alerts
  async notifySecurityAlert(alert) {
    const notification = await this.createNotification(
      alert.recipientId,
      'securityAlert',
      'Security Alert',
      alert.message,
      {
        alert: alert
      },
      'high'
    );

    this.emitToRole('security', 'securityAlert', notification);
  }

  // Get unread notifications for a user
  async getUnreadNotifications(userId) {
    return Notification.find({ recipient: userId, read: false })
      .sort({ createdAt: -1 })
      .limit(50);
  }

  // Mark notification as read
  async markAsRead(notificationId, userId) {
    return Notification.findOneAndUpdate(
      { _id: notificationId, recipient: userId },
      { read: true },
      { new: true }
    );
  }

  // Mark all notifications as read for a user
  async markAllAsRead(userId) {
    return Notification.updateMany(
      { recipient: userId, read: false },
      { read: true }
    );
  }
}

module.exports = new NotificationService(); 