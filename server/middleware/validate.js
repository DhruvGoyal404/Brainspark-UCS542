/**
 * Input Validation Middleware using express-validator
 * Centralized validation chains for all routes
 */
const { body, param, query, validationResult } = require('express-validator');

// ─── Validation Result Handler ────────────────────────────────
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }))
        });
    }
    next();
};

// ─── Auth Validations ─────────────────────────────────────────
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
        .withMessage('Password must contain at least one letter and one number'),
    validate
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    validate
];

// ─── Change Password Validation ───────────────────────────────
const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
        .withMessage('New password must contain at least one letter and one number'),
    validate
];

// ─── Profile Update Validation ────────────────────────────────
const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    validate
];

// ─── Quiz Validations ─────────────────────────────────────────
const createQuizValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Quiz title is required')
        .isLength({ max: 200 })
        .withMessage('Quiz title must be under 200 characters'),
    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['dsa', 'operating-systems', 'dbms', 'networks', 'oops', 'web', 'other'])
        .withMessage('Invalid category'),
    body('difficulty')
        .optional()
        .isIn(['easy', 'medium', 'hard'])
        .withMessage('Difficulty must be easy, medium, or hard'),
    body('questions')
        .isArray({ min: 1 })
        .withMessage('At least one question is required'),
    body('questions.*.questionText')
        .trim()
        .notEmpty()
        .withMessage('Each question must have text'),
    body('questions.*.options')
        .isArray({ min: 2 })
        .withMessage('Each question must have at least 2 options'),
    body('questions.*.options.*.text')
        .trim()
        .notEmpty()
        .withMessage('Each option must have text'),
    validate
];

// ─── Quiz Submission Validation ───────────────────────────────
const submitQuizValidation = [
    body('quizId')
        .trim()
        .notEmpty()
        .withMessage('Quiz ID is required'),
    body('answers')
        .isArray({ min: 1 })
        .withMessage('Answers array is required'),
    body('answers.*.questionIndex')
        .isInt({ min: 0 })
        .withMessage('Question index must be a non-negative integer'),
    body('answers.*.selectedOption')
        .trim()
        .notEmpty()
        .withMessage('Selected option is required'),
    body('timeSpent')
        .optional()
        .isInt({ min: 0 })
        .withMessage('Time spent must be a non-negative integer'),
    body('quizMode')
        .optional()
        .isIn(['timed', 'practice'])
        .withMessage('Quiz mode must be timed or practice'),
    validate
];

// ─── Bookmark Validation ──────────────────────────────────────
const addBookmarkValidation = [
    body('quizId')
        .trim()
        .notEmpty()
        .withMessage('Quiz ID is required'),
    body('questionIndex')
        .isInt({ min: 0 })
        .withMessage('Question index must be a non-negative integer'),
    body('questionText')
        .trim()
        .notEmpty()
        .withMessage('Question text is required'),
    validate
];

// ─── Preferences Validation ──────────────────────────────────
const preferencesValidation = [
    body('theme')
        .optional()
        .isIn(['light', 'dark', 'system'])
        .withMessage('Theme must be light, dark, or system'),
    body('fontSize')
        .optional()
        .isIn(['small', 'medium', 'large'])
        .withMessage('Font size must be small, medium, or large'),
    body('soundEnabled')
        .optional()
        .isBoolean()
        .withMessage('Sound enabled must be a boolean'),
    body('reducedMotion')
        .optional()
        .isBoolean()
        .withMessage('Reduced motion must be a boolean'),
    body('emailNotifications')
        .optional()
        .isBoolean()
        .withMessage('Email notifications must be a boolean'),
    body('pushNotifications')
        .optional()
        .isBoolean()
        .withMessage('Push notifications must be a boolean'),
    validate
];

// ─── Pagination Validation ────────────────────────────────────
const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
    validate
];

// ─── Forgot/Reset Password Validation ─────────────────────────
const forgotPasswordValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
    validate
];

const resetPasswordValidation = [
    body('token')
        .trim()
        .notEmpty()
        .withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9])/)
        .withMessage('Password must contain at least one letter and one number'),
    validate
];

// ─── Report Validation ────────────────────────────────────────
const reportQuestionValidation = [
    body('reportType')
        .trim()
        .notEmpty()
        .withMessage('Report type is required')
        .isIn(['unclear', 'incorrect_answer', 'typo', 'offensive', 'other'])
        .withMessage('Invalid report type'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be under 500 characters'),
    validate
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    changePasswordValidation,
    updateProfileValidation,
    createQuizValidation,
    submitQuizValidation,
    addBookmarkValidation,
    preferencesValidation,
    paginationValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    reportQuestionValidation
};
