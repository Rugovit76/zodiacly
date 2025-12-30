# 🖥️ VPS Deployment Guide - Traditional Web Server

## ⚠️ NAPOMENA
Ovo je **napredna opcija** za deployment na klasičan web server (VPS).

**Vercel je MNOGO lakši!** Ali ako želiš potpunu kontrolu, evo kako:

---

## 📋 Šta Ti Treba

### Hardware Requirements
- **CPU:** 2+ cores
- **RAM:** 2GB+ (preporučeno 4GB)
- **Storage:** 20GB+ SSD
- **OS:** Ubuntu 22.04 LTS (preporučeno)

### Software Requirements
- Node.js 18+
- PostgreSQL 14+
- Nginx (web server)
- PM2 (process manager)
- Certbot (SSL certificates)

---

## KORAK 1: Server Setup

### A) Connect to VPS
```bash
ssh root@YOUR_SERVER_IP
```

### B) Update System
```bash
apt update && apt upgrade -y
```

### C) Install Node.js
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Verify
node -v  # Should show v20.x
npm -v
```

### D) Install PostgreSQL
```bash
# Install
apt install -y postgresql postgresql-contrib

# Start service
systemctl start postgresql
systemctl enable postgresql

# Verify
sudo -u postgres psql --version
```

### E) Install Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### F) Install PM2
```bash
npm install -g pm2
```

---

## KORAK 2: Setup PostgreSQL Database

### A) Create Database User
```bash
sudo -u postgres psql

# U PostgreSQL prompt:
CREATE USER zodiacly WITH PASSWORD 'STRONG_PASSWORD_HERE';
CREATE DATABASE zodiacly OWNER zodiacly;
GRANT ALL PRIVILEGES ON DATABASE zodiacly TO zodiacly;
\q
```

### B) Configure Remote Access (if needed)
```bash
# Edit postgresql.conf
nano /etc/postgresql/14/main/postgresql.conf

# Change:
listen_addresses = 'localhost'  # Or '*' for remote access

# Edit pg_hba.conf
nano /etc/postgresql/14/main/pg_hba.conf

# Add:
host    zodiacly    zodiacly    127.0.0.1/32    md5

# Restart
systemctl restart postgresql
```

### C) Test Connection
```bash
psql -h localhost -U zodiacly -d zodiacly
# Enter password when prompted
```

---

## KORAK 3: Deploy Application

### A) Create App User
```bash
adduser zodiacly
usermod -aG sudo zodiacly
su - zodiacly
```

### B) Clone Repository
```bash
cd /home/zodiacly
git clone https://github.com/YOUR_USERNAME/zodiacly.git
cd zodiacly
```

### C) Install Dependencies
```bash
npm install
```

### D) Create .env File
```bash
nano .env
```

Paste:
```env
# Database
DATABASE_URL="postgresql://zodiacly:YOUR_PASSWORD@localhost:5432/zodiacly"

# App
NEXT_PUBLIC_APP_URL="https://zodiacly.online"
JWT_SECRET="YOUR_JWT_SECRET"

# Stripe (TEST mode initially)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PRICE_PRO_MONTHLY="price_test_..."
STRIPE_PRICE_PRO_YEARLY="price_test_..."

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# AI Limits
FREE_PLAN_AI_CALLS_PER_MONTH=1
PRO_PLAN_AI_CALLS_PER_MONTH=100

# Cron Secret
CRON_SECRET="YOUR_CRON_SECRET"
```

Save: `Ctrl+X`, `Y`, `Enter`

### E) Setup Database
```bash
npx prisma db push
npx prisma generate
npm run db:seed
```

### F) Build Application
```bash
npm run build
```

---

## KORAK 4: PM2 Process Manager

### A) Create PM2 Config
```bash
nano ecosystem.config.js
```

Paste:
```javascript
module.exports = {
  apps: [{
    name: 'zodiacly',
    script: 'npm',
    args: 'start',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G',
  }]
}
```

### B) Create Logs Directory
```bash
mkdir -p logs
```

### C) Start Application
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup  # Follow instructions to enable on boot
```

### D) Monitor
```bash
pm2 status
pm2 logs zodiacly
pm2 monit
```

---

## KORAK 5: Nginx Configuration

### A) Create Nginx Config
```bash
sudo nano /etc/nginx/sites-available/zodiacly
```

Paste:
```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name zodiacly.online www.zodiacly.online;

    return 301 https://$server_name$request_uri;
}

# HTTPS Configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name zodiacly.online www.zodiacly.online;

    # SSL Certificates (will be added by Certbot)
    ssl_certificate /etc/letsencrypt/live/zodiacly.online/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/zodiacly.online/privkey.pem;

    # SSL Configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Logging
    access_log /var/log/nginx/zodiacly-access.log;
    error_log /var/log/nginx/zodiacly-error.log;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;

        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Stripe Webhooks (longer timeout)
    location /api/stripe/webhooks {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_connect_timeout 120s;
        proxy_send_timeout 120s;
        proxy_read_timeout 120s;
    }

    # Static files caching
    location /_next/static {
        proxy_pass http://localhost:3000;
        proxy_cache_valid 200 365d;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

### B) Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/zodiacly /etc/nginx/sites-enabled/
sudo nginx -t  # Test configuration
sudo systemctl reload nginx
```

---

## KORAK 6: SSL Certificate (Let's Encrypt)

### A) Install Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

### B) Get Certificate
```bash
sudo certbot --nginx -d zodiacly.online -d www.zodiacly.online
```

Follow prompts:
- Enter email
- Agree to terms
- Choose redirect option

### C) Test Auto-Renewal
```bash
sudo certbot renew --dry-run
```

Certbot će automatski obnoviti certificate svaka 3 meseca.

---

## KORAK 7: Firewall Setup

```bash
# Allow SSH
sudo ufw allow 22/tcp

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
sudo ufw status
```

---

## KORAK 8: Cron Jobs for Horoscopes

### A) Create Cron Script
```bash
nano /home/zodiacly/scripts/generate-horoscopes.sh
```

Paste:
```bash
#!/bin/bash

# Daily Horoscopes (2 AM UTC)
curl -X POST "https://zodiacly.online/api/cron/generate-horoscopes?type=daily&secret=YOUR_CRON_SECRET"

# Weekly Horoscopes (3 AM UTC Monday)
if [ $(date +%u) -eq 1 ]; then
    curl -X POST "https://zodiacly.online/api/cron/generate-horoscopes?type=weekly&secret=YOUR_CRON_SECRET"
fi
```

Make executable:
```bash
chmod +x /home/zodiacly/scripts/generate-horoscopes.sh
```

### B) Add to Crontab
```bash
crontab -e
```

Add:
```cron
# Daily horoscopes at 2 AM UTC
0 2 * * * /home/zodiacly/scripts/generate-horoscopes.sh >> /home/zodiacly/logs/cron.log 2>&1
```

---

## KORAK 9: Monitoring & Logs

### A) Application Logs
```bash
pm2 logs zodiacly
tail -f /home/zodiacly/zodiacly/logs/out.log
```

### B) Nginx Logs
```bash
tail -f /var/log/nginx/zodiacly-access.log
tail -f /var/log/nginx/zodiacly-error.log
```

### C) System Resources
```bash
pm2 monit
htop
```

---

## KORAK 10: Backup Strategy

### A) Database Backup Script
```bash
nano /home/zodiacly/scripts/backup-db.sh
```

Paste:
```bash
#!/bin/bash
BACKUP_DIR="/home/zodiacly/backups"
DATE=$(date +%Y-%m-%d_%H-%M-%S)
PGPASSWORD="YOUR_DB_PASSWORD" pg_dump -h localhost -U zodiacly zodiacly > "$BACKUP_DIR/zodiacly-$DATE.sql"

# Keep only last 7 days
find $BACKUP_DIR -name "zodiacly-*.sql" -mtime +7 -delete
```

Make executable:
```bash
chmod +x /home/zodiacly/scripts/backup-db.sh
mkdir -p /home/zodiacly/backups
```

Add to crontab:
```cron
# Daily backup at 4 AM
0 4 * * * /home/zodiacly/scripts/backup-db.sh
```

---

## 🔄 Deployment Updates

Kada imaš novu verziju:

```bash
cd /home/zodiacly/zodiacly
git pull origin main
npm install
npm run build
pm2 restart zodiacly
```

---

## 🆘 TROUBLESHOOTING

### App Won't Start
```bash
# Check logs
pm2 logs zodiacly --lines 100

# Common issues:
- PORT already in use
- Database connection failed
- Missing env variables
```

### Database Connection Issues
```bash
# Test connection
psql -h localhost -U zodiacly -d zodiacly

# Check PostgreSQL status
systemctl status postgresql

# Check logs
tail -f /var/log/postgresql/postgresql-14-main.log
```

### Nginx Issues
```bash
# Test config
sudo nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Restart
sudo systemctl restart nginx
```

---

## 💰 VPS Costs

### Recommended VPS Providers:
- **DigitalOcean:** $12/mo (2GB RAM droplet)
- **Vultr:** $12/mo (2GB RAM)
- **Linode:** $12/mo (2GB RAM)
- **Hetzner:** €4.49/mo (2GB RAM, EU)

### Total Monthly Cost:
- VPS: ~$10-15/mo
- Domain: ~$10-15/year
- **Total:** ~$10-15/mo + one-time $10-15 za domen

---

## ✅ PREDNOSTI VPS-a
- Potpuna kontrola
- Fiksna cena
- Bez vendor lock-in
- Možeš hostovati više projekata

## ❌ MANE VPS-a
- Moraš maintain server
- Security updates ručno
- No auto-scaling
- Kompleksniji setup
- Potrebno Linux znanje

---

**VPS je bolja opcija ako:** Imaš iskustvo sa serverima i želiš punu kontrolu!

**Vercel je bolja opcija ako:** Želiš brz deployment bez maintenance!
