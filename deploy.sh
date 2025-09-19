#!/bin/bash

# PromptOps VPS Deployment Script
# Run this script on your VPS to set up the production environment

set -e

echo "🚀 Starting PromptOps deployment..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
echo "📦 Installing Node.js..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2 for process management
echo "📦 Installing PM2..."
sudo npm install -g pm2

# Install PostgreSQL (if not using external database)
echo "📦 Installing PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Install Nginx
echo "📦 Installing Nginx..."
sudo apt install nginx -y
sudo systemctl start nginx
sudo systemctl enable nginx

# Install Certbot for SSL
echo "📦 Installing Certbot for SSL..."
sudo apt install certbot python3-certbot-nginx -y

# Create application directory
echo "📁 Setting up application directory..."
sudo mkdir -p /var/www/promptops
sudo chown -R $USER:$USER /var/www/promptops

# Clone repository (replace with your repo URL)
echo "📥 Cloning repository..."
cd /var/www/promptops
git clone https://github.com/your-username/promptops.git .

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🏗️  Building application..."
npm run build

# Copy environment file
echo "⚙️  Setting up environment..."
cp .env.prod.template .env.production
echo "⚠️  Please edit .env.production with your actual values"

# Create PM2 ecosystem file
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'promptops',
    script: './server/index.ts',
    interpreter: 'node',
    interpreter_args: '--loader tsx',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development',
      PORT: 3000
    },
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
EOL

# Create logs directory
mkdir -p logs

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/promptops << EOL
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    
    # Serve static files
    location / {
        root /var/www/promptops/client/dist;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)\$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Enable gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json application/xml+rss application/atom+xml image/svg+xml;
}
EOL

# Enable the site
sudo ln -sf /etc/nginx/sites-available/promptops /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

echo "✅ Basic setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit /var/www/promptops/.env.production with your actual values"
echo "2. Set up your database and run migrations"
echo "3. Start the application: pm2 start ecosystem.config.js --env production"
echo "4. Set up SSL: sudo certbot --nginx -d your-domain.com -d www.your-domain.com"
echo "5. Save PM2 configuration: pm2 save && pm2 startup"
echo ""
echo "🎉 PromptOps is ready for production!"
