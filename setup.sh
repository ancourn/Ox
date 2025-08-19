#!/bin/bash

# Oxlas Setup Script
# This script creates all necessary directories and files that aren't in GitHub

set -e

echo "🚀 Setting up Oxlas productivity suite..."

# Create required directories
echo "📁 Creating directories..."
mkdir -p db ssl data volumes sessions uploads
mkdir -p volumes/postgres_data volumes/redis_data volumes/nextcloud_data
mkdir -p volumes/onlyoffice_data volumes/planka_data volumes/jitsi_data

# Set proper permissions
echo "🔐 Setting permissions..."
chmod 755 db ssl data volumes sessions uploads
chmod 755 volumes/*

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cat > .env << EOF
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
EOF
    echo "✅ .env file created. Please update it with your actual configuration."
else
    echo "ℹ️ .env file already exists."
fi

# Generate SSL certificates
echo "🔒 Generating SSL certificates..."
openssl req -x509 -newkey rsa:4096 -keyout ssl/server.key -out ssl/server.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Push database schema
echo "💾 Pushing database schema..."
npm run db:push

# Make health check script executable
chmod +x health-check.sh

echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Review and update .env file with your configuration"
echo "2. Run './health-check.sh' to verify setup"
echo "3. Start development server with 'npm run dev'"
echo ""
echo "🔗 You're now ready for Phase 2 development!"