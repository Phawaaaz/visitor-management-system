const { body, param } = require('express-validator');

const visitorValidators = {
  create: [
    body('firstName')
      .trim()
      .notEmpty()
      .withMessage('First name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .trim()
      .notEmpty()
      .withMessage('Last name is required')
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
      .trim()
      .notEmpty()
      .withMessage('Email is required')
      .isEmail()
      .withMessage('Please enter a valid email'),
    
    body('phone')
      .trim()
      .notEmpty()
      .withMessage('Phone number is required')
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage('Please enter a valid phone number'),
    
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Company name must be less than 100 characters'),
    
    body('purpose')
      .trim()
      .notEmpty()
      .withMessage('Visit purpose is required')
      .isLength({ max: 500 })
      .withMessage('Purpose must be less than 500 characters'),
    
    body('host')
      .notEmpty()
      .withMessage('Host is required')
      .isMongoId()
      .withMessage('Invalid host ID'),
    
    body('department')
      .notEmpty()
      .withMessage('Department is required')
      .isMongoId()
      .withMessage('Invalid department ID')
  ],

  updateStatus: [
    param('id')
      .isMongoId()
      .withMessage('Invalid visitor ID'),
    
    body('status')
      .isIn(['checked-in', 'checked-out'])
      .withMessage('Invalid status')
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid visitor ID'),
    
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('First name must be between 2 and 50 characters'),
    
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('Last name must be between 2 and 50 characters'),
    
    body('email')
      .optional()
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email'),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^\+?[\d\s-()]+$/)
      .withMessage('Please enter a valid phone number'),
    
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Company name must be less than 100 characters'),
    
    body('purpose')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Purpose must be less than 500 characters'),
    
    body('notes')
      .optional()
      .trim()
      .isLength({ max: 1000 })
      .withMessage('Notes must be less than 1000 characters')
  ]
};

module.exports = visitorValidators; 