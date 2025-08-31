// Security utilities and configurations for PromptOps

/**
 * Content Security Policy configuration
 */
export const CSP_CONFIG = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for React development
    "'unsafe-eval'", // Required for React development
    "https://js.stripe.com",
    "https://checkout.stripe.com"
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS
    "https://fonts.googleapis.com"
  ],
  'font-src': [
    "'self'",
    "https://fonts.gstatic.com"
  ],
  'img-src': [
    "'self'",
    "data:",
    "https:",
    "blob:"
  ],
  'connect-src': [
    "'self'",
    "https://api.stripe.com",
    "https://*.supabase.co",
    "wss://*.supabase.co"
  ],
  'frame-src': [
    "https://js.stripe.com",
    "https://checkout.stripe.com"
  ],
  'media-src': ["'self'", "blob:"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': []
};

/**
 * Input validation and sanitization
 */
export class InputValidator {
  
  /**
   * Validate and sanitize prompt content
   */
  static validatePromptContent(content: string): {
    isValid: boolean;
    sanitized: string;
    errors: string[];
  } {
    const errors: string[] = [];
    let sanitized = content;

    // Basic length validation
    if (!content || content.trim().length === 0) {
      errors.push("Content cannot be empty");
      return { isValid: false, sanitized: "", errors };
    }

    if (content.length > 10000) {
      errors.push("Content too long (max 10,000 characters)");
    }

    // Remove potentially dangerous HTML/script tags
    sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    sanitized = sanitized.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
    sanitized = sanitized.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
    sanitized = sanitized.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');
    sanitized = sanitized.replace(/<link\b[^>]*>/gi, '');
    sanitized = sanitized.replace(/<meta\b[^>]*>/gi, '');

    // Remove javascript: and data: URLs
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/data:(?!image\/)/gi, '');

    // Remove event handlers
    sanitized = sanitized.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');

    return {
      isValid: errors.length === 0,
      sanitized: sanitized.trim(),
      errors
    };
  }

  /**
   * Validate email format
   */
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.length <= 254;
  }

  /**
   * Validate username
   */
  static validateUsername(username: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!username || username.trim().length === 0) {
      errors.push("Username is required");
    } else {
      if (username.length < 3) {
        errors.push("Username must be at least 3 characters");
      }
      if (username.length > 30) {
        errors.push("Username must be less than 30 characters");
      }
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        errors.push("Username can only contain letters, numbers, underscores, and hyphens");
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate password strength
   */
  static validatePassword(password: string): {
    isValid: boolean;
    strength: 'weak' | 'medium' | 'strong';
    errors: string[];
  } {
    const errors: string[] = [];
    let strength: 'weak' | 'medium' | 'strong' = 'weak';

    if (!password) {
      errors.push("Password is required");
      return { isValid: false, strength, errors };
    }

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters");
    }

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    if (criteriaCount < 2) {
      errors.push("Password must contain at least 2 of: lowercase, uppercase, numbers, special characters");
    } else if (criteriaCount === 2) {
      strength = 'medium';
    } else if (criteriaCount >= 3) {
      strength = 'strong';
    }

    // Check for common weak passwords
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey'
    ];

    if (commonPasswords.includes(password.toLowerCase())) {
      errors.push("Password is too common");
      strength = 'weak';
    }

    return {
      isValid: errors.length === 0,
      strength,
      errors
    };
  }
}

/**
 * Rate limiting utilities
 */
export class RateLimiter {
  private static attempts: Map<string, { count: number; resetTime: number }> = new Map();

  /**
   * Check if action is rate limited
   */
  static isRateLimited(key: string, maxAttempts: number, windowMs: number): boolean {
    const now = Date.now();
    const attempt = this.attempts.get(key);

    if (!attempt || now > attempt.resetTime) {
      this.attempts.set(key, { count: 1, resetTime: now + windowMs });
      return false;
    }

    if (attempt.count >= maxAttempts) {
      return true;
    }

    attempt.count++;
    return false;
  }

  /**
   * Reset rate limit for a key
   */
  static reset(key: string): void {
    this.attempts.delete(key);
  }
}

/**
 * CSRF protection utilities
 */
export class CSRFProtection {
  private static token: string | null = null;

  /**
   * Generate CSRF token
   */
  static generateToken(): string {
    const array = new Uint8Array(32);
    crypto.getRandomValues(array);
    this.token = Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
    return this.token;
  }

  /**
   * Get current CSRF token
   */
  static getToken(): string | null {
    return this.token;
  }

  /**
   * Validate CSRF token
   */
  static validateToken(token: string): boolean {
    return this.token !== null && this.token === token;
  }
}

/**
 * Secure storage utilities
 */
export class SecureStorage {
  
  /**
   * Store sensitive data securely
   */
  static setItem(key: string, value: string): void {
    try {
      // In production, consider encrypting sensitive data
      sessionStorage.setItem(key, value);
    } catch (error) {
      console.warn('Failed to store item securely:', error);
    }
  }

  /**
   * Retrieve sensitive data securely
   */
  static getItem(key: string): string | null {
    try {
      return sessionStorage.getItem(key);
    } catch (error) {
      console.warn('Failed to retrieve item securely:', error);
      return null;
    }
  }

  /**
   * Remove sensitive data
   */
  static removeItem(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.warn('Failed to remove item securely:', error);
    }
  }

  /**
   * Clear all sensitive data
   */
  static clear(): void {
    try {
      sessionStorage.clear();
    } catch (error) {
      console.warn('Failed to clear secure storage:', error);
    }
  }
}

/**
 * Permission checking utilities
 */
export class PermissionChecker {
  
  /**
   * Check if user can access prompt
   */
  static canAccessPrompt(prompt: any, user: any): boolean {
    if (!prompt || !user) return false;

    // User can always access their own prompts
    if (prompt.userId === user.id) return true;

    // Admin can access all prompts
    if (user.email === 'admin@promptops.com' || user.email === 'mourad@admin.com') {
      return true;
    }

    // Public prompts are accessible to all
    if (prompt.visibility === 'public' && prompt.moderationStatus === 'approved') {
      return true;
    }

    // Team prompts are accessible to team members
    if (prompt.visibility === 'team' && prompt.moderationStatus === 'approved') {
      return user.teamId && user.teamId === prompt.user?.teamId;
    }

    return false;
  }

  /**
   * Check if user can edit prompt
   */
  static canEditPrompt(prompt: any, user: any): boolean {
    if (!prompt || !user) return false;

    // User can edit their own prompts
    if (prompt.userId === user.id) return true;

    // Admin can edit all prompts
    if (user.email === 'admin@promptops.com' || user.email === 'mourad@admin.com') {
      return true;
    }

    return false;
  }

  /**
   * Check if user can delete prompt
   */
  static canDeletePrompt(prompt: any, user: any): boolean {
    return this.canEditPrompt(prompt, user);
  }

  /**
   * Check if user can moderate content
   */
  static canModerate(user: any): boolean {
    if (!user) return false;
    return user.email === 'admin@promptops.com' || user.email === 'mourad@admin.com';
  }

  /**
   * Check if user can access team features
   */
  static canAccessTeamFeatures(user: any): boolean {
    if (!user) return false;
    return user.plan === 'team' || user.plan === 'enterprise';
  }
}

/**
 * Security headers for API requests
 */
export const getSecurityHeaders = (): Record<string, string> => {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  };

  const csrfToken = CSRFProtection.getToken();
  if (csrfToken) {
    headers['X-CSRF-Token'] = csrfToken;
  }

  return headers;
};

/**
 * Audit logging for security events
 */
export class SecurityAudit {
  
  /**
   * Log security event
   */
  static logEvent(event: string, details: any = {}): void {
    const logEntry = {
      timestamp: new Date().toISOString(),
      event,
      details,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // In production, send to security monitoring service
    console.log('Security Event:', logEntry);
  }

  /**
   * Log authentication event
   */
  static logAuth(action: 'login' | 'logout' | 'failed_login', userId?: string): void {
    this.logEvent('auth', { action, userId });
  }

  /**
   * Log data access event
   */
  static logDataAccess(resource: string, action: string, userId?: string): void {
    this.logEvent('data_access', { resource, action, userId });
  }

  /**
   * Log security violation
   */
  static logViolation(type: string, details: any): void {
    this.logEvent('security_violation', { type, details });
  }
}
