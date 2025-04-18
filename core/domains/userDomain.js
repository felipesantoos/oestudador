/**
 * User domain model that represents a user entity
 */
class User {
  constructor({
    id = null,
    name,
    email,
    password_hash,
    role = 'student',
    is_email_verified = false,
    email_verification_token = null,
    email_verification_sent_at = null,
    password_reset_token = null,
    password_reset_expires_at = null,
    login_attempts = 0,
    locked_until = null,
    two_factor_enabled = false,
    two_factor_secret = null,
    session_token = null,
    timezone,
    language,
    birth_date = null,
    notifications_enabled = true,
    auth_provider = null,
    last_login_at = null,
    avatar_url = null,
    created_at = null,
    updated_at = null,
    deleted_at = null
  }) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password_hash = password_hash;
    this.role = role;
    this.is_email_verified = is_email_verified;
    this.email_verification_token = email_verification_token;
    this.email_verification_sent_at = email_verification_sent_at;
    this.password_reset_token = password_reset_token;
    this.password_reset_expires_at = password_reset_expires_at;
    this.login_attempts = login_attempts;
    this.locked_until = locked_until;
    this.two_factor_enabled = two_factor_enabled;
    this.two_factor_secret = two_factor_secret;
    this.session_token = session_token;
    this.timezone = timezone;
    this.language = language;
    this.birth_date = birth_date;
    this.notifications_enabled = notifications_enabled;
    this.auth_provider = auth_provider;
    this.last_login_at = last_login_at;
    this.avatar_url = avatar_url;
    this.created_at = created_at || new Date();
    this.updated_at = updated_at || new Date();
    this.deleted_at = deleted_at;
  }

  /**
   * Convert to database format
   */
  toDatabase() {
    return {
      id: this.id,
      name: this.name,
      email: this.email.toLowerCase(),
      password_hash: this.password_hash,
      role: this.role,
      is_email_verified: this.is_email_verified,
      email_verification_token: this.email_verification_token,
      email_verification_sent_at: this.email_verification_sent_at,
      password_reset_token: this.password_reset_token,
      password_reset_expires_at: this.password_reset_expires_at,
      login_attempts: this.login_attempts,
      locked_until: this.locked_until,
      two_factor_enabled: this.two_factor_enabled,
      two_factor_secret: this.two_factor_secret,
      session_token: this.session_token,
      timezone: this.timezone,
      language: this.language,
      birth_date: this.birth_date,
      notifications_enabled: this.notifications_enabled,
      auth_provider: this.auth_provider,
      last_login_at: this.last_login_at,
      avatar_url: this.avatar_url,
      created_at: this.created_at,
      updated_at: this.updated_at,
      deleted_at: this.deleted_at
    };
  }

  /**
   * Create from database record
   */
  static fromDatabase(data) {
    if (!data) return null;
    return new User(data);
  }

  /**
   * Sanitize user object for public API (remove sensitive fields)
   */
  toPublic() {
    return {
      id: this.id,
      name: this.name,
      email: this.email,
      role: this.role,
      isEmailVerified: this.is_email_verified,
      timezone: this.timezone,
      language: this.language,
      avatarUrl: this.avatar_url,
      notificationsEnabled: this.notifications_enabled,
      createdAt: this.created_at
    };
  }
  
  /**
   * Increment login attempts
   */
  incrementLoginAttempts() {
    this.login_attempts += 1;
    return this;
  }
  
  /**
   * Reset login attempts
   */
  resetLoginAttempts() {
    this.login_attempts = 0;
    this.locked_until = null;
    return this;
  }
  
  /**
   * Lock account until specified date
   */
  lockUntil(date) {
    this.locked_until = date;
    return this;
  }
  
  /**
   * Update last login timestamp
   */
  updateLastLogin() {
    this.last_login_at = new Date();
    return this;
  }
  
  /**
   * Set email verification token
   */
  setEmailVerificationToken(token, expiresIn = 24) {
    this.email_verification_token = token;
    this.email_verification_sent_at = new Date();
    return this;
  }
  
  /**
   * Verify email
   */
  verifyEmail() {
    this.is_email_verified = true;
    this.email_verification_token = null;
    this.email_verification_sent_at = null;
    return this;
  }
  
  /**
   * Set password reset token
   */
  setPasswordResetToken(token, expiresIn = 1) {
    this.password_reset_token = token;
    
    // Set expiration date
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresIn);
    this.password_reset_expires_at = expiresAt;
    
    return this;
  }
  
  /**
   * Clear password reset token
   */
  clearPasswordResetToken() {
    this.password_reset_token = null;
    this.password_reset_expires_at = null;
    return this;
  }
  
  /**
   * Update password
   */
  updatePassword(passwordHash) {
    this.password_hash = passwordHash;
    this.updated_at = new Date();
    return this;
  }
  
  /**
   * Soft delete user
   */
  softDelete() {
    this.deleted_at = new Date();
    return this;
  }
  
  /**
   * Restore soft deleted user
   */
  restore() {
    this.deleted_at = null;
    return this;
  }
}

module.exports = { User };