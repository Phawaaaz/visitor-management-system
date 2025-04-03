const express = require('express');
const router = express.Router();
const hostController = require('../controllers/host.controller');
const { auth, checkRole } = require('../middleware/auth.middleware');
const validate = require('../middleware/validate.middleware');
const hostValidators = require('../middleware/validators/host.validator');

// All routes require authentication
router.use(auth);

// Create new host (admin only)
router.post(
  '/',
  checkRole('admin'),
  hostValidators.create,
  validate,
  hostController.createHost
);

// Get all hosts
router.get(
  '/',
  hostController.getAllHosts
);

// Get host by ID
router.get(
  '/:id',
  hostController.getHostById
);

// Update host details (admin only)
router.patch(
  '/:id',
  checkRole('admin'),
  hostValidators.update,
  validate,
  hostController.updateHost
);

// Delete host (admin only)
router.delete(
  '/:id',
  checkRole('admin'),
  hostController.deleteHost
);

// Get host's visitors
router.get(
  '/:id/visitors',
  hostController.getHostVisitors
);

// Get host's active visitors
router.get(
  '/:id/active-visitors',
  hostController.getHostActiveVisitors
);

module.exports = router; 