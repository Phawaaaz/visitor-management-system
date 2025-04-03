const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/department.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const departmentValidators = require('../middleware/validators/department.validator');

// All routes require authentication
router.use(auth);

// Create new department (admin only)
router.post(
  '/',
  checkRole('admin'),
  departmentValidators.create,
  validate,
  departmentController.createDepartment
);

// Get all departments
router.get(
  '/',
  departmentController.getAllDepartments
);

// Get department by ID
router.get(
  '/:id',
  departmentController.getDepartmentById
);

// Update department (admin only)
router.patch(
  '/:id',
  checkRole('admin'),
  departmentValidators.update,
  validate,
  departmentController.updateDepartment
);

// Delete department (admin only)
router.delete(
  '/:id',
  checkRole('admin'),
  departmentController.deleteDepartment
);

// Get department hosts
router.get(
  '/:id/hosts',
  departmentController.getDepartmentHosts
);

// Get department visitors
router.get(
  '/:id/visitors',
  departmentController.getDepartmentVisitors
);

// Get department statistics
router.get(
  '/:id/stats',
  departmentController.getDepartmentStats
);

module.exports = router; 