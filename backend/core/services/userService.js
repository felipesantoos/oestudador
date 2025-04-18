import { userRepository } from '../../infra/repository/postgres/userRepository.js';

/**
 * Get user by ID service
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} - User object or null if not found
 */
export const getUserByIdService = async (userId) => {
  return userRepository.findById(userId);
};