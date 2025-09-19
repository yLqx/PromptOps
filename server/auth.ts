import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import { storage } from "./storage";
import { User as SelectUser } from "@shared/schema";
import 'dotenv/config';

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || 'demo-secret-key-for-development',
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await storage.verifyPassword(user.email, password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      if (!user) {
        return done(null, false);
      }
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  app.post("/api/register", async (req, res, next) => {
    const existingUser = await storage.getUserByUsername(req.body.username);
    if (existingUser) {
      return res.status(400).send("Username already exists");
    }

    const user = await storage.createUser({
      ...req.body,
      password: await hashPassword(req.body.password),
    });

    req.login(user, (err) => {
      if (err) return next(err);
      res.status(201).json(user);
    });
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.status(200).json(req.user);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const user = req.user;
    console.log('🔍 USER API - Current user data:', {
      id: user?.id,
      email: user?.email,
      plan: user?.plan,
      username: user?.username
    });

    res.json(req.user);
  });

  // Sync Supabase auth with server session
  app.post("/api/auth/sync-supabase", async (req, res) => {
    try {
      const { user_id, email } = req.body;
      const authHeader = req.headers.authorization;

      console.log('🔄 Auth sync request:', { user_id, email, hasAuthHeader: !!authHeader });

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'No auth token provided' });
      }

      const token = authHeader.split(' ')[1];

      // Get user data from our users table
      const user = await storage.getUser(user_id);
      if (!user) {
        console.error('❌ User not found in database:', user_id);
        return res.status(404).json({ error: 'User not found' });
      }

      console.log('✅ Found user in database:', user.email, 'Plan:', user.plan);

      // Establish server session by setting req.user
      req.login(user, (err) => {
        if (err) {
          console.error('Session establishment error:', err);
          return res.status(500).json({ error: 'Failed to establish session' });
        }

        console.log('✅ Auth sync successful for:', user.email, 'Plan:', user.plan);
        res.json({
          success: true,
          user: user,
          message: 'Session established'
        });
      });

    } catch (error: any) {
      console.error('Auth sync error:', error);
      res.status(500).json({ error: 'Auth sync failed' });
    }
  });

  // Debug endpoint to test auth sync
  app.post("/api/auth/debug-sync", async (req, res) => {
    try {
      // Hardcode the test user for debugging
      const user = await storage.getUser('0ba7f2bf-f6de-4301-b021-301654c02f2d');
      if (!user) {
        return res.status(404).json({ error: 'Test user not found' });
      }

      req.login(user, (err) => {
        if (err) {
          console.error('Debug session establishment error:', err);
          return res.status(500).json({ error: 'Failed to establish session' });
        }

        console.log('✅ Debug auth sync successful for:', user.email, 'Plan:', user.plan);
        res.json({
          success: true,
          user: user,
          message: 'Debug session established'
        });
      });

    } catch (error: any) {
      console.error('Debug auth sync error:', error);
      res.status(500).json({ error: 'Debug auth sync failed' });
    }
  });
}
