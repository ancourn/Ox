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
import { Clipboard, BarChart3, Users, Eye, Share2, Plus, Search, Filter, Settings, Download, Copy, ExternalLink, Star } from 'lucide-react';

export default function Forms() {
  const [activeView, setActiveView] = useState('forms');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Mock data for forms
  const forms = [
    {
      id: 1,
      title: 'Customer Feedback Survey',
      description: 'Collect feedback from customers about our products and services',
      type: 'survey',
      status: 'active',
      responses: 245,
      views: 1820,
      createdAt: '2024-01-10T10:30:00Z',
      lastResponse: '2024-01-15T14:45:00Z',
      author: {
        name: 'John Doe',
        avatar: '/avatars/user.png',
      },
      isStarred: true,
    },
    {
      id: 2,
      title: 'Employee Onboarding',
      description: 'New employee onboarding form for HR department',
      type: 'onboarding',
      status: 'active',
      responses: 18,
      views: 156,
      createdAt: '2024-01-08T09:15:00Z',
      lastResponse: '2024-01-15T11:20:00Z',
      author: {
        name: 'Jane Smith',
        avatar: '/avatars/user.png',
      },
      isStarred: false,
    },
    {
      id: 3,
      title: 'Event Registration',
      description: 'Registration form for the annual company conference',
      type: 'registration',
      status: 'draft',
      responses: 0,
      views: 89,
      createdAt: '2024-01-12T16:20:00Z',
      lastResponse: null,
      author: {
        name: 'Mike Wilson',
        avatar: '/avatars/user.png',
      },
      isStarred: false,
    },
    {
      id: 4,
      title: 'Product Feature Request',
      description: 'Collect feature requests and ideas from users',
      type: 'feedback',
      status: 'active',
      responses: 67,
      views: 445,
      createdAt: '2024-01-05T14:30:00Z',
      lastResponse: '2024-01-14T09:15:00Z',
      author: {
        name: 'Alice Brown',
        avatar: '/avatars/user.png',
      },
      isStarred: true,
    },
  ];

  // Mock responses
  const recentResponses = [
    {
      id: 1,
      formTitle: 'Customer Feedback Survey',
      respondent: 'customer@example.com',
      submittedAt: '2 hours ago',
      status: 'new',
    },
    {
      id: 2,
      formTitle: 'Employee Onboarding',
      respondent: 'new.employee@company.com',
      submittedAt: '4 hours ago',
      status: 'reviewed',
    },
    {
      id: 3,
      formTitle: 'Product Feature Request',
      respondent: 'user@example.com',
      submittedAt: '6 hours ago',
      status: 'new',
    },
  ];

  // Mock analytics
  const analytics = {
    totalForms: forms.length,
    totalResponses: forms.reduce((acc, form) => acc + form.responses, 0),
    totalViews: forms.reduce((acc, form) => acc + form.views, 0),
    completionRate: 68,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'draft': return 'bg-yellow-500';
      case 'closed': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'survey': return 'text-blue-600';
      case 'onboarding': return 'text-green-600';
      case 'registration': return 'text-purple-600';
      case 'feedback': return 'text-orange-600';
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
              <p className="text-muted-foreground">Loading Oxlas Forms...</p>
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
                <h1 className="text-3xl font-bold">Forms</h1>
                <p className="text-muted-foreground mt-1">Create forms, collect feedback, and analyze responses</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Form
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Forms</p>
                      <p className="text-2xl font-bold">{analytics.totalForms}</p>
                    </div>
                    <Clipboard className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Responses</p>
                      <p className="text-2xl font-bold">{analytics.totalResponses}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{analytics.totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completion Rate</p>
                      <p className="text-2xl font-bold">{analytics.completionRate}%</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
              <TabsList>
                <TabsTrigger value="forms">Forms</TabsTrigger>
                <TabsTrigger value="responses">Responses</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="templates">Templates</TabsTrigger>
              </TabsList>

              <TabsContent value="forms" className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search forms..." 
                    className="pl-10"
                  />
                </div>

                {/* Forms Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {forms.map((form) => (
                    <Card key={form.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-medium">{form.title}</h3>
                              {form.isStarred && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{form.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${getStatusColor(form.status)}`}></div>
                            <Settings className="h-4 w-4 text-muted-foreground" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Type and Status */}
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getTypeColor(form.type)}>
                              {form.type}
                            </Badge>
                            <Badge variant="secondary">{form.status}</Badge>
                          </div>

                          {/* Stats */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {form.responses} responses
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {form.views} views
                            </span>
                          </div>

                          {/* Author and Date */}
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={form.author.avatar} alt={form.author.name} />
                                <AvatarFallback className="text-xs">
                                  {form.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-muted-foreground">{form.author.name}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-1">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share2 className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="h-3 w-3" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="responses" className="space-y-4">
                <div className="space-y-3">
                  {recentResponses.map((response) => (
                    <Card key={response.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${response.status === 'new' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                            <div>
                              <p className="font-medium">{response.formTitle}</p>
                              <p className="text-sm text-muted-foreground">{response.respondent}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm text-muted-foreground">{response.submittedAt}</span>
                            <Badge variant={response.status === 'new' ? 'default' : 'secondary'}>
                              {response.status}
                            </Badge>
                            <Button variant="outline" size="sm">
                              View Response
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Response Overview</CardTitle>
                      <CardDescription>Summary of form submissions</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span>Total Responses</span>
                          <span className="font-bold">{analytics.totalResponses}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span>Completion Rate</span>
                          <span className="font-bold">{analytics.completionRate}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" 
                            style={{ width: `${analytics.completionRate}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>Popular Forms</CardTitle>
                      <CardDescription>Most viewed and submitted forms</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {forms.slice(0, 3).map((form) => (
                          <div key={form.id} className="flex justify-between items-center">
                            <span className="text-sm">{form.title}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-muted-foreground">{form.responses}</span>
                              <Users className="h-3 w-3 text-muted-foreground" />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="templates" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { name: 'Customer Satisfaction', description: 'Measure customer satisfaction levels', icon: '📊' },
                    { name: 'Employee Feedback', description: 'Collect employee feedback and suggestions', icon: '👥' },
                    { name: 'Event Registration', description: 'Event sign-up and registration form', icon: '📅' },
                    { name: 'Contact Form', description: 'General contact and inquiry form', icon: '📧' },
                    { name: 'Survey Template', description: 'General purpose survey template', icon: '📋' },
                    { name: 'Feedback Form', description: 'Product or service feedback form', icon: '💬' },
                  ].map((template, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-4">{template.icon}</div>
                        <h3 className="font-medium mb-2">{template.name}</h3>
                        <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                        <Button variant="outline" size="sm">
                          Use Template
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}