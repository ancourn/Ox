'use client';

import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseWebSocketOptions {
  autoConnect?: boolean;
  reconnection?: boolean;
  reconnectionDelay?: number;
  reconnectionAttempts?: number;
}

interface WebSocketMessage {
  timestamp: string;
  [key: string]: any;
}

export function useWebSocket(
  url: string = typeof window !== 'undefined' 
    ? (process.env.NODE_ENV === 'production' 
        ? window.location.origin 
        : 'http://localhost:3001')
    : 'http://localhost:3001',
  options: UseWebSocketOptions = {}
) {
  const {
    autoConnect = true,
    reconnection = true,
    reconnectionDelay = 1000,
    reconnectionAttempts = 5,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const eventHandlersRef = useRef<Map<string, ((data: any) => void)[]>>(new Map());

  const connect = () => {
    if (socketRef.current?.connected) return;

    // Get auth token from localStorage (only on client side)
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (!token) {
      setConnectionError('No authentication token found');
      return;
    }

    socketRef.current = io(url, {
      auth: { token },
      reconnection,
      reconnectionDelay,
      reconnectionAttempts,
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      setIsConnected(true);
      setConnectionError(null);
      console.log('WebSocket connected');
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('WebSocket disconnected:', reason);
    });

    socket.on('connect_error', (error) => {
      setConnectionError(error.message);
      console.error('WebSocket connection error:', error);
    });

    // Set up message handler
    socket.onAny((event, ...args) => {
      const message = args[0];
      setLastMessage({
        timestamp: new Date().toISOString(),
        event,
        data: message,
      });

      // Call registered event handlers
      const handlers = eventHandlersRef.current.get(event);
      if (handlers) {
        handlers.forEach(handler => handler(message));
      }
    });

    // Handle room joining confirmation
    socket.on('rooms_joined', (rooms) => {
      console.log('Joined rooms:', rooms);
    });
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    }
  };

  const emit = (event: string, data?: any) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event);
    }
  };

  const on = (event: string, handler: (data: any) => void) => {
    if (!eventHandlersRef.current.has(event)) {
      eventHandlersRef.current.set(event, []);
    }
    eventHandlersRef.current.get(event)!.push(handler);

    // Return unsubscribe function
    return () => {
      const handlers = eventHandlersRef.current.get(event);
      if (handlers) {
        const index = handlers.indexOf(handler);
        if (index > -1) {
          handlers.splice(index, 1);
        }
      }
    };
  };

  const off = (event: string, handler: (data: any) => void) => {
    const handlers = eventHandlersRef.current.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  };

  // Auto-connect on mount if enabled
  useEffect(() => {
    if (autoConnect) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [url]);

  // Reconnect when token changes
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    if (token && isConnected) {
      // Reconnect with new token
      disconnect();
      connect();
    }
  }, [isConnected]); // Remove localStorage from dependency array

  return {
    isConnected,
    lastMessage,
    connectionError,
    connect,
    disconnect,
    emit,
    on,
    off,
    socket: socketRef.current,
  };
}

// Specialized hooks for specific event types
export function useEmailWebSocket() {
  const { on, emit, isConnected } = useWebSocket();

  const onNewEmail = (handler: (email: any) => void) => {
    return on('new_email', handler);
  };

  const onEmailRead = (handler: (data: any) => void) => {
    return on('email_read', handler);
  };

  const onEmailStarUpdate = (handler: (data: any) => void) => {
    return on('email_star_update', handler);
  };

  const markEmailRead = (emailId: string) => {
    emit('email_read', { emailId });
  };

  const starEmail = (emailId: string, starred: boolean) => {
    emit('email_starred', { emailId, starred });
  };

  const startComposingEmail = (data: any) => {
    emit('email_compose_start', data);
  };

  const stopComposingEmail = () => {
    emit('email_compose_end');
  };

  return {
    isConnected,
    onNewEmail,
    onEmailRead,
    onEmailStarUpdate,
    markEmailRead,
    starEmail,
    startComposingEmail,
    stopComposingEmail,
  };
}

export function useCalendarWebSocket() {
  const { on, emit, isConnected } = useWebSocket();

  const onEventCreated = (handler: (event: any) => void) => {
    return on('calendar_event_created', handler);
  };

  const onEventUpdated = (handler: (event: any) => void) => {
    return on('calendar_event_updated', handler);
  };

  const onEventDeleted = (handler: (event: any) => void) => {
    return on('calendar_event_deleted', handler);
  };

  const onEventRSVP = (handler: (rsvp: any) => void) => {
    return on('calendar_event_rsvp_received', handler);
  };

  const createEvent = (eventData: any) => {
    emit('calendar_event_created', eventData);
  };

  const updateEvent = (eventData: any) => {
    emit('calendar_event_updated', eventData);
  };

  const deleteEvent = (eventId: string) => {
    emit('calendar_event_deleted', { eventId });
  };

  const rsvpEvent = (eventData: any) => {
    emit('calendar_event_rsvp', eventData);
  };

  return {
    isConnected,
    onEventCreated,
    onEventUpdated,
    onEventDeleted,
    onEventRSVP,
    createEvent,
    updateEvent,
    deleteEvent,
    rsvpEvent,
  };
}

export function useFileWebSocket() {
  const { on, emit, isConnected } = useWebSocket();

  const onFileUploaded = (handler: (file: any) => void) => {
    return on('file_uploaded', handler);
  };

  const onFileShared = (handler: (file: any) => void) => {
    return on('file_shared_notification', handler);
  };

  const onFileUpdated = (handler: (file: any) => void) => {
    return on('file_update_notification', handler);
  };

  const uploadFile = (fileData: any) => {
    emit('file_uploaded', fileData);
  };

  const shareFile = (fileData: any) => {
    emit('file_shared', fileData);
  };

  const updateFile = (fileData: any) => {
    emit('file_updated', fileData);
  };

  return {
    isConnected,
    onFileUploaded,
    onFileShared,
    onFileUpdated,
    uploadFile,
    shareFile,
    updateFile,
  };
}

export function useMeetingWebSocket() {
  const { on, emit, isConnected } = useWebSocket();

  const onMeetingStarted = (handler: (meeting: any) => void) => {
    return on('meeting_started_notification', handler);
  };

  const onMeetingEnded = (handler: (meeting: any) => void) => {
    return on('meeting_ended_notification', handler);
  };

  const onParticipantJoined = (handler: (participant: any) => void) => {
    return on('participant_joined', handler);
  };

  const onParticipantLeft = (handler: (participant: any) => void) => {
    return on('participant_left', handler);
  };

  const startMeeting = (meetingData: any) => {
    emit('meeting_started', meetingData);
  };

  const endMeeting = (meetingData: any) => {
    emit('meeting_ended', meetingData);
  };

  const joinMeeting = (meetingData: any) => {
    emit('meeting_joined', meetingData);
  };

  const leaveMeeting = (meetingData: any) => {
    emit('meeting_left', meetingData);
  };

  return {
    isConnected,
    onMeetingStarted,
    onMeetingEnded,
    onParticipantJoined,
    onParticipantLeft,
    startMeeting,
    endMeeting,
    joinMeeting,
    leaveMeeting,
  };
}