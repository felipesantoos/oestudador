/**
 * DTOs for authentication-related responses
 */

/**
 * User authentication response DTO
 * @typedef {Object} AuthResponse
 * @property {string} status - Response status (success/error)
 * @property {Object} data - Response data
 * @property {Object} data.user - User information
 * @property {string} data.user.id - User ID
 * @property {string} data.user.name - User's full name
 * @property {string} data.user.email - User's email address
 * @property {string} data.user.role - User's role
 * @property {boolean} data.user.isEmailVerified - Email verification status
 * @property {string} [data.user.avatar_url] - User's avatar URL if available
 * @property {string} [data.accessToken] - JWT access token (not included in all responses)
 */

/**
 * Generic message response DTO
 * @typedef {Object} MessageResponse
 * @property {string} status - Response status (success/error)
 * @property {string} message - Response message
 */

/**
 * Error response DTO
 * @typedef {Object} ErrorResponse
 * @property {string} status - Response status (always "error")
 * @property {string} code - Error code
 * @property {string} message - Error message
 * @property {Object} [errors] - Validation errors object (field -> array of error messages)
 */

module.exports = {};