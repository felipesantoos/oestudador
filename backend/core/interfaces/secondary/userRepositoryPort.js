/**
 * Secondary port for user repository operations (output port)
 * Defines the interface that the application core expects from the infrastructure layer
 */

/**
 * @interface UserRepositoryPort
 */
const UserRepositoryPort = {
  /**
   * Create a new user
   * @param {Object} user - User object
   * @returns {Promise<Object>} - Created user
   */
  createUser: async (user) => {},

  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  findById: async (id) => {},

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  findByEmail: async (email) => {},

  /**
   * Find user by email verification token
   * @param {string} token - Email verification token
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  findByEmailVerificationToken: async (token) => {},

  /**
   * Find user by password reset token
   * @param {string} token - Password reset token
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  findByPasswordResetToken: async (token) => {},

  /**
   * Find user by refresh token
   * @param {string} token - Refresh token
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  findByRefreshToken: async (token) => {},

  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated user
   */
  updateUser: async (id, updates) => {},

  /**
   * Delete user (soft delete)
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - Success status
   */
  deleteUser: async (id) => {},

  /**
   * Restore deleted user
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Restored user
   */
  restoreUser: async (id) => {},

  /**
   * Check if email exists
   * @param {string} email - User email
   * @returns {Promise<boolean>} - True if email exists
   */
  emailExists: async (email) => {},

  /**
   * Increment login attempts
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Updated user
   */
  incrementLoginAttempts: async (id) => {},

  /**
   * Reset login attempts
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Updated user
   */
  resetLoginAttempts: async (id) => {},

  /**
   * Lock user account until specified date
   * @param {string} id - User ID
   * @param {Date} date - Lock until date
   * @returns {Promise<Object>} - Updated user
   */
  lockAccount: async (id, date) => {},

  /**
   * Update last login timestamp
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Updated user
   */
  updateLastLogin: async (id) => {}
};

module.exports = { UserRepositoryPort };