# 🚀 Oxlas Deployment Guide

This guide provides comprehensive instructions for deploying Oxlas in various environments.

## 📋 Prerequisites

### System Requirements
- **CPU**: 4+ cores recommended
- **RAM**: 8GB+ recommended
- **Storage**: 100GB+ SSD recommended
- **OS**: Ubuntu 20.04+ or Docker-compatible system
- **Network**: Public IP with domain name
- **SSL**: Valid SSL certificate (Let's Encrypt recommended)

### Software Requirements
- Docker and Docker Compose
- Git
- Node.js 18+ (for development)
- Domain name with DNS access

## 🔧 Database Setup

### ⚠️ Important Note
Database files are **NOT** included in the GitHub repository. You must create them manually before deployment.

### PostgreSQL Database Setup

```bash
# 1. Create database directory
mkdir -p db/postgres_data

# 2. Set environment variables
export POSTGRES_PASSWORD=yourstrongpassword
export POSTGRES_USER=oxlas
export POSTGRES_DB=oxlas

# 3. Start PostgreSQL temporarily for setup
docker run --name postgres-temp \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 5432:5432 \
  -v $(pwd)/db/postgres_data:/var/lib/postgresql/data \
  -d postgres:15-alpine

# 4. Wait for PostgreSQL to start
sleep 10

# 5. Create additional databases for services
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_planka;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_zammad;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_outline;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_matrix;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_formbricks;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_joplin;"

# 6. Stop and remove temporary container
docker stop postgres-temp
docker rm postgres-temp
```

### SQLite Database Setup (for Development)

```bash
# 1. Create database directory and file
mkdir -p db
touch db/custom.db

# 2. Install dependencies and set up Prisma
npm install
npx prisma generate
npx prisma db push
```

## 🌍 Environment Configuration

### Create `.env` File

```bash
# Copy the template
cp .env.example .env

# Edit the file with your values
nano .env
```

### Environment Variables

```env
# ===== DATABASE =====
POSTGRES_PASSWORD=yourstrongpassword
POSTGRES_USER=oxlas
POSTGRES_DB=oxlas

# ===== SERVICE SECRETS =====
# Generate these with: openssl rand -base64 32
PLANKA_CRYPTO_KEY=your_crypto_key_here
PLANKA_JWT_SECRET=your_jwt_secret_here
OUTLINE_SECRET_KEY=your_outline_secret_here
OUTLINE_UTILS_SECRET=your_outline_utils_secret_here
FORMBRICKS_SECRET=your_formbricks_secret_here
FORMBRICKS_ENCRYPTION_KEY=your_formbricks_encryption_key_here
MEILISEARCH_MASTER_KEY=your_meilisearch_key_here

# ===== STORAGE =====
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# ===== EMAIL SERVICES =====
POSTFIX_PASSWORD=youremailpassword

# ===== VIDEO CONFERENCING =====
JITSI_PASSWORD=yourjitsipassword

# ===== FRONTEND =====
FRONTEND_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000

# ===== AI SERVICES =====
AI_SERVICE_URL=http://ollama:11434
```

## 🐳 Docker Deployment

### 1. Clone Repository

```bash
git clone https://github.com/ancourn/Ox.git
cd Ox
```

### 2. Set Up Databases

Follow the database setup instructions above.

### 3. Configure Environment

Create and configure your `.env` file as shown above.

### 4. Start Services

```bash
# Development mode
npm run dev

# Production mode
docker-compose up -d
```

### 5. Verify Deployment

```bash
# Run health check
chmod +x health-check.sh
./health-check.sh

# Check individual services
docker-compose ps
docker-compose logs -f [service-name]
```

### 6. Access Oxlas

- **Main Application**: `http://localhost:3000`
- **API Gateway**: `http://localhost:3001`
- **Team (Planka)**: `http://localhost:10240`
- **Docs (OnlyOffice)**: `http://localhost:8002`
- **AI Assistant**: `http://localhost:3000/ai`

## 🔒 SSL Certificate Setup

### Using Let's Encrypt

```bash
# 1. Install Certbot
sudo apt update
sudo apt install certbot

# 2. Obtain SSL certificate
sudo certbot certonly --standalone -d yourdomain.com

# 3. Create SSL directory
mkdir -p ssl

# 4. Copy certificates
sudo cp /etc/letsencrypt/live/yourdomain.com/fullchain.pem ssl/
sudo cp /etc/letsencrypt/live/yourdomain.com/privkey.pem ssl/

# 5. Set permissions
sudo chown -R $USER:$USER ssl/
chmod 600 ssl/*
```

### Update Nginx Configuration

Edit `nginx.conf` to use SSL:

```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /etc/nginx/ssl/fullchain.pem;
    ssl_certificate_key /etc/nginx/ssl/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    
    # Proxy configuration
    location / {
        proxy_pass http://frontend:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Other location blocks...
}
```

## ☁️ Cloud Deployment

### AWS Deployment

#### 1. Launch EC2 Instance

```bash
# Create EC2 instance (Ubuntu 20.04)
aws ec2 run-instances \
  --image-id ami-0c55b159cbfafe1f0 \
  --instance-type t3.large \
  --key-name your-key-pair \
  --security-group-ids sg-1234567890abcdef0 \
  --subnet-id subnet-1234567890abcdef0 \
  --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=Oxlas}]'
```

#### 2. Set Up RDS Database

```bash
# Create RDS instance
aws rds create-db-instance \
  --db-instance-identifier oxlas-db \
  --db-instance-class db.t3.large \
  --engine postgres \
  --master-username oxlas \
  --master-user-password yourpassword \
  --allocated-storage 100 \
  --vpc-security-group-ids sg-1234567890abcdef0
```

#### 3. Deploy Application

```bash
# Connect to EC2 instance
ssh -i your-key-pair.pem ubuntu@ec2-ip-address

# Install Docker
sudo apt update
sudo apt install docker.io docker-compose

# Clone repository
git clone https://github.com/ancourn/Ox.git
cd Ox

# Set up environment
cp .env.example .env
nano .env

# Start services
docker-compose up -d
```

### Google Cloud Deployment

#### 1. Create Compute Engine Instance

```bash
# Create VM instance
gcloud compute instances create oxlas \
  --machine-type=e2-standard-4 \
  --image-family=ubuntu-2004-lts \
  --image-project=ubuntu-os-cloud \
  --tags=http-server,https-server
```

#### 2. Set Up Cloud SQL

```bash
# Create Cloud SQL instance
gcloud sql instances create oxlas-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-4-8192 \
  --region=us-central1
```

#### 3. Deploy Application

```bash
# Connect to instance
gcloud compute ssh oxlas

# Install Docker and deploy
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Clone and deploy
git clone https://github.com/ancourn/Ox.git
cd Ox
docker-compose up -d
```

### DigitalOcean Deployment

#### 1. Create Droplet

```bash
# Create Ubuntu 20.04 droplet
doctl compute droplet create oxlas \
  --size s-4vcpu-8gb \
  --image ubuntu-20-04-x64 \
  --region nyc3 \
  --enable-monitoring
```

#### 2. Set Up Managed Database

```bash
# Create PostgreSQL cluster
doctl databases create oxlas-db \
  --engine pg \
  --version 15 \
  --size db-s-4vcpu-8gb \
  --region nyc3 \
  --num-nodes 1
```

#### 3. Deploy Application

```bash
# Connect to droplet
ssh root@droplet-ip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Deploy application
git clone https://github.com/ancourn/Ox.git
cd Ox
docker-compose up -d
```

## 🔄 Service Management

### Docker Compose Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Restart specific service
docker-compose restart planka

# View service logs
docker-compose logs -f planka

# Scale services
docker-compose up -d --scale planka=2

# Update services
docker-compose pull
docker-compose up -d
```

### Health Monitoring

```bash
# Run comprehensive health check
./health-check.sh

# Check individual service health
docker-compose exec postgres pg_isready -U oxlas
curl -f http://localhost:3000/health
curl -f http://localhost:3001/api/health

# Monitor resource usage
docker stats
docker-compose top
```

### Backup and Restore

#### Database Backup

```bash
# Backup PostgreSQL
docker-compose exec postgres pg_dump -U oxlas oxlas > backup.sql

# Backup all databases
docker-compose exec postgres pg_dumpall -U oxlas > full_backup.sql

# Backup specific service database
docker-compose exec postgres pg_dump -U oxlas oxlas_planka > planka_backup.sql
```

#### Database Restore

```bash
# Restore database
docker-compose exec -i postgres psql -U oxlas oxlas < backup.sql

# Restore specific database
docker-compose exec -i postgres psql -U oxlas oxlas_planka < planka_backup.sql
```

#### File System Backup

```bash
# Backup data directories
tar -czf backup_$(date +%Y%m%d).tar.gz \
  db/postgres_data \
  nextcloud_data \
  ollama_data \
  config/

# Restore from backup
tar -xzf backup_20240101.tar.gz
```

## 🛠️ Troubleshooting

### Common Issues

#### 1. Database Connection Errors

```bash
# Check PostgreSQL status
docker-compose exec postgres pg_isready -U oxlas

# View database logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

#### 2. Service Not Starting

```bash
# Check service logs
docker-compose logs [service-name]

# Check resource usage
docker stats

# Restart service
docker-compose restart [service-name]
```

#### 3. SSL Certificate Issues

```bash
# Check certificate expiration
openssl x509 -in ssl/fullchain.pem -text -noout | grep "Not After"

# Renew certificate
sudo certbot renew

# Restart Nginx
docker-compose restart nginx
```

#### 4. Memory Issues

```bash
# Check memory usage
free -h
docker stats --format "table {{.Container}}\t{{.MemUsage}}"

# Increase memory limits in docker-compose.yml
services:
  postgres:
    mem_limit: 4g
```

### Performance Optimization

```bash
# Optimize PostgreSQL
docker-compose exec postgres psql -U oxlas -c "VACUUM ANALYZE;"
docker-compose exec postgres psql -U oxlas -c "REINDEX DATABASE oxlas;"

# Clear Docker cache
docker system prune -a

# Optimize storage
docker volume prune
```

## 🔒 Security Hardening

### Firewall Configuration

```bash
# Configure UFW
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# Docker security
sudo usermod -aG docker $USER
sudo chmod 600 /etc/docker/daemon.json
```

### Security Updates

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Update Docker images
docker-compose pull
docker-compose up -d

# Security scan
docker scan [image-name]
```

### Access Control

```bash
# Restrict Docker socket access
sudo chmod 660 /var/run/docker.sock
sudo chown root:docker /var/run/docker.sock

# Network isolation
docker network create --internal oxlas-internal
```

## 📊 Monitoring and Logging

### Application Monitoring

```bash
# View application logs
docker-compose logs -f frontend
docker-compose logs -f api-gateway

# Monitor performance
docker-compose exec frontend npm run analyze
```

### System Monitoring

```bash
# System resources
htop
df -h
free -h

# Docker monitoring
docker stats --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}\t{{.BlockIO}}"
```

### Log Management

```bash
# Centralized logging
docker-compose logs -t > app.log

# Log rotation
logrotate -f /etc/logrotate.d/docker

# Error monitoring
docker-compose logs --tail=100 | grep ERROR
```

## 🎯 Production Checklist

### Pre-Deployment

- [ ] Set up domain and DNS
- [ ] Configure SSL certificates
- [ ] Set up databases
- [ ] Configure environment variables
- [ ] Test locally
- [ ] Review security settings

### Deployment

- [ ] Clone repository to server
- [ ] Install Docker and dependencies
- [ ] Configure environment
- [ ] Start services
- [ ] Run health checks
- [ ] Set up monitoring
- [ ] Configure backups

### Post-Deployment

- [ ] Test all features
- [ ] Verify SSL configuration
- [ ] Set up alerting
- [ ] Configure logging
- [ ] Document deployment
- [ ] Train users

---

## 📞 Support

For deployment issues:
1. Check the troubleshooting section
2. Review service logs
3. Run health checks
4. Check GitHub issues
5. Contact support

**Oxlas Technologies Inc.** © 2025