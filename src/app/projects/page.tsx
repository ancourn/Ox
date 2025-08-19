'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Kanban, Users, Calendar, Star, Plus, Settings, Filter, Search } from 'lucide-react';

export default function Projects() {
  const [activeView, setActiveView] = useState('boards');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useState(() => {
    setTimeout(() => setIsLoading(false), 1000);
  });

  // Mock data for projects
  const projects = [
    {
      id: 1,
      name: 'Website Redesign',
      description: 'Complete redesign of company website',
      progress: 75,
      status: 'active',
      team: [
        { name: 'John Doe', avatar: '/avatars/user.png' },
        { name: 'Jane Smith', avatar: '/avatars/user.png' },
        { name: 'Bob Johnson', avatar: '/avatars/user.png' },
      ],
      dueDate: '2024-02-15',
      tasks: { total: 24, completed: 18 },
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Native iOS and Android app development',
      progress: 45,
      status: 'active',
      team: [
        { name: 'Alice Brown', avatar: '/avatars/user.png' },
        { name: 'Charlie Wilson', avatar: '/avatars/user.png' },
      ],
      dueDate: '2024-03-30',
      tasks: { total: 36, completed: 16 },
    },
    {
      id: 3,
      name: 'Marketing Campaign',
      description: 'Q1 2024 marketing campaign launch',
      progress: 90,
      status: 'active',
      team: [
        { name: 'Emma Davis', avatar: '/avatars/user.png' },
        { name: 'Frank Miller', avatar: '/avatars/user.png' },
        { name: 'Grace Lee', avatar: '/avatars/user.png' },
      ],
      dueDate: '2024-01-31',
      tasks: { total: 15, completed: 13 },
    },
  ];

  // Mock boards
  const boards = [
    {
      id: 1,
      name: 'Development Board',
      description: 'Software development tasks',
      lists: [
        { name: 'To Do', count: 8, color: 'bg-gray-200' },
        { name: 'In Progress', count: 5, color: 'bg-blue-200' },
        { name: 'Review', count: 3, color: 'bg-yellow-200' },
        { name: 'Done', count: 12, color: 'bg-green-200' },
      ],
    },
    {
      id: 2,
      name: 'Design Board',
      description: 'UI/UX design tasks',
      lists: [
        { name: 'Backlog', count: 6, color: 'bg-gray-200' },
        { name: 'Designing', count: 4, color: 'bg-purple-200' },
        { name: 'Review', count: 2, color: 'bg-yellow-200' },
        { name: 'Approved', count: 8, color: 'bg-green-200' },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading Oxlas Projects...</p>
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
                <h1 className="text-3xl font-bold">Projects</h1>
                <p className="text-muted-foreground mt-1">Manage your projects and tasks with Oxlas Projects</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Projects</p>
                      <p className="text-2xl font-bold">{projects.length}</p>
                    </div>
                    <Kanban className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Tasks</p>
                      <p className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.tasks.total, 0)}</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="text-2xl font-bold">{projects.reduce((acc, p) => acc + p.tasks.completed, 0)}</p>
                    </div>
                    <Star className="h-8 w-8 text-yellow-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Team Members</p>
                      <p className="text-2xl font-bold">12</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <Tabs value={activeView} onValueChange={setActiveView} className="space-y-4">
              <TabsList>
                <TabsTrigger value="boards">Boards</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="boards" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {boards.map((board) => (
                    <Card key={board.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          {board.name}
                          <Settings className="h-4 w-4 text-muted-foreground" />
                        </CardTitle>
                        <CardDescription>{board.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          {board.lists.map((list, index) => (
                            <div key={index} className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${list.color}`}></div>
                                <span className="text-sm">{list.name}</span>
                              </div>
                              <Badge variant="secondary">{list.count}</Badge>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 pt-4 border-t">
                          <Button variant="outline" className="w-full" size="sm">
                            Open Board
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                  <Card className="border-dashed hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="flex flex-col items-center justify-center h-64">
                      <Plus className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">Create New Board</h3>
                      <p className="text-muted-foreground text-center mb-4">
                        Start a new project board
                      </p>
                      <Button>Create Board</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="projects" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map((project) => (
                    <Card key={project.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>{project.name}</CardTitle>
                          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                            {project.status}
                          </Badge>
                        </div>
                        <CardDescription>{project.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {/* Progress */}
                          <div>
                            <div className="flex justify-between text-sm mb-2">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          {/* Tasks */}
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              {project.tasks.completed} of {project.tasks.total} tasks
                            </span>
                            <span>Due: {project.dueDate}</span>
                          </div>

                          {/* Team */}
                          <div className="flex items-center justify-between">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member, index) => (
                                <Avatar key={index} className="w-8 h-8 border-2 border-background">
                                  <AvatarImage src={member.avatar} alt={member.name} />
                                  <AvatarFallback className="text-xs">
                                    {member.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                              ))}
                              {project.team.length > 3 && (
                                <div className="w-8 h-8 rounded-full bg-muted border-2 border-background flex items-center justify-center">
                                  <span className="text-xs font-medium">+{project.team.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <Button variant="outline" size="sm">
                              View Project
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="timeline" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Project Timeline</h3>
                    <p className="text-muted-foreground mb-4">
                      Visual timeline of all project milestones and deadlines
                    </p>
                    <Button>View Timeline</Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="team" className="space-y-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Team Management</h3>
                    <p className="text-muted-foreground mb-4">
                      Manage team members, roles, and permissions
                    </p>
                    <Button>Manage Team</Button>
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