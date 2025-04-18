const { userRepository } = require('../../infra/repository/postgres/userRepository');

/**
 * Get user by ID service
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
const getUserByIdService = async (userId) => {
  return userRepository.findById(userId);
};

module.exports = {
  getUserByIdService
};