const Department = require('../models/department.model');
const Host = require('../models/host.model');
const Visitor = require('../models/visitor.model');

const departmentController = {
  // Create new department
  createDepartment: async (req, res) => {
    try {
      const {
        name,
        code,
        description,
        head,
        location,
        accessLevel,
        visitorPolicy
      } = req.body;

      const department = new Department({
        name,
        code,
        description,
        head,
        location,
        accessLevel,
        visitorPolicy
      });

      await department.save();

      res.status(201).json({
        status: 'success',
        data: { department }
      });
    } catch (error) {
      res.status(400).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get all departments
  getAllDepartments: async (req, res) => {
    try {
      const departments = await Department.find()
        .populate('head', 'firstName lastName email')
        .sort({ name: 1 });

      res.json({
        status: 'success',
        data: { departments }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get department by ID
  getDepartmentById: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id)
        .populate('head', 'firstName lastName email');

      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found'
        });
      }

      res.json({
        status: 'success',
        data: { department }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Update department
  updateDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found'
        });
      }

      // Update allowed fields
      const allowedUpdates = [
        'name',
        'description',
        'head',
        'location',
        'accessLevel',
        'visitorPolicy',
        'isActive'
      ];

      allowedUpdates.forEach(update => {
        if (req.body[update] !== undefined) {
          department[update] = req.body[update];
        }
      });

      await department.save();

      res.json({
        status: 'success',
        data: { department }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Delete department
  deleteDepartment: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found'
        });
      }

      // Check if department has any hosts
      const hostsCount = await Host.countDocuments({ department: department._id });
      if (hostsCount > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete department with assigned hosts'
        });
      }

      // Check if department has any active visitors
      const activeVisitors = await Visitor.countDocuments({
        department: department._id,
        status: { $in: ['pending', 'checked-in'] }
      });

      if (activeVisitors > 0) {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot delete department with active visitors'
        });
      }

      await department.remove();

      res.json({
        status: 'success',
        message: 'Department deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  },

  // Get department hosts
  getDepartmentHosts: async (req, res) => {
    try {
      const hosts = await Host.find({ department: req.params.id })
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

  // Get department visitors
  getDepartmentVisitors: async (req, res) => {
    try {
      const visitors = await Visitor.find({ department: req.params.id })
        .populate('host', 'firstName lastName email')
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

  // Get department statistics
  getDepartmentStats: async (req, res) => {
    try {
      const department = await Department.findById(req.params.id);

      if (!department) {
        return res.status(404).json({
          status: 'error',
          message: 'Department not found'
        });
      }

      const stats = {
        totalHosts: await Host.countDocuments({ department: department._id }),
        activeHosts: await Host.countDocuments({ department: department._id, isActive: true }),
        totalVisitors: await Visitor.countDocuments({ department: department._id }),
        activeVisitors: await Visitor.countDocuments({
          department: department._id,
          status: { $in: ['pending', 'checked-in'] }
        })
      };

      res.json({
        status: 'success',
        data: { stats }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: error.message
      });
    }
  }
};

module.exports = departmentController; 