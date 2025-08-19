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
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  User,
  Mail,
  Phone,
  Building,
  Bell,
  Shield,
  Database,
  Palette,
  ExternalLink,
  Key,
  Download,
  Upload,
  Trash2,
  Save,
  Camera,
  Moon,
  Sun,
  Monitor,
} from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    desktop: false,
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');

  const user = {
    name: 'John Doe',
    email: 'john@oxlas.com',
    phone: '+1 (555) 123-4567',
    company: 'Oxlas Technologies Inc.',
    role: 'Administrator',
    joinDate: 'January 2024',
    storageUsed: '7.2 GB',
    storageTotal: '15 GB',
  };

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Settings" />
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <h1 className="text-2xl font-bold">Settings</h1>
              <Badge variant="outline">{user.role}</Badge>
            </div>

            <div className="grid gap-6 lg:grid-cols-4">
              {/* Settings Navigation */}
              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button
                      variant={activeTab === 'profile' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('profile')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Button>
                    <Button
                      variant={activeTab === 'account' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('account')}
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Account
                    </Button>
                    <Button
                      variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('notifications')}
                    >
                      <Bell className="h-4 w-4 mr-2" />
                      Notifications
                    </Button>
                    <Button
                      variant={activeTab === 'security' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('security')}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security
                    </Button>
                    <Button
                      variant={activeTab === 'appearance' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('appearance')}
                    >
                      <Palette className="h-4 w-4 mr-2" />
                      Appearance
                    </Button>
                    <Button
                      variant={activeTab === 'data' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('data')}
                    >
                      <Database className="h-4 w-4 mr-2" />
                      Data & Storage
                    </Button>
                    <Button
                      variant={activeTab === 'billing' ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setActiveTab('billing')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Billing
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Settings Content */}
              <div className="lg:col-span-3">
                {activeTab === 'profile' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Update your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarImage src="/avatars/user.png" />
                            <AvatarFallback className="text-2xl">
                              {user.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <Button size="icon" className="absolute -bottom-2 -right-2">
                            <Camera className="h-4 w-4" />
                          </Button>
                        </div>
                        <div>
                          <h3 className="text-lg font-medium">{user.name}</h3>
                          <p className="text-muted-foreground">{user.email}</p>
                          <p className="text-sm text-muted-foreground">Member since {user.joinDate}</p>
                        </div>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          <Input id="name" defaultValue={user.name} />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input id="email" defaultValue={user.email} />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" defaultValue={user.phone} />
                        </div>
                        <div>
                          <Label htmlFor="company">Company</Label>
                          <Input id="company" defaultValue={user.company} />
                        </div>
                      </div>

                      <div className="flex justify-end">
                        <Button>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'account' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Settings</CardTitle>
                      <CardDescription>Manage your account preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Email Addresses</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">{user.email}</p>
                              <p className="text-sm text-muted-foreground">Primary email</p>
                            </div>
                            <Badge variant="secondary">Primary</Badge>
                          </div>
                          <Button variant="outline" className="w-full">
                            <Mail className="h-4 w-4 mr-2" />
                            Add Email Address
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Connected Accounts</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">G</span>
                              </div>
                              <div>
                                <p className="font-medium">Google</p>
                                <p className="text-sm text-muted-foreground">Connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Disconnect</Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">M</span>
                              </div>
                              <div>
                                <p className="font-medium">Microsoft</p>
                                <p className="text-sm text-muted-foreground">Not connected</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Connect</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'notifications' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Preferences</CardTitle>
                      <CardDescription>Choose how you want to be notified</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                          </div>
                          <Switch
                            id="email-notifications"
                            checked={notifications.email}
                            onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                            <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
                          </div>
                          <Switch
                            id="push-notifications"
                            checked={notifications.push}
                            onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                            <p className="text-sm text-muted-foreground">Show notifications on your desktop</p>
                          </div>
                          <Switch
                            id="desktop-notifications"
                            checked={notifications.desktop}
                            onCheckedChange={(checked) => handleNotificationChange('desktop', checked)}
                          />
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Notification Types</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">New emails and replies</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Calendar Reminders</p>
                              <p className="text-sm text-muted-foreground">Event notifications and reminders</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">File Sharing</p>
                              <p className="text-sm text-muted-foreground">When files are shared with you</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">Meeting Invitations</p>
                              <p className="text-sm text-muted-foreground">New meeting invitations</p>
                            </div>
                            <Switch defaultChecked />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'security' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Security Settings</CardTitle>
                      <CardDescription>Manage your account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Password</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Password</p>
                              <p className="text-sm text-muted-foreground">Last changed 3 months ago</p>
                            </div>
                            <Button variant="outline" size="sm">
                              <Key className="h-4 w-4 mr-2" />
                              Change Password
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Authenticator App</p>
                              <p className="text-sm text-muted-foreground">Not enabled</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">SMS Authentication</p>
                              <p className="text-sm text-muted-foreground">Not enabled</p>
                            </div>
                            <Button variant="outline" size="sm">Enable</Button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Active Sessions</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Chrome on Windows</p>
                              <p className="text-sm text-muted-foreground">New York, USA • Current session</p>
                            </div>
                            <Badge variant="secondary">Current</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Safari on iPhone</p>
                              <p className="text-sm text-muted-foreground">New York, USA • 2 hours ago</p>
                            </div>
                            <Button variant="outline" size="sm">Revoke</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'appearance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance Settings</CardTitle>
                      <CardDescription>Customize how Oxlas looks</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Theme</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <Button
                            variant={theme === 'light' ? 'default' : 'outline'}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => setTheme('light')}
                          >
                            <Sun className="h-6 w-6" />
                            <span>Light</span>
                          </Button>
                          <Button
                            variant={theme === 'dark' ? 'default' : 'outline'}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => setTheme('dark')}
                          >
                            <Moon className="h-6 w-6" />
                            <span>Dark</span>
                          </Button>
                          <Button
                            variant={theme === 'system' ? 'default' : 'outline'}
                            className="h-auto p-4 flex flex-col items-center gap-2"
                            onClick={() => setTheme('system')}
                          >
                            <Monitor className="h-6 w-6" />
                            <span>System</span>
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Language</h3>
                        <div className="grid gap-2">
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="w-full p-2 border rounded-md"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                            <option value="it">Italian</option>
                            <option value="pt">Portuguese</option>
                            <option value="ru">Russian</option>
                            <option value="ja">Japanese</option>
                            <option value="ko">Korean</option>
                            <option value="zh">Chinese</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Density</h3>
                        <div className="grid gap-4 md:grid-cols-3">
                          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                            <div className="flex flex-col gap-1">
                              <div className="w-16 h-2 bg-muted rounded"></div>
                              <div className="w-16 h-2 bg-muted rounded"></div>
                            </div>
                            <span>Comfortable</span>
                          </Button>
                          <Button variant="default" className="h-auto p-4 flex flex-col items-center gap-2">
                            <div className="flex flex-col gap-0.5">
                              <div className="w-16 h-2 bg-muted rounded"></div>
                              <div className="w-16 h-2 bg-muted rounded"></div>
                            </div>
                            <span>Default</span>
                          </Button>
                          <Button variant="outline" className="h-auto p-4 flex flex-col items-center gap-2">
                            <div className="flex flex-col gap-0">
                              <div className="w-16 h-2 bg-muted rounded"></div>
                              <div className="w-16 h-2 bg-muted rounded"></div>
                            </div>
                            <span>Compact</span>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'data' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Data & Storage</CardTitle>
                      <CardDescription>Manage your data and storage settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Storage Usage</h3>
                        <div className="space-y-4">
                          <div className="p-4 border rounded-lg">
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium">Total Storage</span>
                              <span className="text-sm text-muted-foreground">{user.storageUsed} / {user.storageTotal}</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2 rounded-full" style={{ width: '48%' }}></div>
                            </div>
                          </div>
                          <div className="grid gap-4 md:grid-cols-3">
                            <div className="p-3 border rounded-lg">
                              <p className="text-sm text-muted-foreground">Emails</p>
                              <p className="font-medium">2.1 GB</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <p className="text-sm text-muted-foreground">Files</p>
                              <p className="font-medium">3.8 GB</p>
                            </div>
                            <div className="p-3 border rounded-lg">
                              <p className="text-sm text-muted-foreground">Media</p>
                              <p className="font-medium">1.3 GB</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Data Management</h3>
                        <div className="space-y-3">
                          <Button variant="outline" className="w-full justify-start">
                            <Download className="h-4 w-4 mr-2" />
                            Export Data
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Upload className="h-4 w-4 mr-2" />
                            Import Data
                          </Button>
                          <Button variant="outline" className="w-full justify-start">
                            <Database className="h-4 w-4 mr-2" />
                            Backup Settings
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                        <div className="space-y-3">
                          <div className="p-4 border border-red-200 rounded-lg">
                            <h4 className="font-medium text-red-600 mb-2">Delete Account</h4>
                            <p className="text-sm text-muted-foreground mb-3">
                              Permanently delete your account and all associated data. This action cannot be undone.
                            </p>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Account
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeTab === 'billing' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing & Plans</CardTitle>
                      <CardDescription>Manage your subscription and billing</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Current Plan</h3>
                        <div className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="font-medium">Free Plan</h4>
                              <p className="text-sm text-muted-foreground">15 GB storage • Basic features</p>
                            </div>
                            <Badge variant="secondary">Current</Badge>
                          </div>
                          <Button className="w-full">Upgrade to Pro</Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">VISA</span>
                              </div>
                              <div>
                                <p className="font-medium">•••• •••• •••• 4242</p>
                                <p className="text-sm text-muted-foreground">Expires 12/25</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm">Edit</Button>
                          </div>
                          <Button variant="outline" className="w-full">
                            Add Payment Method
                          </Button>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-4">Billing History</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Pro Plan - Monthly</p>
                              <p className="text-sm text-muted-foreground">Jan 15, 2024</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">$9.99</p>
                              <p className="text-sm text-muted-foreground">Paid</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Pro Plan - Monthly</p>
                              <p className="text-sm text-muted-foreground">Dec 15, 2023</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">$9.99</p>
                              <p className="text-sm text-muted-foreground">Paid</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}