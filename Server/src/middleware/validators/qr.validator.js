const { body, param } = require('express-validator');

const qrValidators = {
  validateQR: [
    body('qrData')
      .notEmpty()
      .withMessage('QR code data is required')
      .isString()
      .withMessage('QR code data must be a string')
  ],

  generateTemporaryQR: [
    body('type')
      .notEmpty()
      .withMessage('Access type is required')
      .isIn(['visitor', 'contractor', 'delivery', 'event'])
      .withMessage('Invalid access type'),

    body('location')
      .notEmpty()
      .withMessage('Location is required')
      .isObject()
      .withMessage('Location must be an object'),

    body('location.building')
      .notEmpty()
      .withMessage('Building is required')
      .isString()
      .withMessage('Building must be a string'),

    body('location.floor')
      .optional()
      .isString()
      .withMessage('Floor must be a string'),

    body('location.room')
      .optional()
      .isString()
      .withMessage('Room must be a string'),

    body('duration')
      .notEmpty()
      .withMessage('Duration is required')
      .isInt({ min: 15, max: 1440 })
      .withMessage('Duration must be between 15 minutes and 24 hours')
  ],

  visitorId: [
    param('visitorId')
      .isMongoId()
      .withMessage('Invalid visitor ID')
  ]
};

module.exports = qrValidators; 