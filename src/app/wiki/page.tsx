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
import { Book, FileText, Users, Search, Star, Clock, Plus, Edit, Eye, Share2, Settings, FolderOpen, Tag } from 'lucide-react';

export default function Wiki() {
  const [activeView, setActiveView] = useState('documents');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Mock data for documents
  const documents = [
    {
      id: 1,
      title: 'Getting Started Guide',
      description: 'Complete guide to get started with Oxlas',
      content: 'Welcome to Oxlas! This guide will help you understand all the features...',
      author: {
        name: 'John Doe',
        avatar: '/avatars/user.png',
      },
      collection: 'Documentation',
      tags: ['guide', 'onboarding'],
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z',
      views: 1245,
      isStarred: true,
    },
    {
      id: 2,
      title: 'API Documentation',
      description: 'Complete API reference for developers',
      content: 'The Oxlas API provides access to all platform features...',
      author: {
        name: 'Jane Smith',
        avatar: '/avatars/user.png',
      },
      collection: 'Developer',
      tags: ['api', 'developer', 'reference'],
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      views: 892,
      isStarred: false,
    },
    {
      id: 3,
      title: 'Team Collaboration Best Practices',
      description: 'How to effectively collaborate with your team',
      content: 'Effective team collaboration is key to productivity...',
      author: {
        name: 'Mike Wilson',
        avatar: '/avatars/user.png',
      },
      collection: 'Best Practices',
      tags: ['collaboration', 'team', 'productivity'],
      createdAt: '2024-01-13T16:20:00Z',
      updatedAt: '2024-01-14T10:30:00Z',
      views: 567,
      isStarred: true,
    },
  ];

  // Mock collections
  const collections = [
    {
      id: 1,
      name: 'Documentation',
      description: 'Official documentation and guides',
      documentCount: 15,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Developer',
      description: 'Technical documentation and API references',
      documentCount: 8,
      color: 'bg-green-500',
    },
    {
      id: 3,
      name: 'Best Practices',
      description: 'Team workflows and best practices',
      documentCount: 12,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      name: 'Company',
      description: 'Internal company documents',
      documentCount: 23,
      color: 'bg-orange-500',
    },
  ];

  // Mock recent activity
  const recentActivity = [
    {
      id: 1,
      action: 'created',
      documentTitle: 'Q1 2024 Planning',
      author: {
        name: 'Alice Brown',
        avatar: '/avatars/user.png',
      },
      timestamp: '2 hours ago',
    },
    {
      id: 2,
      action: 'updated',
      documentTitle: 'Employee Handbook',
      author: {
        name: 'Bob Johnson',
        avatar: '/avatars/user.png',
      },
      timestamp: '4 hours ago',
    },
    {
      id: 3,
      action: 'commented',
      documentTitle: 'Marketing Strategy',
      author: {
        name: 'Charlie Davis',
        avatar: '/avatars/user.png',
      },
      timestamp: '6 hours ago',
    },
  ];

  // Mock stats
  const stats = {
    totalDocuments: 58,
    totalCollections: 4,
    activeContributors: 12,
    totalViews: 15420,
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
              <p className="text-muted-foreground">Loading Oxlas Wiki...</p>
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
                <h1 className="text-3xl font-bold">Wiki</h1>
                <p className="text-muted-foreground mt-1">Collaborative documentation and knowledge base</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Document
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Documents</p>
                      <p className="text-2xl font-bold">{stats.totalDocuments}</p>
                    </div>
                    <FileText className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Collections</p>
                      <p className="text-2xl font-bold">{stats.totalCollections}</p>
                    </div>
                    <FolderOpen className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Contributors</p>
                      <p className="text-2xl font-bold">{stats.activeContributors}</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Views</p>
                      <p className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</p>
                    </div>
                    <Eye className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
              <TabsList>
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="collections">Collections</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>

              <TabsContent value="documents" className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search documents..." 
                    className="pl-10"
                  />
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{doc.title}</CardTitle>
                            <CardDescription>{doc.description}</CardDescription>
                          </div>
                          {doc.isStarred && (
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Author and Meta */}
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={doc.author.avatar} alt={doc.author.name} />
                                <AvatarFallback className="text-xs">
                                  {doc.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{doc.author.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {doc.views}
                              </span>
                              <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Collection */}
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{doc.collection}</Badge>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="sm">
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="collections" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {collections.map((collection) => (
                    <Card key={collection.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={`w-4 h-4 rounded-full ${collection.color}`}></div>
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardTitle>{collection.name}</CardTitle>
                        <CardDescription>{collection.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {collection.documentCount} documents
                          </span>
                          <Button variant="outline" size="sm">
                            View Collection
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="border-dashed hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center h-48">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create Collection</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Organize related documents
                      </p>
                      <Button>Create Collection</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="activity" className="space-y-4">
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-10 h-10">
                              <AvatarImage src={activity.author.avatar} alt={activity.author.name} />
                              <AvatarFallback>
                                {activity.author.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">
                                <span className="text-muted-foreground">{activity.author.name}</span>{' '}
                                {activity.action}{' '}
                                <span className="font-medium">{activity.documentTitle}</span>
                              </p>
                              <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="starred" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.filter(doc => doc.isStarred).map((doc) => (
                    <Card key={doc.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg mb-1">{doc.title}</CardTitle>
                            <CardDescription>{doc.description}</CardDescription>
                          </div>
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarImage src={doc.author.avatar} alt={doc.author.name} />
                                <AvatarFallback className="text-xs">
                                  {doc.author.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span>{doc.author.name}</span>
                            </div>
                            <span>{new Date(doc.updatedAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary">{doc.collection}</Badge>
                            <Button variant="outline" size="sm">
                              Read
                            </Button>
                          </div>
                        </div>
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