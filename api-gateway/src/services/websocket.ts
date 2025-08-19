import { Server as SocketIOServer, Socket } from 'socket.io';
import { Server as HTTPServer } from 'http';
import jwt from 'jsonwebtoken';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  userEmail?: string;
}

interface Room {
  name: string;
  users: Set<string>;
}

export class WebSocketService {
  private io: SocketIOServer;
  private rooms: Map<string, Room> = new Map();

  constructor(server: HTTPServer) {
    this.io = new SocketIOServer(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.setupAuthentication();
    this.setupEventHandlers();
  }

  private setupAuthentication(): void {
    this.io.use((socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
        socket.userId = decoded.id;
        socket.userEmail = decoded.email;
        next();
      } catch (err) {
        next(new Error('Authentication error: Invalid token'));
      }
    });
  }

  private setupEventHandlers(): void {
    this.io.on('connection', (socket: AuthenticatedSocket) => {
      console.log(`User connected: ${socket.userId}`);

      // Join user-specific rooms
      this.joinUserRooms(socket);

      // Handle custom events
      this.handleEmailEvents(socket);
      this.handleCalendarEvents(socket);
      this.handleFileEvents(socket);
      this.handleMeetingEvents(socket);

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.userId}`);
        this.leaveUserRooms(socket);
      });
    });
  }

  private joinUserRooms(socket: AuthenticatedSocket): void {
    if (!socket.userId || !socket.userEmail) return;

    // Join user-specific room
    const userRoom = `user:${socket.userId}`;
    socket.join(userRoom);

    // Join email room
    const emailRoom = `email:${socket.userEmail}`;
    socket.join(emailRoom);

    // Create and join domain room if user has domain
    const domainRoom = `domain:${socket.userEmail.split('@')[1]}`;
    socket.join(domainRoom);

    // Initialize rooms if they don't exist
    if (!this.rooms.has(userRoom)) {
      this.rooms.set(userRoom, { name: userRoom, users: new Set() });
    }
    if (!this.rooms.has(emailRoom)) {
      this.rooms.set(emailRoom, { name: emailRoom, users: new Set() });
    }
    if (!this.rooms.has(domainRoom)) {
      this.rooms.set(domainRoom, { name: domainRoom, users: new Set() });
    }

    // Add user to rooms
    this.rooms.get(userRoom)?.users.add(socket.userId);
    this.rooms.get(emailRoom)?.users.add(socket.userId);
    this.rooms.get(domainRoom)?.users.add(socket.userId);

    // Notify user they've joined rooms
    socket.emit('rooms_joined', {
      userRoom,
      emailRoom,
      domainRoom,
    });
  }

  private leaveUserRooms(socket: AuthenticatedSocket): void {
    if (!socket.userId || !socket.userEmail) return;

    const userRoom = `user:${socket.userId}`;
    const emailRoom = `email:${socket.userEmail}`;
    const domainRoom = `domain:${socket.userEmail.split('@')[1]}`;

    // Remove user from rooms
    this.rooms.get(userRoom)?.users.delete(socket.userId);
    this.rooms.get(emailRoom)?.users.delete(socket.userId);
    this.rooms.get(domainRoom)?.users.delete(socket.userId);

    // Clean up empty rooms
    if (this.rooms.get(userRoom)?.users.size === 0) {
      this.rooms.delete(userRoom);
    }
    if (this.rooms.get(emailRoom)?.users.size === 0) {
      this.rooms.delete(emailRoom);
    }
    if (this.rooms.get(domainRoom)?.users.size === 0) {
      this.rooms.delete(domainRoom);
    }
  }

  private handleEmailEvents(socket: AuthenticatedSocket): void {
    // Listen for email composition start
    socket.on('email_compose_start', (data) => {
      // Notify other devices of the same user
      this.io.to(`user:${socket.userId}`).emit('email_composing', {
        userId: socket.userId,
        ...data,
      });
    });

    // Listen for email composition end
    socket.on('email_compose_end', () => {
      this.io.to(`user:${socket.userId}`).emit('email_composition_stopped', {
        userId: socket.userId,
      });
    });

    // Listen for email read status changes
    socket.on('email_read', (data) => {
      this.io.to(`email:${socket.userEmail}`).emit('email_read_update', {
        userId: socket.userId,
        ...data,
      });
    });

    // Listen for email star status changes
    socket.on('email_starred', (data) => {
      this.io.to(`email:${socket.userEmail}`).emit('email_star_update', {
        userId: socket.userId,
        ...data,
      });
    });
  }

  private handleCalendarEvents(socket: AuthenticatedSocket): void {
    // Listen for calendar event creation
    socket.on('calendar_event_created', (data) => {
      // Notify all users in the same domain
      const domain = socket.userEmail?.split('@')[1];
      if (domain) {
        this.io.to(`domain:${domain}`).emit('calendar_event_created', {
          userId: socket.userId,
          ...data,
        });
      }
    });

    // Listen for calendar event updates
    socket.on('calendar_event_updated', (data) => {
      const domain = socket.userEmail?.split('@')[1];
      if (domain) {
        this.io.to(`domain:${domain}`).emit('calendar_event_updated', {
          userId: socket.userId,
          ...data,
        });
      }
    });

    // Listen for calendar event deletion
    socket.on('calendar_event_deleted', (data) => {
      const domain = socket.userEmail?.split('@')[1];
      if (domain) {
        this.io.to(`domain:${domain}`).emit('calendar_event_deleted', {
          userId: socket.userId,
          ...data,
        });
      }
    });

    // Listen for event RSVP responses
    socket.on('calendar_event_rsvp', (data) => {
      // Notify event organizer and attendees
      this.io.to(`user:${data.organizerId}`).emit('calendar_event_rsvp_received', {
        userId: socket.userId,
        ...data,
      });
    });
  }

  private handleFileEvents(socket: AuthenticatedSocket): void {
    // Listen for file uploads
    socket.on('file_uploaded', (data) => {
      const domain = socket.userEmail?.split('@')[1];
      if (domain) {
        this.io.to(`domain:${domain}`).emit('file_upload_notification', {
          userId: socket.userId,
          ...data,
        });
      }
    });

    // Listen for file sharing
    socket.on('file_shared', (data) => {
      // Notify specific users the file was shared with
      data.sharedWith.forEach((userId: string) => {
        this.io.to(`user:${userId}`).emit('file_shared_notification', {
          sharedBy: socket.userId,
          ...data,
        });
      });
    });

    // Listen for file updates
    socket.on('file_updated', (data) => {
      const domain = socket.userEmail?.split('@')[1];
      if (domain) {
        this.io.to(`domain:${domain}`).emit('file_update_notification', {
          userId: socket.userId,
          ...data,
        });
      }
    });
  }

  private handleMeetingEvents(socket: AuthenticatedSocket): void {
    // Listen for meeting start
    socket.on('meeting_started', (data) => {
      this.io.to(`domain:${socket.userEmail?.split('@')[1]}`).emit('meeting_started_notification', {
        userId: socket.userId,
        ...data,
      });
    });

    // Listen for meeting end
    socket.on('meeting_ended', (data) => {
      this.io.to(`domain:${socket.userEmail?.split('@')[1]}`).emit('meeting_ended_notification', {
        userId: socket.userId,
        ...data,
      });
    });

    // Listen for meeting join/leave
    socket.on('meeting_joined', (data) => {
      this.io.to(`meeting:${data.meetingId}`).emit('participant_joined', {
        userId: socket.userId,
        ...data,
      });
    });

    socket.on('meeting_left', (data) => {
      this.io.to(`meeting:${data.meetingId}`).emit('participant_left', {
        userId: socket.userId,
        ...data,
      });
    });
  }

  // Public methods for emitting events from other services
  public notifyNewEmail(userEmail: string, emailData: any): void {
    this.io.to(`email:${userEmail}`).emit('new_email', {
      timestamp: new Date().toISOString(),
      ...emailData,
    });
  }

  public notifyEmailRead(userEmail: string, emailId: string, userId: string): void {
    this.io.to(`email:${userEmail}`).emit('email_read', {
      emailId,
      userId,
      timestamp: new Date().toISOString(),
    });
  }

  public notifyCalendarEvent(domain: string, eventData: any, action: 'created' | 'updated' | 'deleted'): void {
    this.io.to(`domain:${domain}`).emit(`calendar_event_${action}`, {
      timestamp: new Date().toISOString(),
      ...eventData,
    });
  }

  public notifyFileUpload(domain: string, fileData: any): void {
    this.io.to(`domain:${domain}`).emit('file_uploaded', {
      timestamp: new Date().toISOString(),
      ...fileData,
    });
  }

  public notifyMeetingStarted(domain: string, meetingData: any): void {
    this.io.to(`domain:${domain}`).emit('meeting_started', {
      timestamp: new Date().toISOString(),
      ...meetingData,
    });
  }

  public notifyUser(userId: string, event: string, data: any): void {
    this.io.to(`user:${userId}`).emit(event, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  }

  public getRoomStats(): { name: string; userCount: number }[] {
    return Array.from(this.rooms.entries()).map(([name, room]) => ({
      name,
      userCount: room.users.size,
    }));
  }

  public getUserConnections(userId: string): number {
    const userRoom = this.rooms.get(`user:${userId}`);
    return userRoom?.users.size || 0;
  }

  public broadcastToDomain(domain: string, event: string, data: any): void {
    this.io.to(`domain:${domain}`).emit(event, {
      timestamp: new Date().toISOString(),
      ...data,
    });
  }
}