const { body, param } = require('express-validator');

const departmentValidators = {
  create: [
    body('name')
      .trim()
      .notEmpty()
      .withMessage('Department name is required')
      .isLength({ min: 2, max: 100 })
      .withMessage('Department name must be between 2 and 100 characters'),
    
    body('code')
      .trim()
      .notEmpty()
      .withMessage('Department code is required')
      .isLength({ min: 2, max: 20 })
      .withMessage('Department code must be between 2 and 20 characters')
      .matches(/^[A-Z0-9-]+$/)
      .withMessage('Department code must contain only uppercase letters, numbers, and hyphens'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    
    body('head')
      .optional()
      .isMongoId()
      .withMessage('Invalid head ID'),
    
    body('location.building')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Building name must be less than 100 characters'),
    
    body('location.floor')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Floor must be less than 20 characters'),
    
    body('location.room')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Room must be less than 20 characters'),
    
    body('accessLevel')
      .optional()
      .isIn(['public', 'restricted', 'confidential'])
      .withMessage('Invalid access level'),
    
    body('visitorPolicy.requiresApproval')
      .optional()
      .isBoolean()
      .withMessage('Requires approval must be a boolean'),
    
    body('visitorPolicy.maxVisitorsPerDay')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Maximum visitors per day must be between 1 and 100'),
    
    body('visitorPolicy.allowedVisitHours.start')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Start time must be in HH:mm format'),
    
    body('visitorPolicy.allowedVisitHours.end')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('End time must be in HH:mm format')
  ],

  update: [
    param('id')
      .isMongoId()
      .withMessage('Invalid department ID'),
    
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Department name must be between 2 and 100 characters'),
    
    body('description')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Description must be less than 500 characters'),
    
    body('head')
      .optional()
      .isMongoId()
      .withMessage('Invalid head ID'),
    
    body('location.building')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('Building name must be less than 100 characters'),
    
    body('location.floor')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Floor must be less than 20 characters'),
    
    body('location.room')
      .optional()
      .trim()
      .isLength({ max: 20 })
      .withMessage('Room must be less than 20 characters'),
    
    body('accessLevel')
      .optional()
      .isIn(['public', 'restricted', 'confidential'])
      .withMessage('Invalid access level'),
    
    body('visitorPolicy.requiresApproval')
      .optional()
      .isBoolean()
      .withMessage('Requires approval must be a boolean'),
    
    body('visitorPolicy.maxVisitorsPerDay')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Maximum visitors per day must be between 1 and 100'),
    
    body('visitorPolicy.allowedVisitHours.start')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Start time must be in HH:mm format'),
    
    body('visitorPolicy.allowedVisitHours.end')
      .optional()
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('End time must be in HH:mm format'),
    
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('Active status must be a boolean')
  ]
};

module.exports = departmentValidators; 