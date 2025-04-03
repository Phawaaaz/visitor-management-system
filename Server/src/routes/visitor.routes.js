const express = require('express');
const router = express.Router();
const visitorController = require('../controllers/visitor.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const visitorValidators = require('../middleware/validators/visitor.validator');

// All routes require authentication
router.use(auth);

// Create new visitor (receptionist and admin only)
router.post(
  '/',
  checkRole('receptionist', 'admin'),
  visitorValidators.create,
  validate,
  visitorController.createVisitor
);

// Get all visitors (security and admin only)
router.get(
  '/',
  checkRole('security', 'admin'),
  visitorController.getAllVisitors
);

// Get visitor by ID
router.get(
  '/:id',
  visitorController.getVisitorById
);

// Update visitor status (security and admin only)
router.patch(
  '/:id/status',
  checkRole('security', 'admin'),
  visitorValidators.updateStatus,
  validate,
  visitorController.updateVisitorStatus
);

// Update visitor details (receptionist and admin only)
router.patch(
  '/:id',
  checkRole('receptionist', 'admin'),
  visitorValidators.update,
  validate,
  visitorController.updateVisitor
);

// Delete visitor (admin only)
router.delete(
  '/:id',
  checkRole('admin'),
  visitorController.deleteVisitor
);

// Get visitors by status (security and admin only)
router.get(
  '/status/:status',
  checkRole('security', 'admin'),
  visitorController.getVisitorsByStatus
);

module.exports = router; 