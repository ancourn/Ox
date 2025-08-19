'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Headset, Users, MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, Plus, Search, Filter, Settings } from 'lucide-react';

export default function Care() {
  const [activeView, setActiveView] = useState('tickets');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Mock data for tickets
  const tickets = [
    {
      id: 'TK-001',
      title: 'Cannot access my account',
      description: 'User is unable to login to their account',
      status: 'open',
      priority: 'high',
      customer: {
        name: 'John Doe',
        email: 'john@example.com',
        avatar: '/avatars/user.png',
      },
      assignee: {
        name: 'Alice Brown',
        avatar: '/avatars/user.png',
      },
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z',
      category: 'Account',
    },
    {
      id: 'TK-002',
      title: 'Feature request: Dark mode',
      description: 'Customer would like to see a dark mode option',
      status: 'in-progress',
      priority: 'medium',
      customer: {
        name: 'Jane Smith',
        email: 'jane@example.com',
        avatar: '/avatars/user.png',
      },
      assignee: {
        name: 'Bob Johnson',
        avatar: '/avatars/user.png',
      },
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      category: 'Feature Request',
    },
    {
      id: 'TK-003',
      title: 'Payment processing error',
      description: 'Customer received an error during payment',
      status: 'resolved',
      priority: 'high',
      customer: {
        name: 'Mike Wilson',
        email: 'mike@example.com',
        avatar: '/avatars/user.png',
      },
      assignee: {
        name: 'Charlie Davis',
        avatar: '/avatars/user.png',
      },
      createdAt: '2024-01-13T16:20:00Z',
      updatedAt: '2024-01-14T10:30:00Z',
      category: 'Billing',
    },
  ];

  // Mock stats
  const stats = {
    totalTickets: 156,
    openTickets: 23,
    resolvedToday: 8,
    avgResponseTime: '2.5 hours',
  };

  // Mock agents
  const agents = [
    { name: 'Alice Brown', status: 'online', tickets: 5, avatar: '/avatars/user.png' },
    { name: 'Bob Johnson', status: 'online', tickets: 3, avatar: '/avatars/user.png' },
    { name: 'Charlie Davis', status: 'offline', tickets: 0, avatar: '/avatars/user.png' },
    { name: 'Diana Miller', status: 'online', tickets: 7, avatar: '/avatars/user.png' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-500';
      case 'in-progress': return 'bg-yellow-500';
      case 'resolved': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Oxlas Care...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold">Care</h1>
                <p className="text-muted-foreground mt-1">Customer support and helpdesk management</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Ticket
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tickets</p>
                      <p className="text-2xl font-bold">{stats.totalTickets}</p>
                    </div>
                    <MessageSquare className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Open Tickets</p>
                      <p className="text-2xl font-bold">{stats.openTickets}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Resolved Today</p>
                      <p className="text-2xl font-bold">{stats.resolvedToday}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                      <p className="text-2xl font-bold">{stats.avgResponseTime}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
              <TabsList>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="customers">Customers</TabsTrigger>
                <TabsTrigger value="agents">Agents</TabsTrigger>
                <TabsTrigger value="knowledge">Knowledge Base</TabsTrigger>
              </TabsList>

              <TabsContent value="tickets" className="space-y-4">
                {/* Search and Filter */}
                <div className="flex gap-4 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search tickets..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </div>

                {/* Tickets List */}
                <div className="space-y-3">
                  {tickets.map((ticket) => (
                    <Card key={ticket.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(ticket.status)}`}></div>
                              <h3 className="font-medium">{ticket.title}</h3>
                              <Badge variant="outline" className={getPriorityColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                              <Badge variant="secondary">{ticket.category}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{ticket.description}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Avatar className="w-6 h-6">
                                  <AvatarImage src={ticket.customer.avatar} alt={ticket.customer.name} />
                                  <AvatarFallback className="text-xs">
                                    {ticket.customer.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{ticket.customer.name}</span>
                              </div>
                              <span>•</span>
                              <span>{ticket.id}</span>
                              <span>•</span>
                              <span>Updated {new Date(ticket.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {ticket.assignee && (
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={ticket.assignee.avatar} alt={ticket.assignee.name} />
                                <AvatarFallback className="text-xs">
                                  {ticket.assignee.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <Button variant="outline" size="sm">
                              View
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="customers" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Customer Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Manage customer profiles and interaction history
                    </p>
                    <Button>View Customers</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="agents" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {agents.map((agent, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={agent.avatar} alt={agent.name} />
                            <AvatarFallback>
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`w-3 h-3 rounded-full ${agent.status === 'online' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        </div>
                        <h3 className="font-medium">{agent.name}</h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          {agent.status === 'online' ? 'Online' : 'Offline'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {agent.tickets} tickets
                          </span>
                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="knowledge" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Headset className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Knowledge Base</h3>
                    <p className="text-muted-foreground mb-4">
                      Self-service help articles and documentation
                    </p>
                    <Button>Browse Articles</Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}