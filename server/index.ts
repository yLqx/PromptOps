import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import {
  securityHeaders,
  requestLogger,
  validateInput,
  skipStaticAssets,
  preventSQLInjection
} from "./middleware/security";
import { supabaseAuth } from "./supabase-auth";
import { supabase } from "./supabase";
import { setupAdminRoutes } from "./admin-routes";
import { initializeAdminUser } from "./admin-auth";
import cookieParser from "cookie-parser";

const app = express();

// Security middleware
app.use(securityHeaders);
app.use(skipStaticAssets);
app.use(requestLogger);
app.use(preventSQLInjection);
app.use(validateInput);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // Add cookie parser for admin authentication
app.use(supabaseAuth);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize admin user
  await initializeAdminUser();

  // Register all routes
  const server = await registerRoutes(app);

  // Setup admin routes
  setupAdminRoutes(app);
  
  // Temporary admin endpoint to update user plan
  app.post('/api/admin/update-plan', async (req, res) => {
    try {
      const { email, plan } = req.body;
      if (!email || !plan) {
        return res.status(400).json({ error: 'Email and plan are required' });
      }
      
      const { data, error } = await supabase
        .from('users')
        .update({ plan })
        .eq('email', email)
        .select();
      
      if (error) {
        console.error('Error updating user plan:', error);
        return res.status(500).json({ error: 'Failed to update plan' });
      }
      
      res.json({ success: true, user: data[0] });
    } catch (error) {
      console.error('Error in update-plan endpoint:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  const host = process.env.HOST || "127.0.0.1";
  server.listen({
    port,
    host, // Use HOST from environment or default to 127.0.0.1
  }, () => {
    log(`serving on ${host}:${port}`);
  });
  })();
