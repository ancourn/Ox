'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Monitor,
  MonitorOff,
  Users,
  MessageSquare,
  Hand,
  MoreHorizontal,
  Settings,
  Circle,
  ScreenShare,
  LogOut,
  Plus,
  Clock,
  Calendar,
  Copy,
  ExternalLink,
  Play,
  Download,
  Share,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const meetings = [
  {
    id: 1,
    title: 'Team Standup',
    time: '09:00 AM - 09:30 AM',
    date: 'Today',
    participants: 8,
    isActive: true,
    isRecording: false,
    joinUrl: 'https://meet.oxlas.com/team-standup',
  },
  {
    id: 2,
    title: 'Client Presentation',
    time: '02:00 PM - 03:30 PM',
    date: 'Today',
    participants: 12,
    isActive: false,
    isRecording: false,
    joinUrl: 'https://meet.oxlas.com/client-presentation',
  },
  {
    id: 3,
    title: 'Project Review',
    time: '10:00 AM - 11:00 AM',
    date: 'Tomorrow',
    participants: 6,
    isActive: false,
    isRecording: false,
    joinUrl: 'https://meet.oxlas.com/project-review',
  },
  {
    id: 4,
    title: 'Training Session',
    time: '02:00 PM - 04:00 PM',
    date: 'Jan 18',
    participants: 15,
    isActive: false,
    isRecording: false,
    joinUrl: 'https://meet.oxlas.com/training-session',
  },
];

const participants = [
  { id: 1, name: 'John Doe', isSpeaking: false, isMuted: false, isVideoOn: true, role: 'host' },
  { id: 2, name: 'Jane Smith', isSpeaking: true, isMuted: false, isVideoOn: true, role: 'participant' },
  { id: 3, name: 'Bob Johnson', isSpeaking: false, isMuted: true, isVideoOn: false, role: 'participant' },
  { id: 4, name: 'Alice Brown', isSpeaking: false, isMuted: false, isVideoOn: true, role: 'participant' },
  { id: 5, name: 'Charlie Wilson', isSpeaking: false, isMuted: false, isVideoOn: false, role: 'participant' },
  { id: 6, name: 'Diana Davis', isSpeaking: false, isMuted: true, isVideoOn: true, role: 'participant' },
];

const recentRecordings = [
  {
    id: 1,
    title: 'Team Standup - Jan 15',
    duration: '28:45',
    date: '2 hours ago',
    size: '125 MB',
    thumbnail: '/thumbnails/recording1.jpg',
  },
  {
    id: 2,
    title: 'Client Presentation - Jan 14',
    duration: '1:32:18',
    date: '1 day ago',
    size: '523 MB',
    thumbnail: '/thumbnails/recording2.jpg',
  },
  {
    id: 3,
    title: 'Project Review - Jan 12',
    duration: '58:32',
    date: '3 days ago',
    size: '267 MB',
    thumbnail: '/thumbnails/recording3.jpg',
  },
];

export default function Meet() {
  const [isInMeeting, setIsInMeeting] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [currentMeeting, setCurrentMeeting] = useState(meetings[0]);

  const startMeeting = () => {
    setIsInMeeting(true);
  };

  const endMeeting = () => {
    setIsInMeeting(false);
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const joinMeeting = (meeting: typeof meetings[0]) => {
    setCurrentMeeting(meeting);
    setIsInMeeting(true);
  };

  const copyMeetingLink = (url: string) => {
    navigator.clipboard.writeText(url);
  };

  if (isInMeeting) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title="Oxlas Meet" />
          
          <div className="flex-1 flex flex-col">
            {/* Meeting Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold">{currentMeeting.title}</h2>
                <Badge variant="outline">
                  <Users className="h-3 w-3 mr-1" />
                  {participants.length} participants
                </Badge>
                {currentMeeting.isRecording && (
                  <Badge variant="destructive">
                    <Circle className="h-3 w-3 mr-1" />
                    Recording
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
                <Button variant="outline" size="sm" onClick={() => copyMeetingLink(currentMeeting.joinUrl)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>
                <Button variant="destructive" size="sm" onClick={endMeeting}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Leave
                </Button>
              </div>
            </div>

            {/* Main Meeting Area */}
            <div className="flex-1 flex">
              {/* Video Grid */}
              <div className="flex-1 p-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 h-full">
                  {participants.map((participant) => (
                    <Card key={participant.id} className="relative overflow-hidden">
                      <CardContent className="p-0 h-full">
                        {participant.isVideoOn ? (
                          <div className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 flex items-center justify-center">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="text-lg">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        ) : (
                          <div className="w-full h-full bg-muted flex items-center justify-center">
                            <Avatar className="h-16 w-16">
                              <AvatarFallback className="text-lg">
                                {participant.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                          </div>
                        )}
                        
                        {/* Participant Info */}
                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white bg-black/50 px-2 py-1 rounded">
                              {participant.name}
                            </span>
                            {participant.role === 'host' && (
                              <Badge variant="secondary" className="text-xs">Host</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            {participant.isSpeaking && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                            {participant.isMuted && (
                              <MicOff className="h-3 w-3 text-white" />
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Sidebar */}
              <div className="w-80 border-l flex flex-col">
                {/* Participants */}
                <div className="flex-1 p-4">
                  <h3 className="font-semibold mb-4">Participants ({participants.length})</h3>
                  <div className="space-y-2">
                    {participants.map((participant) => (
                      <div key={participant.id} className="flex items-center gap-3 p-2 rounded hover:bg-muted/50">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-sm">
                            {participant.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{participant.name}</p>
                          <div className="flex items-center gap-2">
                            {participant.role === 'host' && (
                              <Badge variant="secondary" className="text-xs">Host</Badge>
                            )}
                            {participant.isMuted && (
                              <MicOff className="h-3 w-3 text-muted-foreground" />
                            )}
                            {participant.isSpeaking && (
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat */}
                <div className="border-t p-4">
                  <h3 className="font-semibold mb-4">Chat</h3>
                  <div className="space-y-2 mb-4">
                    <div className="text-sm">
                      <span className="font-medium">Jane Smith:</span>
                      <span className="text-muted-foreground"> Can everyone see my screen?</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">John Doe:</span>
                      <span className="text-muted-foreground"> Yes, looks good!</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Input placeholder="Type a message..." className="flex-1" />
                    <Button size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Meeting Controls */}
            <div className="p-4 border-t bg-background/95 backdrop-blur">
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant={isMicOn ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleMic}
                >
                  {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isVideoOn ? "default" : "destructive"}
                  size="lg"
                  onClick={toggleVideo}
                >
                  {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                <Button
                  variant={isScreenSharing ? "default" : "outline"}
                  size="lg"
                  onClick={toggleScreenShare}
                >
                  {isScreenSharing ? <Monitor className="h-5 w-5" /> : <MonitorOff className="h-5 w-5" />}
                </Button>
                <Button variant="outline" size="lg">
                  <Hand className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <Circle className="h-5 w-5" />
                </Button>
                <Button variant="outline" size="lg">
                  <MoreHorizontal className="h-5 w-5" />
                </Button>
                <Button variant="destructive" size="lg" onClick={endMeeting}>
                  <PhoneOff className="h-5 w-5 mr-2" />
                  End Meeting
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Meet" />
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Oxlas Meet</h1>
                <p className="text-muted-foreground">Video conferencing for teams</p>
              </div>
              <Button onClick={startMeeting} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="recordings">Recordings</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {meetings.map((meeting) => (
                    <Card key={meeting.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{meeting.title}</CardTitle>
                          {meeting.isActive && (
                            <Badge variant="destructive">Live</Badge>
                          )}
                        </div>
                        <CardDescription>
                          <div className="flex items-center gap-4 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{meeting.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{meeting.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{meeting.participants} participants</span>
                            </div>
                          </div>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2">
                          <Button 
                            onClick={() => joinMeeting(meeting)}
                            className="flex-1"
                          >
                            <Video className="h-4 w-4 mr-2" />
                            {meeting.isActive ? 'Join Meeting' : 'Start Meeting'}
                          </Button>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => copyMeetingLink(meeting.joinUrl)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="icon">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="recordings" className="mt-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recentRecordings.map((recording) => (
                    <Card key={recording.id}>
                      <CardContent className="p-0">
                        <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-700 rounded-t-lg flex items-center justify-center">
                          <Play className="h-12 w-12 text-white/50" />
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium mb-2">{recording.title}</h3>
                          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
                            <span>{recording.duration}</span>
                            <span>{recording.size}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Video className="h-4 w-4 mr-2" />
                              Play
                            </Button>
                            <Button variant="outline" size="sm">
                              <Download className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Share className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-4">
                <div className="grid gap-6 md:grid-cols-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Meeting Settings</CardTitle>
                      <CardDescription>Configure your meeting preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Enable HD Video</p>
                          <p className="text-sm text-muted-foreground">Higher quality video calls</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Noise Cancellation</p>
                          <p className="text-sm text-muted-foreground">Reduce background noise</p>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Auto-record Meetings</p>
                          <p className="text-sm text-muted-foreground">Record all meetings automatically</p>
                        </div>
                        <Button variant="outline" size="sm">Disable</Button>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Audio & Video</CardTitle>
                      <CardDescription>Test your devices</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Microphone</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>Default Microphone</option>
                          <option>Headset Microphone</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Camera</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>Default Camera</option>
                          <option>HD Webcam</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Speakers</label>
                        <select className="w-full mt-1 p-2 border rounded-md">
                          <option>Default Speakers</option>
                          <option>Headphones</option>
                        </select>
                      </div>
                      <Button className="w-full">Test Devices</Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}