'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Mail,
  Search,
  Star,
  Archive,
  Trash2,
  Reply,
  ReplyAll,
  Forward,
  MoreHorizontal,
  Paperclip,
  Clock,
  User,
  Building2,
  FileText,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useEmailWebSocket } from '@/hooks/use-websocket';

interface Email {
  id: string;
  uid: number;
  messageId: string;
  subject: string;
  from: { name: string; address: string };
  to: Array<{ name: string; address: string }>;
  date: Date;
  body: string;
  html?: string;
  attachments: Array<{
    filename: string;
    contentType: string;
    size: number;
    contentId?: string;
  }>;
  flags: string[];
  labels: string[];
  folder: string;
  size: number;
  read: boolean;
  starred: boolean;
}

const folders = [
  { name: 'Inbox', count: 12, icon: Mail },
  { name: 'Starred', count: 3, icon: Star },
  { name: 'Sent', count: 45, icon: Archive },
  { name: 'Drafts', count: 2, icon: Archive },
  { name: 'Spam', count: 0, icon: Archive },
  { name: 'Trash', count: 8, icon: Trash2 },
];

export default function Inbox() {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [activeFolder, setActiveFolder] = useState('INBOX');

  const { isConnected, onNewEmail, onEmailRead, onEmailStarUpdate, markEmailRead, starEmail } = useEmailWebSocket();

  useEffect(() => {
    loadEmails();
  }, [activeFolder]);

  useEffect(() => {
    // Set up real-time event listeners
    const unsubscribeNewEmail = onNewEmail((emailData) => {
      console.log('New email received:', emailData);
      loadEmails(); // Refresh email list
    });

    const unsubscribeEmailRead = onEmailRead((data) => {
      console.log('Email read status updated:', data);
      // Update the specific email's read status
      setEmails(prev => prev.map(email => 
        email.id === data.emailId ? { ...email, read: true } : email
      ));
    });

    const unsubscribeStarUpdate = onEmailStarUpdate((data) => {
      console.log('Email star status updated:', data);
      // Update the specific email's star status
      setEmails(prev => prev.map(email => 
        email.id === data.emailId ? { ...email, starred: data.starred } : email
      ));
    });

    return () => {
      unsubscribeNewEmail();
      unsubscribeEmailRead();
      unsubscribeStarUpdate();
    };
  }, [onNewEmail, onEmailRead, onEmailStarUpdate]);

  const loadEmails = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/email/folder/${activeFolder}`);
      const data = await response.json();
      if (data.success) {
        setEmails(data.emails);
      }
    } catch (error) {
      console.error('Failed to load emails:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailSelect = async (email: Email) => {
    setSelectedEmail(email);
    
    // Mark as read if unread
    if (!email.read) {
      try {
        await fetch(`/api/email/${email.id}/read`, { method: 'PUT' });
        // Update local state
        setEmails(prev => prev.map(e => 
          e.id === email.id ? { ...e, read: true } : e
        ));
        // Emit real-time update
        markEmailRead(email.id);
      } catch (error) {
        console.error('Failed to mark email as read:', error);
      }
    }
  };

  const handleStarToggle = async (email: Email) => {
    try {
      await fetch(`/api/email/${email.id}/star`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ star: !email.starred }),
      });
      
      // Update local state
      setEmails(prev => prev.map(e => 
        e.id === email.id ? { ...e, starred: !e.starred } : e
      ));
      
      // Update selected email if it's the one being starred
      if (selectedEmail?.id === email.id) {
        setSelectedEmail(prev => prev ? { ...prev, starred: !prev.starred } : null);
      }
      
      // Emit real-time update
      starEmail(email.id, !email.starred);
    } catch (error) {
      console.error('Failed to toggle star:', error);
    }
  };

  const filteredEmails = emails.filter(email =>
    email.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.from.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    email.body.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatEmailId = (email: Email) => {
    return `${email.folder}:${email.uid}`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Inbox" />
        
        <div className="flex-1 flex overflow-hidden">
          {/* Email List */}
          <div className="w-96 border-r flex flex-col">
            {/* Connection Status */}
            <div className="p-2 border-b bg-muted/50">
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="text-xs">
                  {isConnected ? 'Real-time sync active' : 'Disconnected'}
                </span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search emails..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Folders */}
            <div className="p-4 border-b">
              <Tabs defaultValue="inbox" className="w-full">
                <TabsList className="grid w-full grid-cols-6">
                  {folders.slice(0, 6).map((folder) => (
                    <TabsTrigger 
                      key={folder.name} 
                      value={folder.name.toLowerCase()}
                      onClick={() => setActiveFolder(folder.name.toUpperCase())}
                      className="text-xs"
                    >
                      <folder.icon className="h-3 w-3 mr-1" />
                      {folder.count}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                    <p className="text-sm text-muted-foreground">Loading emails...</p>
                  </div>
                </div>
              ) : filteredEmails.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-medium mb-2">No emails found</p>
                    <p className="text-sm text-muted-foreground">
                      {searchTerm ? 'Try a different search term' : 'Your inbox is empty'}
                    </p>
                  </div>
                </div>
              ) : (
                filteredEmails.map((email) => (
                  <div
                    key={formatEmailId(email)}
                    className={`p-4 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                      selectedEmail?.id === email.id ? 'bg-muted/50' : ''
                    } ${!email.read ? 'bg-blue-50/30' : ''}`}
                    onClick={() => handleEmailSelect(email)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={`/avatars/${email.from.address.split('@')[0]}.png`} />
                        <AvatarFallback>
                          {email.from.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className={`text-sm font-medium truncate ${!email.read ? 'font-semibold' : ''}`}>
                            {email.from.name}
                          </h3>
                          <div className="flex items-center gap-1">
                            <span className="text-xs text-muted-foreground">
                              {new Date(email.date).toLocaleDateString()}
                            </span>
                            {email.starred && (
                              <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            )}
                          </div>
                        </div>
                        <p className={`text-sm truncate mb-1 ${!email.read ? 'font-medium' : ''}`}>
                          {email.subject}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {email.body.substring(0, 100)}...
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          {email.labels.map((label) => (
                            <Badge key={label} variant="secondary" className="text-xs">
                              {label}
                            </Badge>
                          ))}
                          {email.attachments.length > 0 && (
                            <Paperclip className="h-3 w-3 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Email Content */}
          <div className="flex-1 flex flex-col">
            {selectedEmail ? (
              <>
                {/* Email Header */}
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleStarToggle(selectedEmail)}
                      >
                        <Star className={`h-5 w-5 ${selectedEmail.starred ? 'fill-current text-yellow-500' : ''}`} />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Archive className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-5 w-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                          <DropdownMenuItem>Add to tasks</DropdownMenuItem>
                          <DropdownMenuItem>Move to folder</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Print</DropdownMenuItem>
                          <DropdownMenuItem>View source</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={`/avatars/${selectedEmail.from.address.split('@')[0]}.png`} />
                      <AvatarFallback>
                        {selectedEmail.from.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{selectedEmail.from.name}</h3>
                        <span className="text-sm text-muted-foreground">&lt;{selectedEmail.from.address}&gt;</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        to {selectedEmail.to.map(t => t.address).join(', ')} • {new Date(selectedEmail.date).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedEmail.labels.map((label) => (
                      <Badge key={label} variant="outline">
                        {label}
                      </Badge>
                    ))}
                    {selectedEmail.attachments.length > 0 && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                        <span>{selectedEmail.attachments.length} attachment{selectedEmail.attachments.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Email Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="prose prose-sm max-w-none">
                    {selectedEmail.html ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedEmail.html }} />
                    ) : (
                      selectedEmail.body.split('\n').map((line, index) => (
                        <p key={index} className="mb-4">
                          {line}
                        </p>
                      ))
                    )}
                  </div>

                  {selectedEmail.attachments.length > 0 && (
                    <div className="mt-6 p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Attachments</h4>
                      <div className="space-y-3">
                        {selectedEmail.attachments.map((attachment, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                            <div className="p-2 bg-white rounded border">
                              <FileText className="h-6 w-6 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-medium">{attachment.filename}</p>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(attachment.size / 1024)} KB • {attachment.contentType}
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Email Actions */}
                <div className="p-4 border-t">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button variant="outline" size="sm">
                      <ReplyAll className="h-4 w-4 mr-2" />
                      Reply All
                    </Button>
                    <Button variant="outline" size="sm">
                      <Forward className="h-4 w-4 mr-2" />
                      Forward
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Select an email to read</p>
                  <p className="text-sm text-muted-foreground">
                    Choose an email from your inbox to view its contents
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}