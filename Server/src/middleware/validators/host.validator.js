const { body, param } = require('express-validator');

const hostValidators = {
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
    
    body('department')
      .notEmpty()
      .withMessage('Department is required')
      .isMongoId()
      .withMessage('Invalid department ID'),
    
    body('position')
      .trim()
      .notEmpty()
      .withMessage('Position is required')
      .isLength({ max: 100 })
      .withMessage('Position must be less than 100 characters'),
    
    body('employeeId')
      .trim()
      .notEmpty()
      .withMessage('Employee ID is required')
      .isLength({ max: 50 })
      .withMessage('Employee ID must be less than 50 characters'),
    
    body('maxVisitorsPerDay')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Maximum visitors per day must be between 1 and 20'),
    
    body('accessLevel')
      .optional()
      .isIn(['basic', 'intermediate', 'advanced'])
      .withMessage('Invalid access level'),
    
    body('notifications.email')
      .optional()
      .isBoolean()
      .withMessage('Email notification must be a boolean'),
    
    body('notifications.sms')
      .optional()
      .isBoolean()
      .withMessage('SMS notification must be a boolean')
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid host ID'),
    
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
    
    body('position')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Position must be less than 100 characters'),
    
    body('maxVisitorsPerDay')
      .optional()
      .isInt({ min: 1, max: 20 })
      .withMessage('Maximum visitors per day must be between 1 and 20'),
    
    body('accessLevel')
      .optional()
      .isIn(['basic', 'intermediate', 'advanced'])
      .withMessage('Invalid access level'),
    
    body('notifications.email')
      .optional()
      .isBoolean()
      .withMessage('Email notification must be a boolean'),
    
    body('notifications.sms')
      .optional()
      .isBoolean()
      .withMessage('SMS notification must be a boolean'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('Active status must be a boolean')
  ]
};

module.exports = hostValidators; 