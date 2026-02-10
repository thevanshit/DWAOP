import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from '@/config';
import { logger } from '@/utils/logger';
import Database from '@/config/database';
import { WorkflowEngine } from '@/core/workflow/engine';
import { RBACService } from '@/core/rbac/service';
import { AuthService } from '@/core/auth/service';
import { createAuthMiddleware } from '@/middleware/auth';
import { NotificationService } from '@/services/notification';
import { createAuthRoutes } from '@/routes/auth';
import { createWorkflowRoutes } from '@/routes/workflows';
import { createDashboardRoutes } from '@/routes/dashboard';

class Application {
  public app: express.Application;
  private server: any;
  private database!: Database;
  private workflowEngine!: WorkflowEngine;
  private rbacService!: RBACService;
  private authService!: AuthService;
  private notificationService!: NotificationService;

  constructor() {
    this.app = express();
    this.initializeDatabase();
    this.initializeServices();
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  /**
   * Initialize database connection
   */
  private initializeDatabase(): void {
    try {
      this.database = Database.getInstance(config.database);
      logger.info('Database initialized');
    } catch (error) {
      logger.error('Failed to initialize database', error);
      process.exit(1);
    }
  }

  /**
   * Initialize core services
   */
  private async initializeServices(): Promise<void> {
    try {
      // Initialize RBAC service
      this.rbacService = new RBACService(this.database);
      await this.rbacService.initializeRoles();
      logger.info('RBAC service initialized');

      // Initialize Workflow engine
      this.workflowEngine = new WorkflowEngine(this.database);
      logger.info('Workflow engine initialized');

      // Initialize Auth service
      this.authService = new AuthService(this.database, this.rbacService);
      logger.info('Auth service initialized');

      // Initialize WebSocket and notification service
      await this.initializeWebSocket();
    } catch (error) {
      logger.error('Failed to initialize services', error);
      process.exit(1);
    }
  }

  /**
   * Initialize WebSocket and notification service
   */
  private async initializeWebSocket(): Promise<void> {
    try {
      // Create HTTP server for Socket.IO
      this.server = require('http').createServer(this.app);
      
      // Initialize notification service
      this.notificationService = new NotificationService(this.server);
      logger.info('WebSocket and notification service initialized');
    } catch (error) {
      logger.error('Failed to initialize WebSocket', error);
      process.exit(1);
    }
  }

  /**
   * Initialize middleware
   */
  private initializeMiddleware(): void {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: config.cors.origin,
      credentials: config.cors.credentials,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Compression
    this.app.use(compression());

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // HTTP request logging
    this.app.use(morgan('combined', { stream: { write: (message) => logger.http(message.trim()) } }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: config.rateLimit.windowMs,
      max: config.rateLimit.maxRequests,
      message: {
        error: 'Too many requests from this IP, please try again later.',
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use('/api', limiter);

    // Health check endpoint
    this.app.get('/health', async (req, res) => {
      try {
        const dbHealth = await this.database.healthCheck();
        const uptime = process.uptime();
        
        res.status(200).json({
          status: 'healthy',
          uptime: uptime,
          database: dbHealth ? 'connected' : 'disconnected',
          timestamp: new Date().toISOString(),
          version: process.env.npm_package_version || '1.0.0',
        });
      } catch (error) {
        res.status(503).json({
          status: 'unhealthy',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    });

    // API info endpoint
    this.app.get('/api', (req, res) => {
      res.json({
        name: 'DWAOP Backend API',
        description: 'Department Workflow & Academic Operations Platform',
        version: '1.0.0',
        endpoints: {
          auth: '/api/auth',
          workflows: '/api/workflows',
          dashboard: '/api/dashboard',
          users: '/api/users',
        },
        documentation: '/api/docs',
      });
    });
  }

  /**
   * Initialize routes
   */
  private initializeRoutes(): void {
    // Create auth middleware
    const authMiddleware = createAuthMiddleware(this.authService);

    // API routes
    const apiRouter = express.Router();

    // Authentication routes
    apiRouter.use('/auth', createAuthRoutes(this.authService));

    // Workflow routes (protected)
    apiRouter.use('/workflows', authMiddleware.authenticate, createWorkflowRoutes(this.workflowEngine));

    // Dashboard routes (protected)
    apiRouter.use('/dashboard', authMiddleware.authenticate, createDashboardRoutes(this.workflowEngine));

    // Temporary routes for testing
    apiRouter.get('/test', (req, res) => {
      res.json({ message: 'API is working!' });
    });

    this.app.use('/api', apiRouter);
  }

  /**
   * Initialize error handling
   */
  private initializeErrorHandling(): void {
    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        path: req.originalUrl,
        method: req.method,
      });
    });

    // Global error handler
    this.app.use((error: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('Unhandled error', {
        error: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
      });

      // Don't expose error details in production
      const message = config.nodeEnv === 'production' 
        ? 'Internal server error' 
        : error.message;

      res.status(500).json({
        error: message,
        timestamp: new Date().toISOString(),
      });
    });
  }

  /**
   * Start the application
   */
  public async start(): Promise<void> {
    try {
      // Test database connection
      const dbConnected = await this.database.healthCheck();
      if (!dbConnected) {
        throw new Error('Database connection failed');
      }

      // Start server with WebSocket support
      this.server.listen(config.port, () => {
        logger.info(`🚀 DWAOP Backend Server started on port ${config.port}`);
        logger.info(`📊 Environment: ${config.nodeEnv}`);
        logger.info(`🔗 API Base URL: http://localhost:${config.port}/api`);
        logger.info(`❤️  Health Check: http://localhost:${config.port}/health`);
        logger.info(`🔌 WebSocket: ws://localhost:${config.port}`);
      });
    } catch (error) {
      logger.error('Failed to start application', error);
      process.exit(1);
    }
  }

  /**
   * Graceful shutdown
   */
  public async shutdown(): Promise<void> {
    logger.info('Shutting down application...');
    
    try {
      await this.database.close();
      logger.info('Database connection closed');
      process.exit(0);
    } catch (error) {
      logger.error('Error during shutdown', error);
      process.exit(1);
    }
  }

  /**
   * Get notification service instance
   */
  public getNotificationService(): NotificationService {
    return this.notificationService;
  }
}

// Create and start the application
const app = new Application();

// Handle graceful shutdown
process.on('SIGTERM', () => app.shutdown());
process.on('SIGINT', () => app.shutdown());

// Start the application
app.start().catch((error) => {
  logger.error('Failed to start application', error);
  process.exit(1);
});

export default app;