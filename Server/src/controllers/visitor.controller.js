const Visitor = require('../models/visitor.model');
const QRCode = require('qrcode');
const crypto = require('crypto');

const visitorController = {
  // Create new visitor
  createVisitor: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        company,
        purpose,
        host,
        department,
        documents
      } = req.body;

      // Generate unique QR code
      const qrData = crypto.randomBytes(32).toString('hex');
      const qrCode = await QRCode.toDataURL(qrData);

      const visitor = new Visitor({
        firstName,
        lastName,
        email,
        phone,
        company,
        purpose,
        host,
        department,
        documents,
        qrCode,
        qrCodeExpiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours validity
      });

      await visitor.save();

      res.status(201).json({
        status: 'success',
        data: {
          visitor: {
            id: visitor._id,
            firstName: visitor.firstName,
            lastName: visitor.lastName,
            email: visitor.email,
            qrCode: visitor.qrCode,
            qrCodeExpiry: visitor.qrCodeExpiry
          }
        }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get all visitors
  getAllVisitors: async (req, res) => {
    try {
      const visitors = await Visitor.find()
        .populate('host', 'firstName lastName email')
        .populate('department', 'name code')
        .sort({ createdAt: -1 });

      res.json({
        status: 'success',
        data: { visitors }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get visitor by ID
  getVisitorById: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.id)
        .populate('host', 'firstName lastName email')
        .populate('department', 'name code');

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      res.json({
        status: 'success',
        data: { visitor }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Update visitor status (check-in/check-out)
  updateVisitorStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const visitor = await Visitor.findById(req.params.id);

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      if (status === 'checked-in') {
        visitor.status = 'checked-in';
        visitor.checkInTime = new Date();
      } else if (status === 'checked-out') {
        visitor.status = 'checked-out';
        visitor.checkOutTime = new Date();
      }

      await visitor.save();

      res.json({
        status: 'success',
        data: { visitor }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Update visitor details
  updateVisitor: async (req, res) => {
    try {
      const visitor = await Visitor.findById(req.params.id);

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      // Update allowed fields
      const allowedUpdates = ['firstName', 'lastName', 'email', 'phone', 'company', 'purpose', 'notes'];
      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          visitor[update] = req.body[update];
        }
      });

      await visitor.save();

      res.json({
        status: 'success',
        data: { visitor }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Delete visitor
  deleteVisitor: async (req, res) => {
    try {
      const visitor = await Visitor.findByIdAndDelete(req.params.id);

      if (!visitor) {
        return res.status(404).json({
          status: 'error',
          message: 'Visitor not found'
        });
      }

      res.json({
        status: 'success',
        message: 'Visitor deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get visitors by status
  getVisitorsByStatus: async (req, res) => {
    try {
      const { status } = req.params;
      const visitors = await Visitor.find({ status })
        .populate('host', 'firstName lastName email')
        .populate('department', 'name code')
        .sort({ createdAt: -1 });

      res.json({
        status: 'success',
        data: { visitors }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = visitorController; 