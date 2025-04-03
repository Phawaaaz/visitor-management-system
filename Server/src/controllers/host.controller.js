const Host = require('../models/host.model');
const Visitor = require('../models/visitor.model');

const hostController = {
  // Create new host
  createHost: async (req, res) => {
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        department,
        position,
        employeeId,
        maxVisitorsPerDay,
        accessLevel,
        notifications
      } = req.body;

      const host = new Host({
        firstName,
        lastName,
        email,
        phone,
        department,
        position,
        employeeId,
        maxVisitorsPerDay,
        accessLevel,
        notifications
      });

      await host.save();

      res.status(201).json({
        status: 'success',
        data: { host }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get all hosts
  getAllHosts: async (req, res) => {
    try {
      const hosts = await Host.find()
        .populate('department', 'name code')
        .sort({ firstName: 1 });

      res.json({
        status: 'success',
        data: { hosts }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get host by ID
  getHostById: async (req, res) => {
    try {
      const host = await Host.findById(req.params.id)
        .populate('department', 'name code');

      if (!host) {
        return res.status(404).json({
          status: 'error',
          message: 'Host not found'
        });
      }

      res.json({
        status: 'success',
        data: { host }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Update host details
  updateHost: async (req, res) => {
    try {
      const host = await Host.findById(req.params.id);

      if (!host) {
        return res.status(404).json({
          status: 'error',
          message: 'Host not found'
        });
      }

      // Update allowed fields
      const allowedUpdates = [
        'firstName',
        'lastName',
        'email',
        'phone',
        'position',
        'maxVisitorsPerDay',
        'accessLevel',
        'notifications',
        'isActive'
      ];

      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          host[update] = req.body[update];
        }
      });

      await host.save();

      res.json({
        status: 'success',
        data: { host }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Delete host
  deleteHost: async (req, res) => {
    try {
      const host = await Host.findById(req.params.id);

      if (!host) {
        return res.status(404).json({
          status: 'error',
          message: 'Host not found'
        });
      }

      // Check if host has any active visitors
      const activeVisitors = await Visitor.find({
        host: host._id,
        status: { $in: ['pending', 'checked-in'] }
      });

      if (activeVisitors.length > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete host with active visitors'
        });
      }

      await host.remove();

      res.json({
        status: 'success',
        message: 'Host deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get host's visitors
  getHostVisitors: async (req, res) => {
    try {
      const visitors = await Visitor.find({ host: req.params.id })
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

  // Get host's active visitors
  getHostActiveVisitors: async (req, res) => {
    try {
      const visitors = await Visitor.find({
        host: req.params.id,
        status: { $in: ['pending', 'checked-in'] }
      })
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

module.exports = hostController; 