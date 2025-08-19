'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Plus,
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
} from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Team Standup',
    date: '2024-01-15',
    time: '09:00 AM',
    endTime: '09:30 AM',
    type: 'meeting',
    location: 'Conference Room A',
    attendees: ['John Doe', 'Jane Smith', 'Bob Johnson'],
    description: 'Daily team standup meeting to discuss progress and blockers.',
    color: 'bg-blue-500',
  },
  {
    id: 2,
    title: 'Client Presentation',
    date: '2024-01-15',
    time: '02:00 PM',
    endTime: '03:30 PM',
    type: 'presentation',
    location: 'Zoom Meeting',
    attendees: ['John Doe', 'Sarah Wilson', 'Mike Brown'],
    description: 'Quarterly review presentation for key client.',
    color: 'bg-green-500',
  },
  {
    id: 3,
    title: 'Project Deadline',
    date: '2024-01-16',
    time: '11:59 PM',
    endTime: '11:59 PM',
    type: 'deadline',
    location: '',
    attendees: ['Development Team'],
    description: 'Final deadline for Q1 project deliverables.',
    color: 'bg-red-500',
  },
  {
    id: 4,
    title: 'Training Session',
    date: '2024-01-17',
    time: '10:00 AM',
    endTime: '12:00 PM',
    type: 'training',
    location: 'Training Room B',
    attendees: ['All Staff'],
    description: 'New software training session for all employees.',
    color: 'bg-purple-500',
  },
  {
    id: 5,
    title: '1:1 with Manager',
    date: '2024-01-17',
    time: '03:00 PM',
    endTime: '03:30 PM',
    type: 'meeting',
    location: 'Office 101',
    attendees: ['John Doe', 'Jane Smith'],
    description: 'Weekly one-on-one meeting with manager.',
    color: 'bg-orange-500',
  },
];

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [view, setView] = useState('day');

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getEventsForWeek = (date: Date) => {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay());
    
    const weekEvents = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekEvents.push({
        date: day,
        events: getEventsForDate(day),
      });
    }
    return weekEvents;
  };

  const formatTime = (time: string) => {
    return time;
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'meeting':
        return <Users className="h-4 w-4" />;
      case 'presentation':
        return <Video className="h-4 w-4" />;
      case 'deadline':
        return <Clock className="h-4 w-4" />;
      case 'training':
        return <Calendar className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const todayEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const weekEvents = selectedDate ? getEventsForWeek(selectedDate) : [];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Calendar" />
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">Calendar</h1>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <span className="font-medium">January 2024</span>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Event
                </Button>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Calendar Sidebar */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Calendar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CalendarComponent
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      className="rounded-md border"
                    />
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">Upcoming Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {events.slice(0, 5).map((event) => (
                        <div key={event.id} className="flex items-start gap-3">
                          <div className={`w-1 h-12 ${event.color} rounded-full mt-1`}></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{event.title}</p>
                            <p className="text-xs text-muted-foreground">
                              {event.date} • {event.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Calendar View */}
              <div className="lg:col-span-3">
                <Tabs value={view} onValueChange={setView}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="day">Day</TabsTrigger>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                  </TabsList>

                  <TabsContent value="day" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>
                          {selectedDate?.toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {todayEvents.length > 0 ? (
                            todayEvents.map((event) => (
                              <div key={event.id} className="flex gap-4 p-4 border rounded-lg">
                                <div className={`w-1 ${event.color} rounded-full`}></div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-medium">{event.title}</h3>
                                    <Badge variant="outline">{event.type}</Badge>
                                  </div>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                                    <div className="flex items-center gap-1">
                                      <Clock className="h-4 w-4" />
                                      <span>{event.time} - {event.endTime}</span>
                                    </div>
                                    {event.location && (
                                      <div className="flex items-center gap-1">
                                        <MapPin className="h-4 w-4" />
                                        <span>{event.location}</span>
                                      </div>
                                    )}
                                  </div>
                                  <p className="text-sm mb-3">{event.description}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Attendees:</span>
                                    <div className="flex -space-x-2">
                                      {event.attendees.slice(0, 3).map((attendee, index) => (
                                        <Avatar key={index} className="h-6 w-6 border-2 border-background">
                                          <AvatarFallback className="text-xs">
                                            {attendee.split(' ').map(n => n[0]).join('')}
                                          </AvatarFallback>
                                        </Avatar>
                                      ))}
                                      {event.attendees.length > 3 && (
                                        <div className="h-6 w-6 rounded-full border-2 border-background bg-muted flex items-center justify-center">
                                          <span className="text-xs">+{event.attendees.length - 3}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-muted-foreground">
                              No events scheduled for today
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="week" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Week View</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid gap-4">
                          {weekEvents.map((day) => (
                            <div key={day.date.toDateString()} className="border rounded-lg p-4">
                              <h3 className="font-medium mb-3">
                                {day.date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                              </h3>
                              <div className="space-y-2">
                                {day.events.length > 0 ? (
                                  day.events.map((event) => (
                                    <div key={event.id} className="flex items-center gap-3 p-2 bg-muted/50 rounded">
                                      <div className={`w-2 h-2 ${event.color} rounded-full`}></div>
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{event.title}</p>
                                        <p className="text-xs text-muted-foreground">
                                          {event.time} - {event.endTime}
                                        </p>
                                      </div>
                                      <div className="flex items-center gap-1">
                                        {getEventIcon(event.type)}
                                        {event.attendees.length > 0 && (
                                          <span className="text-xs text-muted-foreground">
                                            {event.attendees.length}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-sm text-muted-foreground">No events</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="month" className="mt-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Month View</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-center py-8 text-muted-foreground">
                          Month view coming soon...
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}