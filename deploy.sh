#!/bin/bash
set -e

echo "=== SansanFox GEO Deployment Start ==="

# Install Node.js 22 if not present
if ! command -v node &> /dev/null || [[ $(node -v | cut -d. -f1 | sed 's/v//') -lt 18 ]]; then
  echo "Installing Node.js 22..."
  curl -fsSL https://rpm.nodesource.com/setup_22.x | bash -
  yum install -y nodejs
fi

echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Install PostgreSQL if not present
if ! command -v psql &> /dev/null; then
  echo "Installing PostgreSQL 15..."
  yum install -y https://download.postgresql.org/pub/repos/yum/reporpms/EL-7-x86_64/pgdg-redhat-repo-latest.noarch.rpm
  yum install -y postgresql15-server postgresql15
  /usr/pgsql-15/bin/postgresql-15-setup initdb
  systemctl enable postgresql-15
  systemctl start postgresql-15
fi

# Install Redis if not present
if ! command -v redis-cli &> /dev/null; then
  echo "Installing Redis..."
  yum install -y epel-release
  yum install -y redis
  systemctl enable redis
  systemctl start redis
fi

# Create database
echo "Setting up database..."
sudo -u postgres psql -c "CREATE DATABASE sansanfox_geo;" 2>/dev/null || echo "Database may already exist"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"

# Clone or update repo
DEPLOY_DIR="/var/www/sansanfox-geo"
if [ -d "$DEPLOY_DIR" ]; then
  echo "Updating existing deployment..."
  cd "$DEPLOY_DIR" && git pull
else
  echo "Cloning repository..."
  git clone https://github.com/2584894611-debug/sansanfox-geo.git "$DEPLOY_DIR"
fi

cd "$DEPLOY_DIR"

# Install dependencies
echo "Installing dependencies..."
npm install

# Configure environment
if [ ! -f .env.local ]; then
  cat > .env.local << 'ENVEOF'
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sansanfox_geo?schema=public"
NEXTAUTH_SECRET="sansanfox-geo-prod-secret-2026-xyz"
NEXTAUTH_URL="https://xhpj.cloud"
REDIS_URL="redis://localhost:6379"

DOUBAO_API_KEY=""
DOUBAO_API_URL=""
DOUBAO_MODEL="doubao-seed-1-6"

DEEPSEEK_API_KEY="sk-8914498a0fff48e793153ab852a38ae5"
DEEPSEEK_API_URL="https://api.deepseek.com/chat/completions"
DEEPSEEK_MODEL="deepseek-chat"

QWEN_API_KEY="sk-d0153f093a134ab19f198830cf36e664"
QWEN_API_URL="https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions"
QWEN_MODEL="qwen-plus"
ENVEOF
fi

# Setup database schema
echo "Running database migrations..."
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/sansanfox_geo?schema=public" npx prisma migrate deploy

# Build
echo "Building application..."
npm run build

# Stop old process if running
pm2 delete sansanfox-geo 2>/dev/null || true

# Install PM2 if needed
if ! command -v pm2 &> /dev/null; then
  npm install -g pm2
fi

# Start with PM2
echo "Starting application..."
pm2 start npm --name "sansanfox-geo" -- start -- -p 3000
pm2 save
pm2 startup 2>/dev/null || true

# Configure Nginx
echo "Configuring Nginx..."
cat > /etc/nginx/conf.d/sansanfox.conf << 'NGINXEOF'
server {
    listen 80;
    server_name xhpj.cloud www.xhpj.cloud;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

# Test and reload nginx
nginx -t && nginx -s reload

echo ""
echo "=== Deployment Complete! ==="
echo "Visit: https://xhpj.cloud"
echo "Status: $(pm2 status)"
