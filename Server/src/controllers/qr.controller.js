const QRCodeService = require('../services/qrcode.service');
const Visitor = require('../models/visitor.model');
const EmailService = require('../services/email.service');
const NotificationService = require('../services/notification.service');

const qrController = {
  // Generate initial QR code for visitor and send via email
  generateVisitorQR: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.visitorId);

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      // Generate check-in QR code
      const qrCode = await QRCodeService.generateVisitorQR(visitor, 'check-in');

      // Update visitor with QR code data
      visitor.qrCode = qrCode.encryptedPayload;
      visitor.qrCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours validity
      await visitor.save();

      // Send QR code via email
      await EmailService.sendQRCodeEmail(visitor, qrCode.qrCodeImage, 'check-in');

      // Send real-time notification
      NotificationService.notifyQRCodeGenerated(visitor, 'check-in');

      res.json({
        status: 'success',
        message: 'QR code generated and sent to visitor\'s email',
        data: {
          qrCode: qrCode.qrCodeImage,
          validUntil: visitor.qrCodeExpiry
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Generate check-out QR code after successful check-in
  generateCheckOutQR: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.visitorId);

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      if (visitor.status !== 'checked-in') {
        return res.status(400).json({
          status: 'error',
          message: 'Visitor must be checked in to generate check-out QR code'
        });
      }

      // Generate check-out QR code
      const qrCode = await QRCodeService.generateCheckOutQR(visitor);

      // Update visitor with check-out QR code data
      visitor.checkOutQRCode = qrCode.encryptedPayload;
      visitor.checkOutQRExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours validity
      await visitor.save();

      // Send check-out QR code via email
      await EmailService.sendQRCodeEmail(visitor, qrCode.qrCodeImage, 'check-out');

      // Send real-time notification
      NotificationService.notifyQRCodeGenerated(visitor, 'check-out');

      res.json({
        status: 'success',
        message: 'Check-out QR code generated and sent to visitor\'s email',
        data: {
          qrCode: qrCode.qrCodeImage,
          validUntil: visitor.checkOutQRExpiry
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Validate QR code
  validateQR: async (req, res) => {
    try {
      const { qrData } = req.body;

      const payload = await QRCodeService.validateQRCode(qrData);

      if (payload.type === 'visitor') {
        const visitor = await Visitor.findById(payload.visitorId)
          .populate('host', 'firstName lastName email')
          .populate('department', 'name code');

        if (!visitor) {
          return res.status(404).json({
            status: 'error',
            message: 'Visitor not found'
          });
        }

        // Check if QR code type matches visitor status
        if (payload.qrType === 'check-in' && visitor.status === 'checked-in') {
          // Send real-time notification for invalid check-in attempt
          NotificationService.notifyQRCodeValidation(visitor, false);
          return res.status(400).json({
            status: 'error',
            message: 'Visitor is already checked in'
          });
        }

        if (payload.qrType === 'check-out' && visitor.status !== 'checked-in') {
          // Send real-time notification for invalid check-out attempt
          NotificationService.notifyQRCodeValidation(visitor, false);
          return res.status(400).json({
            status: 'error',
            message: 'Visitor is not checked in'
          });
        }

        // Send real-time notification for successful validation
        NotificationService.notifyQRCodeValidation(visitor, true);

        res.json({
          status: 'success',
          data: {
            type: 'visitor',
            qrType: payload.qrType,
            visitor,
            validUntil: payload.validUntil
          }
        });
      } else {
        // Handle temporary access QR codes
        res.json({
          status: 'success',
          data: {
            type: 'temporary',
            accessType: payload.accessType,
            location: payload.location,
            validUntil: payload.validUntil
          }
        });
      }
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Generate temporary QR code
  generateTemporaryQR: async (req, res) => {
    try {
      const { type, location, duration } = req.body;

      const qrCode = await QRCodeService.generateTemporaryQR({
        type,
        location,
        duration
      });

      res.json({
        status: 'success',
        data: {
          qrCode: qrCode.qrCodeImage,
          validUntil: qrCode.validUntil
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Refresh visitor QR code
  refreshVisitorQR: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.visitorId);

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      // Check if visitor is checked in
      if (visitor.status !== 'checked-in') {
        return res.status(400).json({
          status: 'error',
          message: 'Only checked-in visitors can refresh their QR code'
        });
      }

      const qrCode = await QRCodeService.generateVisitorQR(visitor);

      // Update visitor with new QR code data
      visitor.qrCode = qrCode.encryptedPayload;
      visitor.qrCodeExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours validity
      await visitor.save();

      // Send refresh notification email
      await EmailService.sendQRCodeRefreshEmail(visitor, qrCode.qrCodeImage);

      res.json({
        status: 'success',
        message: 'QR code refreshed and sent to visitor\'s email',
        data: {
          qrCode: qrCode.qrCodeImage,
          validUntil: visitor.qrCodeExpiry
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = qrController; 