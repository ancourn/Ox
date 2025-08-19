import { Router } from 'express';
import { authenticateToken, validateRequest, calendarEventValidation } from '../middleware/validation';

const router = Router();

// Mock calendar events storage
const events: any[] = [];
let eventIdCounter = 1;

// Get all events for user
router.get('/', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const userEvents = events.filter(event => 
    event.attendees.some((attendee: any) => attendee.id === userId) ||
    event.organizer === userId
  );
  
  res.json({
    success: true,
    events: userEvents
  });
});

// Get events by date range
router.get('/range', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const { start, end } = req.query;
  
  if (!start || !end) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Start and end dates are required'
    });
  }
  
  const startDate = new Date(start as string);
  const endDate = new Date(end as string);
  
  const rangeEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    const eventEnd = new Date(event.end);
    const isUserEvent = event.attendees.some((attendee: any) => attendee.id === userId) ||
                       event.organizer === userId;
    
    return isUserEvent && eventStart >= startDate && eventEnd <= endDate;
  });
  
  res.json({
    success: true,
    events: rangeEvents
  });
});

// Get single event
router.get('/:id', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const eventId = req.params.id;
  
  const event = events.find(e => 
    e.id === eventId && 
    (e.attendees.some((attendee: any) => attendee.id === userId) || e.organizer === userId)
  );
  
  if (!event) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Event not found'
    });
  }
  
  res.json({
    success: true,
    event
  });
});

// Create event
router.post('/', authenticateToken, calendarEventValidation, validateRequest, (req, res) => {
  try {
    const userId = (req as any).user.id;
    const { title, start, end, description, location, attendees, isAllDay, recurrence } = req.body;
    
    const event = {
      id: eventIdCounter.toString(),
      title,
      start,
      end,
      description: description || '',
      location: location || '',
      organizer: userId,
      attendees: attendees || [],
      isAllDay: isAllDay || false,
      recurrence: recurrence || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    events.push(event);
    eventIdCounter++;
    
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    console.error('Event creation error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to create event'
    });
  }
});

// Update event
router.put('/:id', authenticateToken, calendarEventValidation, validateRequest, (req, res) => {
  try {
    const userId = (req as any).user.id;
    const eventId = req.params.id;
    const { title, start, end, description, location, attendees, isAllDay, recurrence } = req.body;
    
    const eventIndex = events.findIndex(e => 
      e.id === eventId && e.organizer === userId
    );
    
    if (eventIndex === -1) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'Event not found or you are not the organizer'
      });
    }
    
    const updatedEvent = {
      ...events[eventIndex],
      title,
      start,
      end,
      description: description || '',
      location: location || '',
      attendees: attendees || [],
      isAllDay: isAllDay || false,
      recurrence: recurrence || null,
      updatedAt: new Date().toISOString()
    };
    
    events[eventIndex] = updatedEvent;
    
    res.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent
    });
  } catch (error) {
    console.error('Event update error:', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to update event'
    });
  }
});

// Delete event
router.delete('/:id', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const eventId = req.params.id;
  
  const eventIndex = events.findIndex(e => 
    e.id === eventId && e.organizer === userId
  );
  
  if (eventIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Event not found or you are not the organizer'
    });
  }
  
  events.splice(eventIndex, 1);
  
  res.json({
    success: true,
    message: 'Event deleted successfully'
  });
});

// Add attendee to event
router.post('/:id/attendees', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const eventId = req.params.id;
  const { attendee } = req.body;
  
  const event = events.find(e => 
    e.id === eventId && e.organizer === userId
  );
  
  if (!event) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Event not found or you are not the organizer'
    });
  }
  
  // Check if attendee already exists
  const existingAttendee = event.attendees.find((a: any) => a.id === attendee.id);
  if (existingAttendee) {
    return res.status(409).json({
      error: 'Conflict',
      message: 'Attendee already exists'
    });
  }
  
  event.attendees.push(attendee);
  event.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Attendee added successfully',
    event
  });
});

// Remove attendee from event
router.delete('/:id/attendees/:attendeeId', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const eventId = req.params.id;
  const attendeeId = req.params.attendeeId;
  
  const event = events.find(e => 
    e.id === eventId && e.organizer === userId
  );
  
  if (!event) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Event not found or you are not the organizer'
    });
  }
  
  const attendeeIndex = event.attendees.findIndex((a: any) => a.id === attendeeId);
  if (attendeeIndex === -1) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Attendee not found'
    });
  }
  
  event.attendees.splice(attendeeIndex, 1);
  event.updatedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Attendee removed successfully',
    event
  });
});

// Get events for today
router.get('/today', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  
  const todayEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    const isUserEvent = event.attendees.some((attendee: any) => attendee.id === userId) ||
                       event.organizer === userId;
    
    return isUserEvent && eventStart >= startOfDay && eventStart < endOfDay;
  });
  
  res.json({
    success: true,
    events: todayEvents
  });
});

// Get upcoming events (next 7 days)
router.get('/upcoming', authenticateToken, (req, res) => {
  const userId = (req as any).user.id;
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  const upcomingEvents = events.filter(event => {
    const eventStart = new Date(event.start);
    const isUserEvent = event.attendees.some((attendee: any) => attendee.id === userId) ||
                       event.organizer === userId;
    
    return isUserEvent && eventStart >= now && eventStart <= nextWeek;
  });
  
  // Sort by start time
  upcomingEvents.sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime());
  
  res.json({
    success: true,
    events: upcomingEvents
  });
});

export default router;