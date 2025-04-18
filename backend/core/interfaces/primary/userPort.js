/**
 * Primary port for user operations (input port)
 * Defines the interface that the application core exposes to the outside world
 */

/**
 * @interface UserPort
 */
const UserPort = {
  /**
   * Register a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Registered user and verification token
   */
  registerUser: async (userData) => {},

  /**
   * Verify user email
   * @param {string} token - Verification token
   * @returns {Promise<Object>} - Updated user
   */
  verifyEmail: async (token) => {},

  /**
   * Resend verification email
   * @param {string} email - User email
   * @returns {Promise<Object>} - Updated user and new token
   */
  resendVerificationEmail: async (email) => {},

  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {boolean} rememberMe - Whether to issue a long-lived token
   * @returns {Promise<Object>} - User and authentication tokens
   */
  loginUser: async (email, password, rememberMe) => {},

  /**
   * Initiate forgot password process
   * @param {string} email - User email
   * @returns {Promise<boolean>} - Success status
   */
  forgotPassword: async (email) => {},

  /**
   * Reset user password
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Updated user
   */
  resetPassword: async (token, newPassword) => {},

  /**
   * Change user password
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {Promise<Object>} - Updated user
   */
  changePassword: async (userId, currentPassword, newPassword) => {},

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Promise<Object>} - User object
   */
  getUserById: async (userId) => {},

  /**
   * Refresh authentication token
   * @param {string} refreshToken - Refresh token
   * @returns {Promise<Object>} - New access and refresh tokens
   */
  refreshToken: async (refreshToken) => {},

  /**
   * Invalidate a refresh token
   * @param {string} refreshToken - Refresh token to invalidate
   * @returns {Promise<boolean>} - Success status
   */
  invalidateToken: async (refreshToken) => {},

  /**
   * Invalidate all user's refresh tokens
   * @param {string} userId - User ID
   * @returns {Promise<boolean>} - Success status
   */
  invalidateAllTokens: async (userId) => {}
};

module.exports = { UserPort };