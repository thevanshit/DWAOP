import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { logger } from '@/utils/logger';
import { config } from '@/config';

export interface NotificationData {
  id: string;
  type: 'workflow_update' | 'deadline_reminder' | 'assignment_evaluated' | 'leave_approved' | 'system';
  title: string;
  message: string;
  data?: any;
  recipients: string[];
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  readAt?: Date;
}

export class NotificationService {
  private io: SocketIOServer;
  private connectedUsers: Map<string, Set<string>> = new Map(); // userId -> Set of socket IDs
  private notifications: Map<string, NotificationData[]> = new Map(); // userId -> notifications

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: config.cors.origin,
        credentials: config.cors.credentials,
        methods: ['GET', 'POST']
      },
      transports: ['websocket', 'polling']
    });

    this.initializeSocketHandlers();
    logger.info('WebSocket server initialized');
  }

  /**
   * Initialize Socket.IO event handlers
   */
  private initializeSocketHandlers(): void {
    this.io.on('connection', (socket) => {
      logger.info(`User connected: ${socket.id}`);

      // Handle user authentication via JWT
      socket.on('authenticate', async (data) => {
        try {
          const { token } = data;
          
          if (!token) {
            socket.emit('authentication_error', { error: 'No token provided' });
            return;
          }

          // Verify JWT token
          const decoded = jwt.verify(token, config.jwt.secret) as {
            userId: string;
            email: string;
            role: string;
            departmentId?: string;
          };

          const { userId, role } = decoded;

          // Associate socket with user
          if (!this.connectedUsers.has(userId)) {
            this.connectedUsers.set(userId, new Set());
          }
          this.connectedUsers.get(userId)!.add(socket.id);
          
          // Join user to their personal room
          socket.join(`user:${userId}`);
          
          // Join role-based rooms
          socket.join(`role:${role}`);
          
          // Send pending notifications
          await this.sendPendingNotifications(userId, socket);
          
          socket.emit('authenticated', { success: true, userId, role });
          logger.info(`User ${userId} (${role}) authenticated with socket ${socket.id}`);
        } catch (error) {
          if (error instanceof jwt.JsonWebTokenError) {
            socket.emit('authentication_error', { error: 'Invalid token' });
          } else if (error instanceof jwt.TokenExpiredError) {
            socket.emit('authentication_error', { error: 'Token expired' });
          } else {
            logger.error('Socket authentication failed', error);
            socket.emit('authentication_error', { error: 'Authentication failed' });
          }
        }
      });

      // Handle notification read status
      socket.on('mark_notification_read', (data) => {
        try {
          const { notificationId } = data;
          const userId = this.getUserIdFromSocket(socket.id);
          
          if (userId) {
            this.markNotificationRead(userId, notificationId);
            socket.emit('notification_marked_read', { notificationId });
          }
        } catch (error) {
          logger.error('Failed to mark notification as read', error);
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        logger.info(`User disconnected: ${socket.id}`);
        this.removeSocketFromUser(socket.id);
      });

      // Handle errors
      socket.on('error', (error) => {
        logger.error(`Socket error for ${socket.id}:`, error);
      });
    });
  }

  /**
   * Send notification to specific users
   */
  public async sendNotification(notification: Omit<NotificationData, 'id' | 'createdAt'>): Promise<void> {
    const notificationData: NotificationData = {
      ...notification,
      id: this.generateNotificationId(),
      createdAt: new Date()
    };

    // Store notification for each recipient
    for (const recipientId of notification.recipients) {
      if (!this.notifications.has(recipientId)) {
        this.notifications.set(recipientId, []);
      }
      
      this.notifications.get(recipientId)!.push(notificationData);
      
      // Limit stored notifications per user
      const userNotifications = this.notifications.get(recipientId)!;
      if (userNotifications.length > 100) {
        userNotifications.splice(0, userNotifications.length - 100);
      }
    }

    // Send real-time notification
    for (const recipientId of notification.recipients) {
      this.io.to(`user:${recipientId}`).emit('notification', notificationData);
    }

    // Log notification
    logger.info(`Notification sent to ${notification.recipients.length} users: ${notification.title}`);
  }

  /**
   * Send notification to all users with a specific role
   */
  public async sendNotificationToRole(
    role: string,
    notification: Omit<NotificationData, 'id' | 'createdAt' | 'recipients'>
  ): Promise<void> {
    const notificationData: NotificationData = {
      ...notification,
      id: this.generateNotificationId(),
      createdAt: new Date(),
      recipients: [] // Will be populated by connected users
    };

    // Send to all users in the role room
    this.io.to(`role:${role}`).emit('notification', notificationData);

    logger.info(`Role notification sent to role ${role}: ${notification.title}`);
  }

  /**
   * Send notification to all connected users
   */
  public async sendBroadcastNotification(
    notification: Omit<NotificationData, 'id' | 'createdAt' | 'recipients'>
  ): Promise<void> {
    const notificationData: NotificationData = {
      ...notification,
      id: this.generateNotificationId(),
      createdAt: new Date(),
      recipients: [] // Broadcast to all
    };

    // Send to all connected clients
    this.io.emit('notification', notificationData);

    logger.info(`Broadcast notification sent: ${notification.title}`);
  }

  /**
   * Send workflow update notification
   */
  public async sendWorkflowUpdate(
    workflowId: string,
    workflowType: string,
    fromState: string,
    toState: string,
    recipients: string[],
    additionalData?: any
  ): Promise<void> {
    await this.sendNotification({
      type: 'workflow_update',
      title: `Workflow Updated: ${workflowType}`,
      message: `Workflow ${workflowId} transitioned from ${fromState} to ${toState}`,
      data: {
        workflowId,
        workflowType,
        fromState,
        toState,
        ...additionalData
      },
      recipients,
      priority: 'medium'
    });
  }

  /**
   * Send deadline reminder notification
   */
  public async sendDeadlineReminder(
    workflowId: string,
    workflowType: string,
    deadline: Date,
    recipients: string[]
  ): Promise<void> {
    await this.sendNotification({
      type: 'deadline_reminder',
      title: 'Deadline Approaching',
      message: `Your ${workflowType} is due on ${deadline.toLocaleDateString()}`,
      data: {
        workflowId,
        workflowType,
        deadline
      },
      recipients,
      priority: 'high'
    });
  }

  /**
   * Send assignment evaluated notification
   */
  public async sendAssignmentEvaluated(
    assignmentId: string,
    studentId: string,
    marks: number,
    maxMarks: number
  ): Promise<void> {
    await this.sendNotification({
      type: 'assignment_evaluated',
      title: 'Assignment Evaluated',
      message: `Your assignment has been evaluated. Score: ${marks}/${maxMarks}`,
      data: {
        assignmentId,
        marks,
        maxMarks
      },
      recipients: [studentId],
      priority: 'medium'
    });
  }

  /**
   * Get pending notifications for a user
   */
  public async getPendingNotifications(userId: string): Promise<NotificationData[]> {
    return this.notifications.get(userId) || [];
  }

  /**
   * Send pending notifications to a user's socket
   */
  private async sendPendingNotifications(userId: string, socket: any): Promise<void> {
    const notifications = await this.getPendingNotifications(userId);
    const unreadNotifications = notifications.filter(n => !n.readAt);
    
    if (unreadNotifications.length > 0) {
      socket.emit('pending_notifications', unreadNotifications);
    }
  }

  /**
   * Mark notification as read
   */
  private markNotificationRead(userId: string, notificationId: string): void {
    const notifications = this.notifications.get(userId);
    if (notifications) {
      const notification = notifications.find(n => n.id === notificationId);
      if (notification && !notification.readAt) {
        notification.readAt = new Date();
      }
    }
  }

  /**
   * Remove socket from user mapping
   */
  private removeSocketFromUser(socketId: string): void {
    for (const [userId, socketIds] of this.connectedUsers.entries()) {
      if (socketIds.has(socketId)) {
        socketIds.delete(socketId);
        if (socketIds.size === 0) {
          this.connectedUsers.delete(userId);
        }
        break;
      }
    }
  }

  /**
   * Get user ID from socket ID
   */
  private getUserIdFromSocket(socketId: string): string | null {
    for (const [userId, socketIds] of this.connectedUsers.entries()) {
      if (socketIds.has(socketId)) {
        return userId;
      }
    }
    return null;
  }

  /**
   * Generate unique notification ID
   */
  private generateNotificationId(): string {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get connected users count
   */
  public getConnectedUsersCount(): number {
    return this.connectedUsers.size;
  }

  /**
   * Get Socket.IO server instance
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}