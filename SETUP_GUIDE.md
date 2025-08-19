# Oxlas Setup Guide

This guide explains how to create the necessary files and directories that aren't exported to GitHub but are required for the Oxlas productivity suite to function properly.

## 📁 Required Directories to Create

### 1. Database Directory
```bash
mkdir -p db
```

### 2. SSL Certificates Directory
```bash
mkdir -p ssl
```

### 3. Data Storage Directory
```bash
mkdir -p data
```

### 4. Docker Volumes Directory
```bash
mkdir -p volumes
```

### 5. Sessions Directory
```bash
mkdir -p sessions
```

### 6. Uploads Directory
```bash
mkdir -p uploads
```

## 🔧 Required Files to Create

### 1. Environment Configuration File (.env)

Create a `.env` file in the project root:

```bash
# Database Configuration
DATABASE_URL="file:./db/custom.db"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-here"
NEXTAUTH_URL="http://localhost:3000"

# AI Service Configuration (Ollama)
OLLAMA_BASE_URL="http://localhost:11434"

# External Service URLs
PLANKA_URL="http://localhost:10240"
ONLYOFFICE_URL="http://localhost:8002"
JITSI_URL="http://localhost:8000"
NEXTCLOUD_URL="http://localhost:8001"

# Email Configuration
SMTP_HOST="localhost"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASS="your-email-password"

# Security
JWT_SECRET="your-jwt-secret-here"
ENCRYPTION_KEY="your-encryption-key-here"

# Domain Configuration
DOMAIN="localhost"
SSL_ENABLED="false"
```

### 2. SSL Certificates (for production)

Create self-signed SSL certificates for development:

```bash
# Generate private key
openssl genrsa -out ssl/server.key 2048

# Generate certificate signing request
openssl req -new -key ssl/server.key -out ssl/server.csr

# Generate self-signed certificate
openssl x509 -req -days 365 -in ssl/server.csr -signkey ssl/server.key -out ssl/server.crt
```

### 3. Database Initialization

The database will be automatically created when you run:

```bash
npm run db:push
```

### 4. Docker Volume Setup

Create necessary Docker volumes:

```bash
# Create directories for Docker volumes
mkdir -p volumes/postgres_data
mkdir -p volumes/redis_data
mkdir -p volumes/nextcloud_data
mkdir -p volumes/onlyoffice_data
mkdir -p volumes/planka_data
mkdir -p volumes/jitsi_data
```

## 🚀 Setup Commands

Run these commands in order to set up everything:

```bash
# 1. Create all required directories
mkdir -p db ssl data volumes sessions uploads
mkdir -p volumes/postgres_data volumes/redis_data volumes/nextcloud_data
mkdir -p volumes/onlyoffice_data volumes/planka_data volumes/jitsi_data

# 2. Set proper permissions
chmod 755 db ssl data volumes sessions uploads
chmod 755 volumes/*

# 3. Create environment file (copy the template above)
touch .env

# 4. Install dependencies
npm install

# 5. Push database schema
npm run db:push

# 6. Generate SSL certificates (for development)
openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes

# 7. Start development server
npm run dev
```

## 🔍 Health Check

After setup, run the health check script to verify everything is working:

```bash
chmod +x health-check.sh
./health-check.sh
```

## 📋 Directory Structure After Setup

```
oxlas/
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── db/
│   └── custom.db          # SQLite database (auto-created)
├── ssl/
│   ├── server.key         # SSL private key
│   └── server.crt         # SSL certificate
├── data/                  # Application data
├── volumes/
│   ├── postgres_data/     # PostgreSQL data
│   ├── redis_data/        # Redis data
│   ├── nextcloud_data/    # Nextcloud data
│   ├── onlyoffice_data/   # OnlyOffice data
│   ├── planka_data/       # Planka data
│   └── jitsi_data/        # Jitsi data
├── sessions/              # Session files
├── uploads/               # File uploads
└── src/                   # Source code
```

## ⚠️ Important Notes

1. **Security**: Never commit `.env` files or SSL certificates to version control
2. **Permissions**: Ensure proper file permissions for security
3. **Backups**: Regularly backup your `db/` and `data/` directories
4. **Production**: Use proper SSL certificates from a trusted CA in production
5. **Database**: The database file will be created automatically when you run `npm run db:push`

## 🔧 Troubleshooting

### Common Issues:

1. **Permission Denied**: Run `chmod 755` on the created directories
2. **Database Connection Error**: Ensure `.env` file has correct `DATABASE_URL`
3. **SSL Certificate Issues**: Regenerate certificates using the commands above
4. **Docker Volume Issues**: Ensure Docker is running and volumes are properly mounted

### Getting Help:

- Check the `DEPLOYMENT.md` for detailed deployment instructions
- Run `./health-check.sh` to diagnose issues
- Review logs in `dev.log` for error messages

---

**Next Steps**: After completing this setup, you can proceed with the Phase 2 development in the new window. The `phase2-development` branch is ready and pushed to GitHub with all the current changes.