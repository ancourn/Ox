# 🐂 Oxlas — Private. Branded. Powerful.

Oxlas is a fully open-source, self-hosted productivity suite that replaces Google Workspace with zero third-party branding.

## 🚀 Features

- **Email** (`you@yourcompany.com`) - Private email with custom domains
- **Calendar & Contacts** - Synchronized scheduling and address book
- **Files & Drive** - Secure file storage and sharing
- **Documents** - Collaborative editing with OnlyOffice
- **Video Meetings** - Oxlas Meet with Jitsi integration
- **AI Assistant** - Self-hosted Llama 3 for productivity
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
git clone https://github.com/your-org/oxlas.git
cd oxlas
```

### 2. Environment Configuration
Create a `.env` file:
```env
# Database
POSTGRES_PASSWORD=yourstrongpassword

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

### 3. Start the Services
```bash
# Development mode
npm run dev

# Production mode
docker-compose up -d
```

### 4. Access Oxlas
- Frontend: `http://localhost:3000`
- API Gateway: `http://localhost:3001`
- Health Check: `http://localhost/health`

## 🏗️ Project Structure

```
oxlas/
├── docker-compose.yml           # Core services orchestration
├── nginx.conf                   # Reverse proxy configuration
├── package.json                 # Main project dependencies
├── README.md                    # This file
├── LICENSE                      # MIT license
├── NOTICE                       # Open-source attributions
├── PRIVACY_POLICY.md            # Privacy policy
├── TOS.md                       # Terms of service
│
├── src/                         # Next.js application
│   ├── app/                     # App Router pages
│   ├── components/              # React components
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
└── docs/                        # Documentation
    ├── deployment-guide.md
    ├── api-reference.md
    └── customization-guide.md
```

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
```

### Database Management
```bash
# View database
npm run db:studio

# Reset database
npm run db:reset

# Create migration
npm run db:migrate
```

## 📊 Monitoring

### Health Checks
- Frontend: `GET /health`
- API Gateway: `GET /api/health`
- Database: Automatic connection checks
- Services: Container health monitoring

### Logging
- Application logs: `logs/app.log`
- API logs: `logs/api.log`
- System logs: `logs/system.log`
- Error tracking: Built-in error reporting

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

### Cloud Deployment
- **AWS**: EC2 + RDS + S3
- **Google Cloud**: Compute Engine + Cloud SQL
- **Azure**: Virtual Machines + Database
- **DigitalOcean**: Droplets + Managed Databases

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

### Phase 1 (Current)
- ✅ Core infrastructure
- ✅ Basic UI components
- ✅ API Gateway
- ✅ Email integration
- ✅ File storage

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

**Oxlas Technologies Inc.** © 2025

Built with ❤️ for privacy and productivity.