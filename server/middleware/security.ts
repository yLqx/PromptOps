import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

interface RequestWithFile extends Request {
  file?: Express.Multer.File;
}
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

/**
 * Rate limiting configurations
 */
export const createRateLimit = (windowMs: number, max: number, message?: string) => {
  return rateLimit({
    windowMs,
    max,
    message: message || 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req: Request, res: Response) => {
      console.log(`Rate limit exceeded for IP: ${req.ip}, Path: ${req.path}`);
      res.status(429).json({
        error: 'Too many requests',
        message: 'Please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
  });
};

// Different rate limits for different endpoints
// More generous limits for development
const isDevelopment = process.env.NODE_ENV === 'development';

export const generalRateLimit = createRateLimit(
  15 * 60 * 1000,
  isDevelopment ? 1000 : 100, // 1000 requests per 15 minutes in dev, 100 in prod
  undefined
);

export const authRateLimit = createRateLimit(15 * 60 * 1000, 5); // 5 auth attempts per 15 minutes
export const apiRateLimit = createRateLimit(1 * 60 * 1000, isDevelopment ? 600 : 60); // 600 API calls per minute in dev
export const uploadRateLimit = createRateLimit(60 * 60 * 1000, 10); // 10 uploads per hour

// Skip rate limiting completely in development
export const skipStaticAssets = (req: Request, res: Response, next: NextFunction) => {
  // In development, skip all rate limiting
  if (isDevelopment) {
    return next();
  }

  // In production, apply rate limiting but skip static assets
  const staticPaths = [
    '/assets/',
    '/node_modules/',
    '/@fs/',
    '/@vite/',
    '.js',
    '.css',
    '.png',
    '.jpg',
    '.jpeg',
    '.gif',
    '.svg',
    '.ico',
    '.woff',
    '.woff2',
    '.ttf',
    '.eot'
  ];

  const isStaticAsset = staticPaths.some(path => req.path.includes(path));

  if (isStaticAsset) {
    return next();
  }

  return generalRateLimit(req, res, next);
};

/**
 * Security headers middleware
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: isDevelopment ? false : {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-inline'", // Required for React in development
        "'unsafe-eval'", // Required for React in development
        "https://js.stripe.com",
        "https://checkout.stripe.com"
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://fonts.googleapis.com"
      ],
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com"
      ],
      imgSrc: [
        "'self'",
        "data:",
        "https:",
        "blob:"
      ],
      connectSrc: [
        "'self'",
        "https://api.stripe.com",
        "https://*.supabase.co",
        "wss://*.supabase.co"
      ],
      frameSrc: [
        "https://js.stripe.com",
        "https://checkout.stripe.com"
      ],
      mediaSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Disable for development
  hsts: isDevelopment ? false : {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
});

/**
 * Input validation middleware
 */
export const validateInput = (req: Request, res: Response, next: NextFunction) => {
  // Validate content length
  if (req.body && JSON.stringify(req.body).length > 1024 * 1024) { // 1MB limit
    return res.status(413).json({
      error: 'Payload too large',
      message: 'Request body exceeds maximum size limit'
    });
  }

  // Sanitize string inputs
  if (req.body && typeof req.body === 'object') {
    sanitizeObject(req.body);
  }

  next();
};

/**
 * Recursively sanitize object properties
 */
function sanitizeObject(obj: any): void {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // Remove potentially dangerous patterns
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:(?!image\/)/gi, '')
        .replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

/**
 * CORS configuration
 */
export const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:5173',
      'https://promptops.com',
      'https://www.promptops.com',
      'https://app.promptops.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

/**
 * Request logging middleware
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;

    // Only log API requests and errors, skip static assets
    if (req.url.startsWith('/api') || res.statusCode >= 400) {
      const logData = {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        timestamp: new Date().toISOString()
      };

      if (res.statusCode >= 400) {
        console.warn('HTTP Error:', logData);
      } else {
        console.log('API Request:', logData);
      }
    }
  });

  next();
};

/**
 * Authentication validation middleware
 */
export const validateAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing or invalid authorization header'
    });
  }
  
  // Additional token validation would go here
  next();
};

/**
 * Admin authorization middleware
 */
export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user = (req as any).user;
  
  if (!user || (user.email !== 'admin@promptops.com' && user.email !== 'mourad@admin.com')) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required'
    });
  }
  
  next();
};

/**
 * Content moderation middleware
 */
export const moderateContent = (req: Request, res: Response, next: NextFunction) => {
  if (req.body && (req.body.content || req.body.title || req.body.description)) {
    const content = [req.body.content, req.body.title, req.body.description]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    
    // Basic content filtering
    const prohibitedPatterns = [
      /child\s*(porn|abuse|exploitation)/gi,
      /illegal\s*(drugs|weapons|firearms)/gi,
      /human\s*trafficking/gi,
      /terrorist/gi,
      /bomb\s*(making|instructions)/gi
    ];
    
    for (const pattern of prohibitedPatterns) {
      if (pattern.test(content)) {
        return res.status(400).json({
          error: 'Content violation',
          message: 'Content violates community guidelines'
        });
      }
    }
  }
  
  next();
};

/**
 * File upload security middleware
 */
export const validateFileUpload = (req: RequestWithFile, res: Response, next: NextFunction) => {
  if (req.file) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'application/json'
    ];
    
    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: 'File type not allowed'
      });
    }
    
    // Check file size (5MB limit)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        error: 'File too large',
        message: 'File size exceeds 5MB limit'
      });
    }
  }
  
  next();
};

/**
 * IP whitelist middleware (for admin endpoints)
 */
export const ipWhitelist = (allowedIPs: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    
    if (allowedIPs.includes('*') || allowedIPs.includes(clientIP || '')) {
      next();
    } else {
      console.warn(`Blocked request from IP: ${clientIP}`);
      res.status(403).json({
        error: 'Forbidden',
        message: 'IP address not allowed'
      });
    }
  };
};

/**
 * SQL injection prevention middleware
 */
export const preventSQLInjection = (req: Request, res: Response, next: NextFunction) => {
  const sqlPatterns = [
    /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
    /(--|\/\*|\*\/|;|'|"|`)/g,
    /(\bOR\b|\bAND\b).*?[=<>]/gi
  ];
  
  const checkValue = (value: any): boolean => {
    if (typeof value === 'string') {
      return sqlPatterns.some(pattern => pattern.test(value));
    }
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(checkValue);
    }
    return false;
  };
  
  if (req.query && checkValue(req.query)) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Potentially malicious input detected'
    });
  }
  
  if (req.body && checkValue(req.body)) {
    return res.status(400).json({
      error: 'Invalid input',
      message: 'Potentially malicious input detected'
    });
  }
  
  next();
};

/**
 * Security audit logging
 */
export const auditLog = (action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user;
    const logEntry = {
      timestamp: new Date().toISOString(),
      action,
      userId: user?.id,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      method: req.method
    };
    
    // In production, send to security monitoring service
    console.log('Security Audit:', logEntry);
    
    next();
  };
};
