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
import { MessageSquare, Users, Hash, Phone, Video, Plus, Search, MoreHorizontal, Paperclip, Smile, Send, Bell, Settings, Lock } from 'lucide-react';

export default function Chat() {
  const [activeView, setActiveView] = useState('channels');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Mock data for channels
  const channels = [
    {
      id: 1,
      name: 'general',
      description: 'Company-wide announcements and discussions',
      type: 'public',
      memberCount: 45,
      unreadCount: 0,
      isMuted: false,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      name: 'development',
      description: 'Development team discussions',
      type: 'public',
      memberCount: 12,
      unreadCount: 5,
      isMuted: false,
      lastActivity: '30 minutes ago',
    },
    {
      id: 3,
      name: 'design-team',
      description: 'Design team collaboration',
      type: 'private',
      memberCount: 8,
      unreadCount: 2,
      isMuted: false,
      lastActivity: '1 hour ago',
    },
    {
      id: 4,
      name: 'project-alpha',
      description: 'Project Alpha discussions',
      type: 'private',
      memberCount: 6,
      unreadCount: 0,
      isMuted: true,
      lastActivity: '3 hours ago',
    },
  ];

  // Mock data for direct messages
  const directMessages = [
    {
      id: 1,
      user: {
        name: 'Alice Brown',
        avatar: '/avatars/user.png',
        status: 'online',
      },
      lastMessage: 'Hey, did you review the PR?',
      timestamp: '10:30 AM',
      unreadCount: 1,
      isTyping: false,
    },
    {
      id: 2,
      user: {
        name: 'Bob Johnson',
        avatar: '/avatars/user.png',
        status: 'away',
      },
      lastMessage: 'Meeting at 2 PM today',
      timestamp: '9:15 AM',
      unreadCount: 0,
      isTyping: false,
    },
    {
      id: 3,
      user: {
        name: 'Charlie Davis',
        avatar: '/avatars/user.png',
        status: 'offline',
      },
      lastMessage: 'Thanks for the help!',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isTyping: false,
    },
    {
      id: 4,
      user: {
        name: 'Diana Miller',
        avatar: '/avatars/user.png',
        status: 'online',
      },
      lastMessage: 'Looking forward to it!',
      timestamp: 'Yesterday',
      unreadCount: 0,
      isTyping: true,
    },
  ];

  // Mock messages for active channel
  const messages = [
    {
      id: 1,
      user: {
        name: 'Alice Brown',
        avatar: '/avatars/user.png',
      },
      content: 'Hey team! Just wanted to share that the new feature is now live in production 🎉',
      timestamp: '10:30 AM',
      reactions: [{ emoji: '🎉', count: 3 }],
    },
    {
      id: 2,
      user: {
        name: 'Bob Johnson',
        avatar: '/avatars/user.png',
      },
      content: 'That\'s great news! Nice work everyone 👏',
      timestamp: '10:32 AM',
      reactions: [{ emoji: '👏', count: 2 }],
    },
    {
      id: 3,
      user: {
        name: 'Charlie Davis',
        avatar: '/avatars/user.png',
      },
      content: 'Can someone help me with the API documentation? I\'m having trouble understanding the authentication flow.',
      timestamp: '10:35 AM',
      reactions: [],
    },
    {
      id: 4,
      user: {
        name: 'You',
        avatar: '/avatars/user.png',
        isCurrentUser: true,
      },
      content: 'Sure! I can walk you through it. Let me know when you\'re free.',
      timestamp: '10:36 AM',
      reactions: [],
    },
  ];

  // Mock stats
  const stats = {
    totalChannels: 12,
    totalMembers: 45,
    activeNow: 8,
    unreadMessages: 8,
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'offline': return 'bg-gray-400';
      default: return 'bg-gray-400';
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
              <p className="text-muted-foreground">Loading Oxlas Chat...</p>
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
        
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Sidebar */}
            <div className="w-64 border-r flex flex-col">
              {/* Header */}
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold">Oxlas Chat</h2>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
                <Button className="w-full" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Channel
                </Button>
              </div>

              {/* Stats */}
              <div className="p-4 border-b">
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div>
                    <p className="text-2xl font-bold">{stats.activeNow}</p>
                    <p className="text-xs text-muted-foreground">Active Now</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.unreadMessages}</p>
                    <p className="text-xs text-muted-foreground">Unread</p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <Tabs value={activeView} onValueChange={setActiveView} className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-2 m-2">
                  <TabsTrigger value="channels" className="text-xs">Channels</TabsTrigger>
                  <TabsTrigger value="dms" className="text-xs">Direct</TabsTrigger>
                </TabsList>

                <TabsContent value="channels" className="flex-1 overflow-auto p-2 space-y-1">
                  {channels.map((channel) => (
                    <div
                      key={channel.id}
                      className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Hash className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{channel.name}</span>
                              {channel.type === 'private' && (
                                <Lock className="h-3 w-3 text-muted-foreground" />
                              )}
                              {channel.isMuted && (
                                <Bell className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {channel.description}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {channel.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {channel.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {channel.memberCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="dms" className="flex-1 overflow-auto p-2 space-y-1">
                  {directMessages.map((dm) => (
                    <div
                      key={dm.id}
                      className="p-2 rounded-lg hover:bg-muted cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={dm.user.avatar} alt={dm.user.name} />
                              <AvatarFallback className="text-xs">
                                {dm.user.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ${getStatusColor(dm.user.status)}`}></div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm">{dm.user.name}</span>
                              {dm.isTyping && (
                                <span className="text-xs text-muted-foreground">typing...</span>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground truncate">
                              {dm.lastMessage}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          {dm.unreadCount > 0 && (
                            <Badge variant="default" className="text-xs">
                              {dm.unreadCount}
                            </Badge>
                          )}
                          <span className="text-xs text-muted-foreground">
                            {dm.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h2 className="font-semibold">general</h2>
                    <p className="text-sm text-muted-foreground">Company-wide announcements and discussions</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex gap-3">
                    <Avatar className="w-8 h-8 flex-shrink-0">
                      <AvatarImage src={message.user.avatar} alt={message.user.name} />
                      <AvatarFallback className="text-xs">
                        {message.user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`font-medium ${message.isCurrentUser ? 'text-primary' : ''}`}>
                          {message.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {message.timestamp}
                        </span>
                      </div>
                      <p className="text-sm">{message.content}</p>
                      {message.reactions.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {reaction.emoji} {reaction.count}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Paperclip className="h-4 w-4" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input 
                      placeholder="Message #general" 
                      className="pr-10"
                    />
                    <Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
                      <Smile className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button size="sm">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Members Sidebar */}
            <div className="w-48 border-r p-4">
              <h3 className="font-semibold mb-4">Members — {stats.totalMembers}</h3>
              <div className="space-y-2">
                {directMessages.map((dm) => (
                  <div key={dm.id} className="flex items-center gap-2">
                    <div className="relative">
                      <Avatar className="w-6 h-6">
                        <AvatarImage src={dm.user.avatar} alt={dm.user.name} />
                        <AvatarFallback className="text-xs">
                          {dm.user.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full ${getStatusColor(dm.user.status)}`}></div>
                    </div>
                    <span className="text-sm">{dm.user.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}