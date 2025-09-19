# PromptOps VPS Deployment Guide

This guide will walk you through deploying PromptOps to a VPS (Virtual Private Server) for production use.

## Prerequisites

- VPS with Ubuntu 20.04+ or Debian 10+ (minimum 2GB RAM, 20GB storage)
- Domain name pointing to your VPS IP address
- SSH access to your VPS
- Basic knowledge of Linux command line

## Quick Deployment (Automated)

1. **Upload the deployment script to your VPS:**
   ```bash
   scp deploy.sh user@your-vps-ip:~/
   ```

2. **SSH into your VPS and run the script:**
   ```bash
   ssh user@your-vps-ip
   chmod +x deploy.sh
   ./deploy.sh
   ```

3. **Configure your environment variables:**
   ```bash
   cd /var/www/promptops
   nano .env.production
   ```

4. **Start the application:**
   ```bash
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

## Manual Deployment (Step by Step)

### Step 1: VPS Setup

1. **Update your system:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js 18.x:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install required tools:**
   ```bash
   sudo npm install -g pm2
   sudo apt install nginx postgresql postgresql-contrib git -y
   ```

### Step 2: Database Setup

1. **Configure PostgreSQL:**
   ```bash
   sudo -u postgres psql
   CREATE DATABASE promptops;
   CREATE USER promptops_user WITH ENCRYPTED PASSWORD 'your_secure_password';
   GRANT ALL PRIVILEGES ON DATABASE promptops TO promptops_user;
   \q
   ```

2. **Update PostgreSQL configuration:**
   ```bash
   sudo nano /etc/postgresql/12/main/pg_hba.conf
   # Add: local   promptops    promptops_user                     md5
   sudo systemctl restart postgresql
   ```

### Step 3: Application Deployment

1. **Create application directory:**
   ```bash
   sudo mkdir -p /var/www/promptops
   sudo chown -R $USER:$USER /var/www/promptops
   cd /var/www/promptops
   ```

2. **Clone your repository:**
   ```bash
   git clone https://github.com/your-username/promptops.git .
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.prod.template .env.production
   nano .env.production
   ```

   Update with your production values:
   ```env
   DATABASE_URL=postgresql://promptops_user:your_secure_password@localhost:5432/promptops
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   DOMAIN=your-domain.com
   NODE_ENV=production
   PORT=3000
   ```

5. **Run database migrations (if any):**
   ```bash
   npm run db:migrate
   ```

6. **Build the application:**
   ```bash
   npm run build
   ```

### Step 4: Process Management with PM2

1. **Create PM2 ecosystem file:**
   ```bash
   cat > ecosystem.config.js << EOF
   module.exports = {
     apps: [{
       name: 'promptops',
       script: './server/index.ts',
       interpreter: 'node',
       interpreter_args: '--loader tsx',
       instances: 'max',
       exec_mode: 'cluster',
       env_production: {
         NODE_ENV: 'production',
         PORT: 3000
       },
       error_file: './logs/err.log',
       out_file: './logs/out.log',
       log_file: './logs/combined.log',
       time: true
     }]
   }
   EOF
   ```

2. **Start the application:**
   ```bash
   mkdir -p logs
   pm2 start ecosystem.config.js --env production
   pm2 save
   pm2 startup
   ```

### Step 5: Nginx Configuration

1. **Create Nginx site configuration:**
   ```bash
   sudo nano /etc/nginx/sites-available/promptops
   ```

   Add the following configuration:
   ```nginx
   server {
       listen 80;
       server_name your-domain.com www.your-domain.com;
       
       # Serve static files
       location / {
           root /var/www/promptops/client/dist;
           try_files $uri $uri/ /index.html;
           
           # Cache static assets
           location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
               expires 1y;
               add_header Cache-Control "public, immutable";
           }
       }
       
       # API proxy
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header Referrer-Policy "no-referrer-when-downgrade" always;
       
       # Enable gzip compression
       gzip on;
       gzip_vary on;
       gzip_min_length 1024;
       gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
   }
   ```

2. **Enable the site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/promptops /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

### Step 6: SSL Configuration

1. **Install Certbot:**
   ```bash
   sudo apt install certbot python3-certbot-nginx -y
   ```

2. **Get SSL certificate:**
   ```bash
   sudo certbot --nginx -d your-domain.com -d www.your-domain.com
   ```

3. **Set up auto-renewal:**
   ```bash
   sudo crontab -e
   # Add: 0 12 * * * /usr/bin/certbot renew --quiet
   ```

### Step 7: Security Hardening

1. **Set up firewall:**
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow 'Nginx Full'
   sudo ufw enable
   ```

2. **Configure fail2ban:**
   ```bash
   sudo apt install fail2ban -y
   sudo systemctl enable fail2ban
   ```

## Monitoring and Maintenance

### PM2 Commands
```bash
pm2 status              # Check application status
pm2 logs promptops      # View logs
pm2 restart promptops   # Restart application
pm2 reload promptops    # Zero-downtime reload
pm2 stop promptops      # Stop application
pm2 monit              # Monitor resources
```

### Database Backup
```bash
# Create backup
pg_dump -U promptops_user -h localhost promptops > backup_$(date +%Y%m%d_%H%M%S).sql

# Restore backup
psql -U promptops_user -h localhost promptops < backup_file.sql
```

### Update Deployment
```bash
cd /var/www/promptops
git pull origin main
npm install
npm run build
pm2 reload promptops
```

## Troubleshooting

### Common Issues

1. **Application won't start:**
   - Check PM2 logs: `pm2 logs promptops`
   - Verify environment variables in `.env.production`
   - Check database connectivity

2. **502 Bad Gateway:**
   - Ensure PM2 process is running: `pm2 status`
   - Check Nginx configuration: `sudo nginx -t`
   - Verify port 3000 is not blocked

3. **SSL Certificate Issues:**
   - Verify domain DNS is pointing to your VPS
   - Check Certbot logs: `sudo certbot certificates`

### Performance Optimization

1. **Enable Redis caching:**
   ```bash
   sudo apt install redis-server -y
   # Update your application to use Redis for session storage
   ```

2. **Database optimization:**
   - Set up connection pooling
   - Add database indexes for frequently queried fields
   - Configure PostgreSQL performance settings

3. **Monitor resources:**
   ```bash
   htop                    # CPU and memory usage
   df -h                   # Disk usage
   pm2 monit              # Application monitoring
   ```

## Cost Estimation

**VPS Requirements:**
- Basic: 2GB RAM, 2 CPU cores, 40GB SSD (~$10-20/month)
- Recommended: 4GB RAM, 2 CPU cores, 80GB SSD (~$20-40/month)
- High Traffic: 8GB RAM, 4 CPU cores, 160GB SSD (~$40-80/month)

**Additional Services:**
- Domain name: ~$10-15/year
- SSL certificate: Free with Let's Encrypt
- Database backup storage: ~$5-10/month
- Monitoring service: ~$10-20/month (optional)

## Security Checklist

- [x] SSL certificate installed
- [x] Firewall configured
- [x] Fail2ban installed
- [x] Regular backups scheduled
- [x] Strong passwords used
- [x] SSH key authentication enabled
- [x] Database access restricted
- [x] Environment variables secured
- [x] Security headers configured
- [x] CORS properly configured

## Support

If you encounter issues during deployment, check:
1. Server logs: `pm2 logs promptops`
2. Nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. System logs: `sudo journalctl -f`

For additional help, consult the documentation or create an issue in the repository.
