#!/usr/bin/env node
// Simple development server starter to avoid npm disk space issues

import { spawn } from 'child_process';
import path from 'path';

// Set environment variables
process.env.NODE_ENV = 'development';

// Start the server directly with tsx
const serverProcess = spawn('npx', ['tsx', 'server/index.ts'], {
  stdio: 'inherit',
  cwd: process.cwd(),
  env: process.env
});

serverProcess.on('error', (error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

serverProcess.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\nShutting down server...');
  serverProcess.kill('SIGTERM');
});

console.log('🚀 Starting PromptOps development server...');
console.log('📍 Server will be available at http://localhost:5000');
console.log('🛑 Press Ctrl+C to stop the server');
