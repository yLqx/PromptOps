import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { supabaseAdmin } from './supabase';
import type { Request, Response, NextFunction } from 'express';

export interface AdminUser {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'super_admin';
  permissions: Record<string, boolean>;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface AdminSession {
  id: string;
  admin_id: string;
  session_token: string;
  expires_at: string;
  created_at: string;
}

export class AdminAuthService {
  private static readonly SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateSessionToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  static async createAdmin(email: string, password: string, fullName?: string, role: 'admin' | 'super_admin' = 'admin'): Promise<AdminUser> {
    const passwordHash = await this.hashPassword(password);
    
    const { data, error } = await supabaseAdmin
      .from('admin_users')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        role,
        permissions: {
          users: true,
          community: role === 'super_admin',
          ai_models: role === 'super_admin',
          system: role === 'super_admin'
        }
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  static async login(email: string, password: string, ipAddress?: string): Promise<{ admin: AdminUser; sessionToken: string }> {
    try {
      console.log('🔐 Admin login attempt for:', email);

      // Get admin user
      const { data: admin, error: adminError } = await supabaseAdmin
        .from('admin_users')
        .select('*')
        .eq('email', email)
        .single();

      if (adminError || !admin) {
        console.log('❌ Admin not found:', adminError?.message);
        throw new Error('Invalid credentials');
      }

      console.log('✅ Admin found:', admin.email);

      // Verify password
      const isValidPassword = await this.verifyPassword(password, admin.password_hash);
      if (!isValidPassword) {
        console.log('❌ Invalid password for admin:', email);
        throw new Error('Invalid credentials');
      }

      console.log('✅ Password verified for admin:', email);

      // Create session
      const sessionToken = this.generateSessionToken();
      const expiresAt = new Date(Date.now() + this.SESSION_DURATION);

      console.log('🎫 Creating session for admin:', admin.id);

      const { error: sessionError } = await supabaseAdmin
        .from('admin_sessions')
        .insert({
          admin_id: admin.id,
          session_token: sessionToken,
          expires_at: expiresAt.toISOString()
        });

      if (sessionError) {
        console.log('❌ Session creation failed:', sessionError.message);
        throw sessionError;
      }

      console.log('✅ Session created successfully');

    // Update last login
    await supabaseAdmin
      .from('admin_users')
      .update({ last_login: new Date().toISOString() })
      .eq('id', admin.id);

    // Log the login
    await this.logAction(admin.id, 'login', 'admin', admin.id, { ip_address: ipAddress });

      // Remove password hash from response
      const { password_hash, ...adminWithoutPassword } = admin;

      console.log('🎉 Admin login successful for:', email);

      return {
        admin: adminWithoutPassword,
        sessionToken
      };
    } catch (error) {
      console.error('❌ Admin login error:', error);
      throw error;
    }
  }

  static async validateSession(sessionToken: string): Promise<AdminUser | null> {
    try {
      const { data: session, error } = await supabaseAdmin
        .from('admin_sessions')
        .select(`
          *,
          admin_users (*)
        `)
        .eq('session_token', sessionToken)
        .gte('expires_at', new Date().toISOString())
        .single();

      if (error || !session || !session.admin_users) {
        console.log('Session validation failed:', error?.message || 'No session found');
        return null;
      }

      const { password_hash, ...adminWithoutPassword } = session.admin_users;
      return adminWithoutPassword;
    } catch (error) {
      console.error('Session validation error:', error);
      return null;
    }
  }

  static async logout(sessionToken: string): Promise<void> {
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .eq('session_token', sessionToken);
  }

  static async logAction(
    adminId: string,
    action: string,
    targetType?: string,
    targetId?: string,
    details?: any,
    ipAddress?: string
  ): Promise<void> {
    await supabaseAdmin
      .from('admin_logs')
      .insert({
        admin_id: adminId,
        action,
        target_type: targetType,
        target_id: targetId,
        details,
        ip_address: ipAddress
      });
  }

  static async cleanExpiredSessions(): Promise<void> {
    await supabaseAdmin
      .from('admin_sessions')
      .delete()
      .lt('expires_at', new Date().toISOString());
  }
}

// Middleware to require admin authentication
export const requireAdminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const sessionToken = authHeader?.replace('Bearer ', '') || req.cookies?.admin_session;

    console.log('🔍 Admin auth check:', {
      hasAuthHeader: !!authHeader,
      hasCookie: !!req.cookies?.admin_session,
      allCookies: req.cookies,
      sessionToken: sessionToken ? sessionToken.substring(0, 10) + '...' : 'none'
    });

    if (!sessionToken) {
      console.log('❌ No session token found');
      return res.status(401).json({ message: 'Admin authentication required' });
    }

    const admin = await AdminAuthService.validateSession(sessionToken);
    if (!admin) {
      console.log('❌ Session validation failed');
      return res.status(401).json({ message: 'Invalid or expired admin session' });
    }

    console.log('✅ Admin authenticated:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error);
    res.status(401).json({ message: 'Admin authentication failed' });
  }
};

// Middleware to require specific permissions
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const admin = req.admin;
    if (!admin || !admin.permissions[permission]) {
      return res.status(403).json({ message: `Permission '${permission}' required` });
    }
    next();
  };
};

// Initialize admin user if it doesn't exist
export const initializeAdminUser = async () => {
  try {
    const { data: existingAdmin } = await supabaseAdmin
      .from('admin_users')
      .select('id')
      .eq('email', 'dsmourad11@gmail.com')
      .single();

    if (!existingAdmin) {
      await AdminAuthService.createAdmin(
        'dsmourad11@gmail.com',
        '19668778',
        'Super Admin',
        'super_admin'
      );
      console.log('✅ Admin user created: dsmourad11@gmail.com');
    } else {
      // Update password if admin exists
      const passwordHash = await AdminAuthService.hashPassword('19668778');
      await supabaseAdmin
        .from('admin_users')
        .update({ password_hash: passwordHash })
        .eq('email', 'dsmourad11@gmail.com');
      console.log('✅ Admin user password updated');
    }
  } catch (error) {
    console.error('❌ Failed to initialize admin user:', error);
  }
};

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}
