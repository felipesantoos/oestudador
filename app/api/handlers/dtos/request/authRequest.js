/**
 * DTOs for authentication-related requests
 */

/**
 * User registration request DTO
 * @typedef {Object} RegisterRequest
 * @property {string} name - User's full name
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {string} timezone - User's timezone
 * @property {string} language - User's preferred language
 * @property {string} [birthDate] - User's birth date (optional)
 */

/**
 * User login request DTO
 * @typedef {Object} LoginRequest
 * @property {string} email - User's email address
 * @property {string} password - User's password
 * @property {boolean} [rememberMe] - Whether to issue a long-lived refresh token
 */

/**
 * Forgot password request DTO
 * @typedef {Object} ForgotPasswordRequest
 * @property {string} email - User's email address
 */

/**
 * Reset password request DTO
 * @typedef {Object} ResetPasswordRequest
 * @property {string} password - New password
 * @property {string} token - Password reset token from URL
 */

/**
 * Change password request DTO
 * @typedef {Object} ChangePasswordRequest
 * @property {string} currentPassword - Current password
 * @property {string} newPassword - New password
 */

/**
 * Email verification request DTO
 * @typedef {Object} EmailVerificationRequest
 * @property {string} email - User's email address
 */

module.exports = {};