const { v4: uuidv4 } = require('uuid');
const { databaseConnection } = require('./connection');
const { User } = require('../../../core/domains/userDomain');
const { logger } = require('../../../app/shared/logger');

/**
 * PostgreSQL implementation of the UserRepositoryPort
 */
class UserRepository {
  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {Promise<Object>} - Created user
   */
  async createUser(userData) {
    try {
      const id = userData.id || uuidv4();
      const now = new Date();
      
      const query = `
        INSERT INTO users (
          id, name, email, password_hash, role, is_email_verified,
          email_verification_token, email_verification_sent_at, timezone,
          language, birth_date, notifications_enabled, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING *
      `;
      
      const values = [
        id,
        userData.name,
        userData.email.toLowerCase(),
        userData.password_hash,
        userData.role || 'student',
        userData.is_email_verified || false,
        userData.email_verification_token,
        userData.email_verification_sent_at,
        userData.timezone,
        userData.language,
        userData.birth_date,
        userData.notifications_enabled || true,
        userData.created_at || now,
        userData.updated_at || now
      ];
      
      const result = await databaseConnection.query(query, values);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error creating user:', error);
      throw error;
    }
  }
  
  /**
   * Find user by ID
   * @param {string} id - User ID
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findById(id) {
    try {
      const query = `
        SELECT * FROM users
        WHERE id = $1 AND deleted_at IS NULL
      `;
      
      const result = await databaseConnection.query(query, [id]);
      return result.rows[0] || null;
      
    } catch (error) {
      logger.error('Error finding user by ID:', error);
      throw error;
    }
  }
  
  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findByEmail(email) {
    try {
      const query = `
        SELECT * FROM users
        WHERE email = $1
      `;
      
      const result = await databaseConnection.query(query, [email.toLowerCase()]);
      return result.rows[0] || null;
      
    } catch (error) {
      logger.error('Error finding user by email:', error);
      throw error;
    }
  }
  
  /**
   * Find user by email verification token
   * @param {string} token - Email verification token
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findByEmailVerificationToken(token) {
    try {
      const query = `
        SELECT * FROM users
        WHERE email_verification_token = $1 AND deleted_at IS NULL
      `;
      
      const result = await databaseConnection.query(query, [token]);
      return result.rows[0] || null;
      
    } catch (error) {
      logger.error('Error finding user by verification token:', error);
      throw error;
    }
  }
  
  /**
   * Find user by password reset token
   * @param {string} token - Password reset token
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findByPasswordResetToken(token) {
    try {
      const query = `
        SELECT * FROM users
        WHERE password_reset_token = $1 AND deleted_at IS NULL
          AND password_reset_expires_at > NOW()
      `;
      
      const result = await databaseConnection.query(query, [token]);
      return result.rows[0] || null;
      
    } catch (error) {
      logger.error('Error finding user by password reset token:', error);
      throw error;
    }
  }
  
  /**
   * Find user by refresh token
   * @param {string} token - Refresh token
   * @returns {Promise<Object|null>} - User object or null if not found
   */
  async findByRefreshToken(token) {
    try {
      const query = `
        SELECT * FROM users
        WHERE session_token = $1 AND deleted_at IS NULL
      `;
      
      const result = await databaseConnection.query(query, [token]);
      return result.rows[0] || null;
      
    } catch (error) {
      logger.error('Error finding user by refresh token:', error);
      throw error;
    }
  }
  
  /**
   * Update user
   * @param {string} id - User ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} - Updated user
   */
  async updateUser(id, updates) {
    try {
      // Build the SET part of the query dynamically
      const setValues = [];
      const queryParams = [id];
      let paramIndex = 2;
      
      for (const [key, value] of Object.entries(updates)) {
        setValues.push(`${key} = $${paramIndex}`);
        queryParams.push(value);
        paramIndex++;
      }
      
      const query = `
        UPDATE users
        SET ${setValues.join(', ')}
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await databaseConnection.query(query, queryParams);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error updating user:', error);
      throw error;
    }
  }
  
  /**
   * Delete user (soft delete)
   * @param {string} id - User ID
   * @returns {Promise<boolean>} - Success status
   */
  async deleteUser(id) {
    try {
      const query = `
        UPDATE users
        SET deleted_at = NOW()
        WHERE id = $1
        RETURNING id
      `;
      
      const result = await databaseConnection.query(query, [id]);
      return result.rowCount > 0;
      
    } catch (error) {
      logger.error('Error soft deleting user:', error);
      throw error;
    }
  }
  
  /**
   * Restore deleted user
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Restored user
   */
  async restoreUser(id) {
    try {
      const query = `
        UPDATE users
        SET deleted_at = NULL
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await databaseConnection.query(query, [id]);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error restoring user:', error);
      throw error;
    }
  }
  
  /**
   * Check if email exists
   * @param {string} email - User email
   * @returns {Promise<boolean>} - True if email exists
   */
  async emailExists(email) {
    try {
      const query = `
        SELECT EXISTS(
          SELECT 1 FROM users
          WHERE email = $1
        ) as exists
      `;
      
      const result = await databaseConnection.query(query, [email.toLowerCase()]);
      return result.rows[0].exists;
      
    } catch (error) {
      logger.error('Error checking if email exists:', error);
      throw error;
    }
  }
  
  /**
   * Increment login attempts
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Updated user
   */
  async incrementLoginAttempts(id) {
    try {
      const query = `
        UPDATE users
        SET login_attempts = login_attempts + 1,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await databaseConnection.query(query, [id]);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error incrementing login attempts:', error);
      throw error;
    }
  }
  
  /**
   * Reset login attempts
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Updated user
   */
  async resetLoginAttempts(id) {
    try {
      const query = `
        UPDATE users
        SET login_attempts = 0,
            locked_until = NULL,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await databaseConnection.query(query, [id]);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error resetting login attempts:', error);
      throw error;
    }
  }
  
  /**
   * Lock user account until specified date
   * @param {string} id - User ID
   * @param {Date} date - Lock until date
   * @returns {Promise<Object>} - Updated user
   */
  async lockAccount(id, date) {
    try {
      const query = `
        UPDATE users
        SET locked_until = $2,
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await databaseConnection.query(query, [id, date]);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error locking user account:', error);
      throw error;
    }
  }
  
  /**
   * Update last login timestamp
   * @param {string} id - User ID
   * @returns {Promise<Object>} - Updated user
   */
  async updateLastLogin(id) {
    try {
      const query = `
        UPDATE users
        SET last_login_at = NOW(),
            updated_at = NOW()
        WHERE id = $1
        RETURNING *
      `;
      
      const result = await databaseConnection.query(query, [id]);
      return result.rows[0];
      
    } catch (error) {
      logger.error('Error updating last login:', error);
      throw error;
    }
  }
}

const userRepository = new UserRepository();

module.exports = { userRepository };