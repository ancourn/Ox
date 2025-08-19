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
import { StickyNote, Search, Plus, Star, Tag, Clock, FolderOpen, Share2, Edit, Trash2, MoreHorizontal, FileText, Image, Link, CheckSquare } from 'lucide-react';

export default function Notes() {
  const [activeView, setActiveView] = useState('notes');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Mock data for notes
  const notes = [
    {
      id: 1,
      title: 'Meeting Notes - Q1 Planning',
      content: 'Discussed Q1 goals and objectives. Key focus areas: product development, customer acquisition, team expansion.',
      type: 'text',
      tags: ['meeting', 'planning', 'q1'],
      notebook: 'Work',
      isStarred: true,
      isPinned: true,
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-15T14:45:00Z',
      author: {
        name: 'John Doe',
        avatar: '/avatars/user.png',
      },
    },
    {
      id: 2,
      title: 'Project Ideas',
      content: '1. Mobile app redesign\n2. API documentation improvement\n3. Customer portal enhancement',
      type: 'checklist',
      tags: ['ideas', 'projects'],
      notebook: 'Work',
      isStarred: false,
      isPinned: false,
      createdAt: '2024-01-14T09:15:00Z',
      updatedAt: '2024-01-15T11:20:00Z',
      author: {
        name: 'Jane Smith',
        avatar: '/avatars/user.png',
      },
    },
    {
      id: 3,
      title: 'Shopping List',
      content: '• Milk\n• Bread\n• Eggs\n• Fruits\n• Vegetables',
      type: 'checklist',
      tags: ['personal', 'shopping'],
      notebook: 'Personal',
      isStarred: false,
      isPinned: false,
      createdAt: '2024-01-13T16:20:00Z',
      updatedAt: '2024-01-13T16:20:00Z',
      author: {
        name: 'Mike Wilson',
        avatar: '/avatars/user.png',
      },
    },
    {
      id: 4,
      title: 'Book Recommendations',
      content: 'Recently read and recommended books:\n\n1. "Atomic Habits" by James Clear\n2. "The Lean Startup" by Eric Ries\n3. "Deep Work" by Cal Newport',
      type: 'text',
      tags: ['books', 'reading', 'recommendations'],
      notebook: 'Personal',
      isStarred: true,
      isPinned: false,
      createdAt: '2024-01-12T14:30:00Z',
      updatedAt: '2024-01-14T09:15:00Z',
      author: {
        name: 'Alice Brown',
        avatar: '/avatars/user.png',
      },
    },
  ];

  // Mock notebooks
  const notebooks = [
    {
      id: 1,
      name: 'Work',
      description: 'Work-related notes and documents',
      noteCount: 15,
      color: 'bg-blue-500',
    },
    {
      id: 2,
      name: 'Personal',
      description: 'Personal notes and ideas',
      noteCount: 8,
      color: 'bg-green-500',
    },
    {
      id: 3,
      name: 'Learning',
      description: 'Learning resources and study notes',
      noteCount: 12,
      color: 'bg-purple-500',
    },
    {
      id: 4,
      name: 'Archive',
      description: 'Archived and old notes',
      noteCount: 23,
      color: 'bg-gray-500',
    },
  ];

  // Mock tags
  const tags = [
    { name: 'meeting', count: 8, color: 'bg-blue-200' },
    { name: 'ideas', count: 12, color: 'bg-green-200' },
    { name: 'personal', count: 6, color: 'bg-purple-200' },
    { name: 'work', count: 15, color: 'bg-orange-200' },
    { name: 'important', count: 4, color: 'bg-red-200' },
  ];

  // Mock stats
  const stats = {
    totalNotes: notes.length,
    totalNotebooks: notebooks.length,
    starredNotes: notes.filter(note => note.isStarred).length,
    recentEdits: 3,
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'text': return <FileText className="h-4 w-4" />;
      case 'checklist': return <CheckSquare className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      case 'link': return <Link className="h-4 w-4" />;
      default: return <StickyNote className="h-4 w-4" />;
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
              <p className="text-muted-foreground">Loading Oxlas Notes...</p>
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
                <h1 className="text-3xl font-bold">Notes</h1>
                <p className="text-muted-foreground mt-1">Capture ideas, organize thoughts, and stay productive</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Note
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Notes</p>
                      <p className="text-2xl font-bold">{stats.totalNotes}</p>
                    </div>
                    <StickyNote className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Notebooks</p>
                      <p className="text-2xl font-bold">{stats.totalNotebooks}</p>
                    </div>
                    <FolderOpen className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Starred</p>
                      <p className="text-2xl font-bold">{stats.starredNotes}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Recent Edits</p>
                      <p className="text-2xl font-bold">{stats.recentEdits}</p>
                    </div>
                    <Clock className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
              <TabsList>
                <TabsTrigger value="notes">All Notes</TabsTrigger>
                <TabsTrigger value="notebooks">Notebooks</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search notes..." 
                    className="pl-10"
                  />
                </div>

                {/* Pinned Notes */}
                {notes.filter(note => note.isPinned).length > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-3">Pinned</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                      {notes.filter(note => note.isPinned).map((note) => (
                        <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-yellow-500">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  {getTypeIcon(note.type)}
                                  <h3 className="font-medium">{note.title}</h3>
                                  {note.isStarred && (
                                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                  )}
                                </div>
                              </div>
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                              {note.content}
                            </p>
                            <div className="flex flex-wrap gap-1 mb-3">
                              {note.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  <Tag className="h-3 w-3 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{note.notebook}</span>
                              <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* All Notes */}
                <h3 className="text-lg font-medium mb-3">All Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.filter(note => !note.isPinned).map((note) => (
                    <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(note.type)}
                              <h3 className="font-medium">{note.title}</h3>
                              {note.isStarred && (
                                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                              )}
                            </div>
                          </div>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{note.notebook}</span>
                          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notebooks" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notebooks.map((notebook) => (
                    <Card key={notebook.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className={`w-4 h-4 rounded-full ${notebook.color}`}></div>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <CardTitle>{notebook.name}</CardTitle>
                        <CardDescription>{notebook.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {notebook.noteCount} notes
                          </span>
                          <Button variant="outline" size="sm">
                            Open
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="border-dashed hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center h-48">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create Notebook</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Organize your notes
                      </p>
                      <Button>Create Notebook</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tags" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {tags.map((tag, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${tag.color}`}></div>
                            <span className="font-medium">#{tag.name}</span>
                          </div>
                          <Badge variant="secondary">{tag.count}</Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="starred" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {notes.filter(note => note.isStarred).map((note) => (
                    <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              {getTypeIcon(note.type)}
                              <h3 className="font-medium">{note.title}</h3>
                              <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            </div>
                          </div>
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                          {note.content}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {note.tags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              <Tag className="h-3 w-3 mr-1" />
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>{note.notebook}</span>
                          <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
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