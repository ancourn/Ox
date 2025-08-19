import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import { createServer } from 'http';

// Import routes
import authRoutes from './routes/auth';
import emailRoutes from './routes/email';
import calendarRoutes from './routes/calendar';
import domainsRoutes from './routes/domains';

// Import services
import { WebSocketService } from './services/websocket';

dotenv.config();

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3001;

// Initialize WebSocket service
const webSocketService = new WebSocketService(server);

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const rateLimiter = new RateLimiterMemory({
  keyPrefix: 'middleware',
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware
app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes: any) {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded',
      retryAfter: rejRes.msBeforeNext
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/calendar', calendarRoutes);
app.use('/api/domains', domainsRoutes);

// Proxy configurations
const proxyOptions = {
  changeOrigin: true,
  secure: false,
  onProxyReq: (proxyReq: any, req: any, res: any) => {
    // Forward authentication headers
    if (req.headers.authorization) {
      proxyReq.setHeader('Authorization', req.headers.authorization);
    }
    
    // Forward user context
    if (req.headers['x-user-id']) {
      proxyReq.setHeader('X-User-ID', req.headers['x-user-id']);
    }
  },
  onError: (err: any, req: any, res: any) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      error: 'Proxy Error',
      message: 'Service temporarily unavailable'
    });
  }
};

// File storage proxy (Nextcloud)
app.use('/api/files', createProxyMiddleware({
  target: process.env.FILES_SERVICE_URL || 'http://nextcloud:80',
  pathRewrite: { '^/api/files': '/remote.php/dav/files' },
  ...proxyOptions
}));

// Document editing proxy (OnlyOffice)
app.use('/api/docs', createProxyMiddleware({
  target: process.env.DOCS_SERVICE_URL || 'http://onlyoffice:80',
  pathRewrite: { '^/api/docs': '' },
  ...proxyOptions
}));

// Video conferencing proxy (Jitsi)
app.use('/api/meet', createProxyMiddleware({
  target: process.env.MEET_SERVICE_URL || 'http://jitsi:80',
  pathRewrite: { '^/api/meet': '' },
  ...proxyOptions
}));

// AI service proxy (Ollama)
app.use('/api/ai', createProxyMiddleware({
  target: process.env.AI_SERVICE_URL || 'http://ollama:11434',
  pathRewrite: { '^/api/ai': '' },
  ...proxyOptions
}));

// Database service proxy
app.use('/api/db', createProxyMiddleware({
  target: process.env.DB_SERVICE_URL || 'http://postgres:5432',
  pathRewrite: { '^/api/db': '' },
  ...proxyOptions
}));

// User management endpoints
app.get('/api/user/profile', async (req, res) => {
  try {
    // TODO: Implement user profile retrieval
    res.json({
      id: 'user-id',
      email: 'user@oxlas.com',
      name: 'User Name',
      avatar: '/api/files/avatar/user-id',
      settings: {
        theme: 'light',
        language: 'en',
        notifications: true
      }
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to retrieve profile'
    });
  }
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'An unexpected error occurred'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'Endpoint not found'
  });
});

server.listen(PORT, () => {
  console.log(`🔐 Oxlas API Gateway running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`🔌 WebSocket server ready for real-time connections`);
});

export { app, server, webSocketService };