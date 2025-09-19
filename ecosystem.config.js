module.exports = {
  apps: [{
    name: 'promptops',
    script: './server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 'max',
    exec_mode: 'cluster',
    watch: false,
    max_memory_restart: '1G',
    
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
    
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    
    // Logging
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true,
    
    // Auto restart configuration
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Health check
    health_check_grace_period: 3000,
    health_check_path: '/api/health',
    
    // Advanced settings
    merge_logs: true,
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    
    // Environment-specific overrides
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 3001
    }
  }]
}
