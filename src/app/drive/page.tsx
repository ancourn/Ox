'use client';

import { useState } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  HardDrive,
  Search,
  Upload,
  Folder,
  File,
  Image,
  FileText,
  Video,
  Music,
  Archive,
  Star,
  Share,
  Download,
  MoreHorizontal,
  Grid,
  List,
  Filter,
  Plus,
  Trash2,
  Edit,
  Eye,
  Clock,
} from 'lucide-react';

const files = [
  {
    id: 1,
    name: 'Q4 Financial Report.xlsx',
    type: 'spreadsheet',
    size: '2.4 MB',
    modified: '2 hours ago',
    starred: true,
    shared: true,
    owner: 'John Doe',
    thumbnail: '/thumbnails/spreadsheet.png',
  },
  {
    id: 2,
    name: 'Project Presentation.pptx',
    type: 'presentation',
    size: '5.1 MB',
    modified: '1 day ago',
    starred: false,
    shared: true,
    owner: 'Jane Smith',
    thumbnail: '/thumbnails/presentation.png',
  },
  {
    id: 3,
    name: 'Team Photo.jpg',
    type: 'image',
    size: '3.2 MB',
    modified: '3 days ago',
    starred: true,
    shared: false,
    owner: 'John Doe',
    thumbnail: '/thumbnails/photo.jpg',
  },
  {
    id: 4,
    name: 'Meeting Recording.mp4',
    type: 'video',
    size: '125 MB',
    modified: '1 week ago',
    starred: false,
    shared: true,
    owner: 'Bob Johnson',
    thumbnail: '/thumbnails/video.png',
  },
  {
    id: 5,
    name: 'Documentation.pdf',
    type: 'document',
    size: '1.8 MB',
    modified: '2 weeks ago',
    starred: false,
    shared: false,
    owner: 'John Doe',
    thumbnail: '/thumbnails/document.png',
  },
  {
    id: 6,
    name: 'Backup Files.zip',
    type: 'archive',
    size: '45 MB',
    modified: '1 month ago',
    starred: false,
    shared: false,
    owner: 'John Doe',
    thumbnail: '/thumbnails/archive.png',
  },
];

const folders = [
  {
    id: 1,
    name: 'Projects',
    itemCount: 12,
    modified: '1 day ago',
    shared: true,
  },
  {
    id: 2,
    name: 'Documents',
    itemCount: 8,
    modified: '3 days ago',
    shared: false,
  },
  {
    id: 3,
    name: 'Images',
    itemCount: 24,
    modified: '1 week ago',
    shared: true,
  },
  {
    id: 4,
    name: 'Videos',
    itemCount: 6,
    modified: '2 weeks ago',
    shared: false,
  },
  {
    id: 5,
    name: 'Archive',
    itemCount: 3,
    modified: '1 month ago',
    shared: false,
  },
];

const getFileIcon = (type: string) => {
  switch (type) {
    case 'spreadsheet':
      return <FileText className="h-8 w-8 text-green-600" />;
    case 'presentation':
      return <FileText className="h-8 w-8 text-orange-600" />;
    case 'image':
      return <Image className="h-8 w-8 text-blue-600" />;
    case 'video':
      return <Video className="h-8 w-8 text-red-600" />;
    case 'document':
      return <FileText className="h-8 w-8 text-blue-600" />;
    case 'archive':
      return <Archive className="h-8 w-8 text-purple-600" />;
    default:
      return <File className="h-8 w-8 text-gray-600" />;
  }
};

const formatFileSize = (size: string) => {
  return size;
};

export default function Drive() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('my-drive');

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredFolders = folders.filter(folder =>
    folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Drive" />
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold">My Drive</h1>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search files and folders..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}>
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            </div>

            {/* Storage Info */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <HardDrive className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">7.2 GB of 15 GB used</p>
                      <p className="text-xs text-muted-foreground">Get 100 GB of storage with Oxlas Pro</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Upgrade Storage
                  </Button>
                </div>
                <div className="mt-3 w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="my-drive">My Drive</TabsTrigger>
                <TabsTrigger value="shared">Shared</TabsTrigger>
                <TabsTrigger value="starred">Starred</TabsTrigger>
                <TabsTrigger value="recent">Recent</TabsTrigger>
              </TabsList>

              <TabsContent value="my-drive" className="mt-4">
                {/* Folders Section */}
                {filteredFolders.length > 0 && (
                  <div className="mb-6">
                    <h2 className="text-lg font-semibold mb-4">Folders</h2>
                    {viewMode === 'grid' ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        {filteredFolders.map((folder) => (
                          <Card key={folder.id} className="cursor-pointer hover:shadow-md transition-shadow">
                            <CardContent className="p-4 text-center">
                              <Folder className="h-12 w-12 text-blue-600 mx-auto mb-2" />
                              <p className="text-sm font-medium truncate">{folder.name}</p>
                              <p className="text-xs text-muted-foreground">{folder.itemCount} items</p>
                              <p className="text-xs text-muted-foreground">{folder.modified}</p>
                              {folder.shared && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  Shared
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {filteredFolders.map((folder) => (
                          <Card key={folder.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                            <CardContent className="p-3">
                              <div className="flex items-center gap-3">
                                <Folder className="h-8 w-8 text-blue-600" />
                                <div className="flex-1">
                                  <p className="font-medium">{folder.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {folder.itemCount} items • Modified {folder.modified}
                                  </p>
                                </div>
                                {folder.shared && (
                                  <Badge variant="secondary">Shared</Badge>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Files Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-4">Files</h2>
                  {viewMode === 'grid' ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {filteredFiles.map((file) => (
                        <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                          <CardContent className="p-4 text-center">
                            <div className="mb-2">
                              {getFileIcon(file.type)}
                            </div>
                            <p className="text-sm font-medium truncate mb-1">{file.name}</p>
                            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            <div className="flex items-center justify-center gap-1 mt-2">
                              {file.starred && (
                                <Star className="h-3 w-3 text-yellow-500 fill-current" />
                              )}
                              {file.shared && (
                                <Share className="h-3 w-3 text-blue-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {filteredFiles.map((file) => (
                        <Card key={file.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardContent className="p-3">
                            <div className="flex items-center gap-3">
                              {getFileIcon(file.type)}
                              <div className="flex-1">
                                <p className="font-medium">{file.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  {formatFileSize(file.size)} • Modified {file.modified} • {file.owner}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {file.starred && (
                                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                                )}
                                {file.shared && (
                                  <Share className="h-4 w-4 text-blue-500" />
                                )}
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                      <Eye className="h-4 w-4 mr-2" />
                                      Open
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Download className="h-4 w-4 mr-2" />
                                      Download
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Share className="h-4 w-4 mr-2" />
                                      Share
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Star className="h-4 w-4 mr-2" />
                                      {file.starred ? 'Unstar' : 'Star'}
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                      <Edit className="h-4 w-4 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-red-600">
                                      <Trash2 className="h-4 w-4 mr-2" />
                                      Delete
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="shared" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Share className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Shared files and folders will appear here</p>
                </div>
              </TabsContent>

              <TabsContent value="starred" className="mt-4">
                <div className="mb-6">
                  <h2 className="text-lg font-semibold mb-4">Starred Items</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {filteredFiles.filter(f => f.starred).map((file) => (
                      <Card key={file.id} className="cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4 text-center">
                          <div className="mb-2">
                            {getFileIcon(file.type)}
                          </div>
                          <p className="text-sm font-medium truncate mb-1">{file.name}</p>
                          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                          <div className="flex items-center justify-center gap-1 mt-2">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            {file.shared && (
                              <Share className="h-3 w-3 text-blue-500" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recent" className="mt-4">
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Recently accessed files will appear here</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}