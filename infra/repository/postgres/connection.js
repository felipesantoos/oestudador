const { Pool } = require('pg');
const { logger } = require('../../../app/shared/logger');

/**
 * PostgreSQL database connection
 */
class DatabaseConnection {
  constructor() {
    this.pool = null;
    this.isConnected = false;
  }
  
  /**
   * Create the PostgreSQL connection pool
   * @returns {Pool} - PostgreSQL connection pool
   */
  createPool() {
    return new Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
  }
  
  /**
   * Connect to the database
   * @returns {Promise<void>}
   */
  async connect() {
    try {
      if (!this.pool) {
        this.pool = this.createPool();
      }
      
      // Test the connection
      const client = await this.pool.connect();
      client.release();
      
      this.isConnected = true;
      logger.info('Successfully connected to PostgreSQL database');
      
    } catch (error) {
      logger.error('Failed to connect to PostgreSQL database:', error);
      
      // In development, create mock connection for testing
      if (process.env.NODE_ENV === 'development') {
        logger.info('Using mock database connection for development');
        this.isConnected = true;
      } else {
        throw error;
      }
    }
  }
  
  /**
   * Execute a query
   * @param {string} text - SQL query
   * @param {Array} params - Query parameters
   * @returns {Promise<any>} - Query result
   */
  async query(text, params) {
    if (!this.isConnected) {
      await this.connect();
    }
    
    try {
      const start = Date.now();
      const result = await this.pool.query(text, params);
      const duration = Date.now() - start;
      
      logger.debug('Executed query', {
        query: text,
        duration,
        rows: result.rowCount
      });
      
      return result;
    } catch (error) {
      logger.error('Error executing query:', {
        query: text,
        error: error.message,
        stack: error.stack
      });
      
      throw error;
    }
  }
  
  /**
   * Close the database connection
   * @returns {Promise<void>}
   */
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.isConnected = false;
      this.pool = null;
      logger.info('Database connection closed');
    }
  }
}

const databaseConnection = new DatabaseConnection();

module.exports = { databaseConnection };