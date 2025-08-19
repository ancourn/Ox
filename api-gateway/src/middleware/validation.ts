import { Request, Response, NextFunction } from 'express';
import { validationResult, body } from 'express-validator';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors.array()
    });
  }
  next();
};

export const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long'),
];

export const registerValidation = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name must be less than 100 characters'),
];

export const emailValidation = [
  body('to')
    .isArray()
    .withMessage('Recipients must be an array'),
  body('to.*')
    .isEmail()
    .normalizeEmail()
    .withMessage('Each recipient must be a valid email address'),
  body('subject')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Subject must be between 1 and 200 characters'),
  body('body')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Email body cannot be empty'),
];

export const calendarEventValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Event title must be between 1 and 200 characters'),
  body('start')
    .isISO8601()
    .withMessage('Start time must be a valid ISO 8601 date'),
  body('end')
    .isISO8601()
    .withMessage('End time must be a valid ISO 8601 date'),
  body('attendees')
    .optional()
    .isArray()
    .withMessage('Attendees must be an array'),
  body('attendees.*.email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Each attendee must have a valid email address'),
];

export const fileUploadValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('File name must be between 1 and 255 characters'),
  body('folder')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Folder name must be less than 100 characters'),
];