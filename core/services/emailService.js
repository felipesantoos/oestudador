import nodemailer from 'nodemailer';
import { logger } from '../../app/shared/logger.js';

/**
 * Email service for sending transactional emails
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === '465',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }
  
  /**
   * Send an email
   * @param {Object} options - Email options
   * @returns {Promise<boolean>} - Success status
   */
  async sendEmail(options) {
    try {
      const mailOptions = {
        from: `"${process.env.APP_NAME || 'Authentication Service'}" <${process.env.EMAIL_FROM}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };
      
      await this.transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      logger.error('Failed to send email:', error);
      
      // In development, just log success to console
      if (process.env.NODE_ENV === 'development') {
        logger.info('In development mode. Email would have been sent:');
        logger.info(`To: ${options.to}`);
        logger.info(`Subject: ${options.subject}`);
        logger.info(`Text: ${options.text}`);
        return true;
      }
      
      throw error;
    }
  }
  
  /**
   * Send verification email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {string} token - Verification token
   * @returns {Promise<boolean>} - Success status
   */
  async sendVerificationEmail(to, name, token) {
    const verificationUrl = `${process.env.APP_URL}/api/auth/verify-email/${token}`;
    
    const html = `
      <h1>Email Verification</h1>
      <p>Hello ${name},</p>
      <p>Thank you for registering! Please verify your email address by clicking the link below:</p>
      <p><a href="${verificationUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Verify Email</a></p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
      <p>If you did not request this verification, please ignore this email.</p>
    `;
    
    const text = `
      Email Verification
      
      Hello ${name},
      
      Thank you for registering! Please verify your email address by visiting the link below:
      
      ${verificationUrl}
      
      This link will expire in 24 hours.
      
      If you did not request this verification, please ignore this email.
    `;
    
    return this.sendEmail({
      to,
      subject: 'Verify Your Email Address',
      text,
      html
    });
  }
  
  /**
   * Send password reset email
   * @param {string} to - Recipient email
   * @param {string} name - Recipient name
   * @param {string} token - Reset token
   * @returns {Promise<boolean>} - Success status
   */
  async sendPasswordResetEmail(to, name, token) {
    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password/${token}`;
    
    const html = `
      <h1>Password Reset</h1>
      <p>Hello ${name},</p>
      <p>You requested a password reset. Please click the link below to set a new password:</p>
      <p><a href="${resetUrl}" style="padding: 10px 15px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a></p>
      <p>Or copy and paste this URL into your browser:</p>
      <p>${resetUrl}</p>
      <p>This link will expire in 1 hour.</p>
      <p>If you did not request this password reset, please ignore this email and your password will remain unchanged.</p>
    `;
    
    const text = `
      Password Reset
      
      Hello ${name},
      
      You requested a password reset. Please visit the link below to set a new password:
      
      ${resetUrl}
      
      This link will expire in 1 hour.
      
      If you did not request this password reset, please ignore this email and your password will remain unchanged.
    `;
    
    return this.sendEmail({
      to,
      subject: 'Password Reset Request',
      text,
      html
    });
  }
}

export const emailService = new EmailService();