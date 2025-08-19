# 🐂 Oxlas — Private. Branded. Powerful.

Oxlas is a fully open-source, self-hosted productivity suite that replaces Google Workspace with zero third-party branding.

## 🚀 Features

- **Email** (`you@yourcompany.com`) - Private email with custom domains
- **Calendar & Contacts** - Synchronized scheduling and address book
- **Files & Drive** - Secure file storage and sharing
- **Documents** - Collaborative editing with OnlyOffice
- **Video Meetings** - Oxlas Meet with Jitsi integration
- **AI Assistant** - Self-hosted Llama 3 for productivity
- **Team Collaboration** - Project management with Planka
- **Customer Support** - Ticket system with Zammad
- **Wiki & Knowledge Base** - Documentation with Outline
- **Team Chat** - Secure messaging with Matrix/Element
- **Forms & Surveys** - Data collection with Formbricks
- **Notes & Tasks** - Personal organization with Joplin
- **Custom Domain Support** - Full DNS and SSL management
- **Free + Paid Tiers** - Flexible pricing for all needs

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Zustand** for state management
- **TanStack Query** for server state

### Backend
- **Node.js** API Gateway
- **PostgreSQL** database
- **Redis** caching
- **Prisma** ORM
- **Socket.io** for real-time features

### Core Services
- **Email**: Postfix + Dovecot + Rspamd
- **Files**: Nextcloud (headless)
- **Docs**: OnlyOffice (white-labeled)
- **Video**: Jitsi (custom interface)
- **AI**: Ollama + Llama 3
- **Projects**: Planka (Kanban boards)
- **Support**: Zammad (ticket system)
- **Wiki**: Outline (documentation)
- **Chat**: Matrix + Element (messaging)
- **Forms**: Formbricks (surveys)
- **Notes**: Joplin (personal notes)

### Infrastructure
- **Docker** containerization
- **Nginx** reverse proxy
- **SSL/TLS** encryption
- **Health monitoring**

## 📦 Quick Start

### Prerequisites
- Docker and Docker Compose
- Node.js 18+ (for development)
- Domain name (for production)

### 1. Clone the Repository
```bash
git clone https://github.com/ancourn/Ox.git
cd Ox
```

### 2. Database Setup
⚠️ **Important**: Database files are not included in the repository. You need to create them manually.

#### Create PostgreSQL Database
```bash
# Create database directory
mkdir -p db/postgres_data

# Set environment variables
export POSTGRES_PASSWORD=yourstrongpassword
export POSTGRES_USER=oxlas
export POSTGRES_DB=oxlas

# Start PostgreSQL temporarily
docker run --name postgres-temp \
  -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
  -e POSTGRES_USER=$POSTGRES_USER \
  -e POSTGRES_DB=$POSTGRES_DB \
  -p 5432:5432 \
  -v $(pwd)/db/postgres_data:/var/lib/postgresql/data \
  -d postgres:15-alpine

# Wait for PostgreSQL to start
sleep 10

# Create additional databases for services
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_planka;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_zammad;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_outline;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_matrix;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_formbricks;"
docker exec postgres-temp psql -U $POSTGRES_USER -d $POSTGRES_DB -c "CREATE DATABASE oxlas_joplin;"

# Stop temporary container
docker stop postgres-temp
docker rm postgres-temp
```

#### Create SQLite Database (for local development)
```bash
# Create SQLite database
mkdir -p db
touch db/custom.db

# Set up Prisma schema
npm install
npx prisma generate
npx prisma db push
```

### 3. Environment Configuration
Create a `.env` file:
```env
# Database
POSTGRES_PASSWORD=yourstrongpassword
POSTGRES_USER=oxlas
POSTGRES_DB=oxlas

# Service Secrets
PLANKA_CRYPTO_KEY=$(openssl rand -base64 32)
PLANKA_JWT_SECRET=$(openssl rand -base64 32)
OUTLINE_SECRET_KEY=$(openssl rand -base64 32)
OUTLINE_UTILS_SECRET=$(openssl rand -base64 32)
FORMBRICKS_SECRET=$(openssl rand -base64 32)
FORMBRICKS_ENCRYPTION_KEY=$(openssl rand -base64 32)
MEILISEARCH_MASTER_KEY=$(openssl rand -base64 32)
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# Email Services
POSTFIX_PASSWORD=youremailpassword

# Video Conferencing
JITSI_PASSWORD=yourjitsipassword

# Frontend
FRONTEND_URL=http://localhost:3000
NEXTAUTH_SECRET=yournextauthsecret
NEXTAUTH_URL=http://localhost:3000

# AI Services
AI_SERVICE_URL=http://ollama:11434
```

### 4. Start the Services
```bash
# Development mode
npm run dev

# Production mode
docker-compose up -d
```

### 5. Health Check
```bash
# Run health check script
chmod +x health-check.sh
./health-check.sh
```

### 6. Access Oxlas
- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:3001`
- Team (Planka): `http://localhost:10240`
- Docs (OnlyOffice): `http://localhost:8002`
- AI Assistant: `http://localhost:3000/ai`
- Health Check: `./health-check.sh`

## 🏗️ Project Structure

```
Ox/
├── docker-compose.yml           # Core services orchestration
├── nginx.conf                   # Reverse proxy configuration
├── health-check.sh             # Service health monitoring
├── package.json                 # Main project dependencies
├── README.md                    # This file
├── LICENSE                      # MIT license
├── NOTICE                       # Open-source attributions
├── PRIVACY_POLICY.md            # Privacy policy
├── TOS.md                       # Terms of service
│
├── src/                         # Next.js application
│   ├── app/                     # App Router pages
│   │   ├── ai/                  # AI Assistant page
│   │   ├── api/                 # API routes
│   │   ├── team/                # Team (Planka) page
│   │   ├── docs/                # Docs (OnlyOffice) page
│   │   ├── calendar/            # Calendar page
│   │   ├── care/                # Customer Support page
│   │   ├── chat/                # Team Chat page
│   │   ├── forms/               # Forms page
│   │   ├── notes/               # Notes page
│   │   ├── projects/            # Projects page
│   │   ├── wiki/                # Wiki page
│   │   ├── drive/               # File Drive page
│   │   ├── meet/                # Video Meetings page
│   │   ├── inbox/               # Email page
│   │   ├── domains/             # Domain management
│   │   └── settings/            # Settings page
│   ├── components/              # React components
│   │   ├── oxlas/               # Main app components
│   │   └── ui/                  # shadcn/ui components
│   ├── lib/                     # Utilities and configurations
│   └── hooks/                   # Custom React hooks
│
├── api-gateway/                 # Node.js API Gateway
│   ├── src/
│   │   ├── server.ts           # Main server file
│   │   ├── middleware/         # Authentication & validation
│   │   ├── routes/             # API endpoints
│   │   └── services/           # Business logic
│   └── package.json
│
├── config/                      # Service configurations
│   ├── jitsi-custom/           # Jitsi branding
│   ├── onlyoffice/             # OnlyOffice CSS
│   └── dovecot/                # Email server config
│
├── db/                          # Database files (not in repo)
│   ├── custom.db               # SQLite database
│   └── postgres_data/          # PostgreSQL data
│
└── prisma/                      # Database schema
    └── schema.prisma           # Prisma schema file
```

## 🔧 Service Integration Details

### Team (Planka)
- **URL**: `http://localhost:10240`
- **Purpose**: Kanban-style project management
- **Database**: PostgreSQL (`oxlas_planka`)
- **Integration**: Embedded in `/team` page
- **Nginx Config**: Proxy `/team` to `http://planka:10240`

### Docs (OnlyOffice)
- **URL**: `http://localhost:8002`
- **Purpose**: Collaborative document editing
- **Integration**: Embedded in `/docs` page
- **Features**: Real-time editing, version control
- **Nginx Config**: Proxy `/docs` to `http://onlyoffice:8002`

### AI Assistant (Ollama)
- **URL**: `http://localhost:11434`
- **Model**: Llama 3
- **API**: `/api/ai/generate`
- **Integration**: Dedicated `/ai` page with chat interface
- **Features**: Document summarization, email drafting, meeting scheduling

### Other Services
- **Customer Support**: Zammad (`http://localhost:20240`)
- **Wiki**: Outline (`http://localhost:3002`)
- **Team Chat**: Matrix + Element (`http://localhost:8008`)
- **Forms**: Formbricks (`http://localhost:3003`)
- **Notes**: Joplin (`http://localhost:22300`)

## 🎨 Branding & Customization

### Logo and Colors
- Replace `public/logo.svg` with your brand logo
- Customize colors in `tailwind.config.ts`
- Update brand name in configuration files

### Domain Setup
1. Point your domain to the server IP
2. Configure SSL certificates
3. Update environment variables
4. Restart services

### White-Labeling
- All third-party logos are removed
- Custom CSS for integrated services
- Branded email templates
- Custom domain email addresses

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Create migration
npm run db:reset     # Reset database
```

### Database Management
```bash
# View database (Prisma Studio)
npm run db:studio

# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Create migration
npm run db:migrate

# Reset database
npm run db:reset
```

## 📊 Monitoring

### Health Checks
Run the comprehensive health check script:
```bash
./health-check.sh
```

This script checks:
- PostgreSQL database connectivity
- Nextcloud file storage
- OnlyOffice document server
- Planka project management
- Ollama AI service
- API Gateway health

### Individual Service Health
- Frontend: `GET /health`
- API Gateway: `GET /api/health`
- Database: Automatic connection checks
- Services: Container health monitoring

### Logging
- Application logs: `logs/app.log`
- API logs: `logs/api.log`
- System logs: `logs/system.log`
- Development logs: `dev.log`

## 🛡️ Security

### Features
- End-to-end encryption
- JWT authentication
- Rate limiting
- Input validation
- CORS protection
- Security headers
- Regular security updates

### Best Practices
- Strong password requirements
- Two-factor authentication
- Session management
- Data encryption at rest
- Regular backups
- Security audits

## 📄 Compliance

### Regulations
- **GDPR** - General Data Protection Regulation
- **CCPA** - California Consumer Privacy Act
- **HIPAA** - Health Insurance Portability (optional)
- **SOC 2** - Service Organization Control (optional)

### Data Handling
- Data minimization
- User consent management
- Data portability
- Right to be forgotten
- Breach notification

## 🌐 Deployment

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### Production Deployment
```bash
# Build the application
npm run build

# Start with Docker
docker-compose up -d

# Or start directly
npm start
```

### Docker Services
```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View service logs
docker-compose logs -f [service-name]

# Restart specific service
docker-compose restart [service-name]
```

### Cloud Deployment
- **AWS**: EC2 + RDS + S3
- **Google Cloud**: Compute Engine + Cloud SQL
- **Azure**: Virtual Machines + Database
- **DigitalOcean**: Droplets + Managed Databases

### Nginx Configuration
For production, configure Nginx to proxy requests:
```nginx
# Team (Planka)
location /team {
    proxy_pass http://planka:10240;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Docs (OnlyOffice)
location /docs {
    proxy_pass http://onlyoffice:8002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# AI Assistant
location /api/ai {
    proxy_pass http://ollama:11434;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint configuration
- Write meaningful commit messages
- Update documentation
- Test thoroughly

## 📞 Support

### Documentation
- [API Reference](./docs/api-reference.md)
- [Deployment Guide](./docs/deployment-guide.md)
- [Customization Guide](./docs/customization-guide.md)

### Community
- GitHub Issues
- Discord Community
- Email Support
- Premium Support (paid plans)

## 📄 Legal

- [License](./LICENSE) - MIT License
- [Privacy Policy](./PRIVACY_POLICY.md)
- [Terms of Service](./TOS.md)
- [NOTICE](./NOTICE) - Open-source attributions

## 🚀 Roadmap

### Phase 1 (Complete) ✅
- ✅ Core infrastructure
- ✅ Basic UI components
- ✅ API Gateway
- ✅ Email integration
- ✅ File storage
- ✅ Team (Planka) integration
- ✅ Docs (OnlyOffice) integration
- ✅ AI Assistant (Ollama) integration
- ✅ Health check script
- ✅ Complete navigation system

### Phase 2 (Q1 2025)
- 🔄 Advanced AI features
- 🔄 Mobile applications
- 🔄 Advanced analytics
- 🔄 Team management

### Phase 3 (Q2 2025)
- 📅 Enterprise features
- 📅 Advanced integrations
- 📅 Marketplace
- 📅 API platform

---

## 📋 Deployment Checklist

- [ ] Clone repository
- [ ] Set up databases (PostgreSQL + SQLite)
- [ ] Configure environment variables
- [ ] Install dependencies
- [ ] Generate Prisma client
- [ ] Push database schema
- [ ] Start Docker services
- [ ] Run health check
- [ ] Configure Nginx (production)
- [ ] Set up SSL certificates
- [ ] Configure domain
- [ ] Test all integrations

**Oxlas Technologies Inc.** © 2025

Built with ❤️ for privacy and productivity.