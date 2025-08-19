'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/oxlas/Header';
import Sidebar from '@/components/oxlas/Sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ExternalLink,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  MoreHorizontal,
  Copy,
  RefreshCw,
  Key,
  Download,
  Trash2,
  Star,
  Mail,
  Users,
  Database,
  AlertTriangle,
  Check,
  X,
} from 'lucide-react';

interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verified' | 'failed';
  isPrimary: boolean;
  verifiedAt: string | null;
  createdAt: string;
  lastChecked: string;
  verification: {
    records: {
      mx: Array<{ type: string; name: string; value: string; priority?: number }>;
      txt: Array<{ type: string; name: string; value: string }>;
      a: Array<{ type: string; name: string; value: string }>;
      aaaa: Array<{ type: string; name: string; value: string }>;
    };
    required: {
      mx: boolean;
      spf: boolean;
      dkim: boolean;
      dmarc: boolean;
    };
    errors: string[];
    recommendations: string[];
  };
}

interface DNSConfig {
  records: Array<{
    type: string;
    name: string;
    value: string;
    priority?: number;
  }>;
  instructions: string[];
}

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [dnsConfig, setDnsConfig] = useState<DNSConfig | null>(null);
  const [dkimKeys, setDkimKeys] = useState<{ privateKey: string; publicKey: string; record: string } | null>(null);
  const [propagationStatus, setPropagationStatus] = useState<{ propagated: boolean; progress: number } | null>(null);

  useEffect(() => {
    loadDomains();
  }, []);

  const loadDomains = async () => {
    try {
      const response = await fetch('/api/domains');
      const data = await response.json();
      if (data.success) {
        setDomains(data.domains);
      }
    } catch (error) {
      console.error('Failed to load domains:', error);
    }
  };

  const verifyDomain = async () => {
    if (!newDomain) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: newDomain }),
      });

      const data = await response.json();
      if (data.success) {
        setDomains([...domains, data.domain]);
        setNewDomain('');
        setIsDialogOpen(false);
      } else {
        console.error('Domain verification failed:', data.error);
      }
    } catch (error) {
      console.error('Failed to verify domain:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const reverifyDomain = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/${domainId}/reverify`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setDomains(domains.map(d => d.id === domainId ? data.domain : d));
      }
    } catch (error) {
      console.error('Failed to reverify domain:', error);
    }
  };

  const getDNSConfig = async (domain: Domain) => {
    try {
      const response = await fetch(`/api/domains/${domain.id}/dns-config`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setDnsConfig(data.config);
        setSelectedDomain(domain);
      }
    } catch (error) {
      console.error('Failed to get DNS config:', error);
    }
  };

  const generateDKIMKeys = async (domain: Domain) => {
    try {
      const response = await fetch(`/api/domains/${domain.id}/dkim`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setDkimKeys(data.dkim);
        setSelectedDomain(domain);
      }
    } catch (error) {
      console.error('Failed to generate DKIM keys:', error);
    }
  };

  const checkPropagation = async (domain: Domain) => {
    try {
      const response = await fetch(`/api/domains/${domain.id}/propagation`);
      const data = await response.json();
      if (data.success) {
        setPropagationStatus(data.propagation);
        setSelectedDomain(domain);
      }
    } catch (error) {
      console.error('Failed to check propagation:', error);
    }
  };

  const setPrimaryDomain = async (domainId: string) => {
    try {
      const response = await fetch(`/api/domains/${domainId}/primary`, {
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        setDomains(domains.map(d => ({ ...d, isPrimary: d.id === domainId })));
      }
    } catch (error) {
      console.error('Failed to set primary domain:', error);
    }
  };

  const deleteDomain = async (domainId: string) => {
    if (!confirm('Are you sure you want to delete this domain? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/domains/${domainId}`, {
        method: 'DELETE',
      });

      const data = await response.json();
      if (data.success) {
        setDomains(domains.filter(d => d.id !== domainId));
      }
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title="Domains" />
        
        <div className="flex-1 overflow-hidden">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold">Domain Management</h1>
                <p className="text-muted-foreground">Manage your custom domains and email hosting</p>
              </div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Domain
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Domain</DialogTitle>
                    <DialogDescription>
                      Enter your domain name to verify and configure email hosting
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="domain" className="text-sm font-medium">
                        Domain Name
                      </label>
                      <Input
                        id="domain"
                        placeholder="example.com"
                        value={newDomain}
                        onChange={(e) => setNewDomain(e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={verifyDomain} disabled={isLoading || !newDomain}>
                      {isLoading ? 'Verifying...' : 'Verify Domain'}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {domains.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <ExternalLink className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">No domains configured</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Add your first domain to start using custom email addresses with Oxlas
                  </p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Domain
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {domains.map((domain) => (
                  <Card key={domain.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(domain.status)}
                          <div>
                            <CardTitle className="flex items-center gap-2">
                              {domain.domain}
                              {domain.isPrimary && <Badge variant="secondary">Primary</Badge>}
                              {getStatusBadge(domain.status)}
                            </CardTitle>
                            <CardDescription>
                              Added {new Date(domain.createdAt).toLocaleDateString()}
                              {domain.verifiedAt && (
                                <span className="ml-2">
                                  • Verified {new Date(domain.verifiedAt).toLocaleDateString()}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => reverifyDomain(domain.id)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Re-verify
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => getDNSConfig(domain)}>
                              <Settings className="h-4 w-4 mr-2" />
                              DNS Configuration
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => generateDKIMKeys(domain)}>
                              <Key className="h-4 w-4 mr-2" />
                              Generate DKIM Keys
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => checkPropagation(domain)}>
                              <ExternalLink className="h-4 w-4 mr-2" />
                              Check Propagation
                            </DropdownMenuItem>
                            {!domain.isPrimary && (
                              <>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setPrimaryDomain(domain.id)}>
                                  <Star className="h-4 w-4 mr-2" />
                                  Set as Primary
                                </DropdownMenuItem>
                              </>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => deleteDomain(domain.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete Domain
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList>
                          <TabsTrigger value="overview">Overview</TabsTrigger>
                          <TabsTrigger value="records">DNS Records</TabsTrigger>
                          <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-4">
                          <div className="grid gap-4 md:grid-cols-4">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-blue-600" />
                              <span className="text-sm">Email Accounts</span>
                              <Badge variant="secondary">5</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Mailboxes</span>
                              <Badge variant="secondary">12</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Database className="h-4 w-4 text-purple-600" />
                              <span className="text-sm">Storage Used</span>
                              <Badge variant="secondary">2.3 GB</Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                              <span className="text-sm">Health</span>
                              <Badge variant="secondary">Healthy</Badge>
                            </div>
                          </div>

                          <div className="grid gap-4 md:grid-cols-2">
                            <div>
                              <h4 className="font-medium mb-2">Required Records</h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">MX Records</span>
                                  {domain.verification.required.mx ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">SPF Record</span>
                                  {domain.verification.required.spf ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">DKIM Record</span>
                                  {domain.verification.required.dkim ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm">DMARC Record</span>
                                  {domain.verification.required.dmarc ? (
                                    <Check className="h-4 w-4 text-green-600" />
                                  ) : (
                                    <X className="h-4 w-4 text-red-600" />
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Quick Actions</h4>
                              <div className="space-y-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full justify-start"
                                  onClick={() => getDNSConfig(domain)}
                                >
                                  <Settings className="h-4 w-4 mr-2" />
                                  View DNS Config
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full justify-start"
                                  onClick={() => generateDKIMKeys(domain)}
                                >
                                  <Key className="h-4 w-4 mr-2" />
                                  Generate DKIM Keys
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="w-full justify-start"
                                  onClick={() => checkPropagation(domain)}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Check Propagation
                                </Button>
                              </div>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="records" className="space-y-4">
                          <div className="grid gap-4">
                            <div>
                              <h4 className="font-medium mb-2">MX Records</h4>
                              {domain.verification.records.mx.length > 0 ? (
                                <div className="space-y-2">
                                  {domain.verification.records.mx.map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                      <div>
                                        <span className="font-medium">{record.type}</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {record.name}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm">{record.value}</span>
                                        <div className="text-xs text-muted-foreground">
                                          Priority: {record.priority}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No MX records found</p>
                              )}
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">TXT Records</h4>
                              {domain.verification.records.txt.length > 0 ? (
                                <div className="space-y-2">
                                  {domain.verification.records.txt.map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                      <div>
                                        <span className="font-medium">{record.type}</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {record.name}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <span className="text-sm font-mono max-w-xs truncate">
                                          {record.value}
                                        </span>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => copyToClipboard(record.value)}
                                        >
                                          <Copy className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No TXT records found</p>
                              )}
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">A Records</h4>
                              {domain.verification.records.a.length > 0 ? (
                                <div className="space-y-2">
                                  {domain.verification.records.a.map((record, index) => (
                                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                                      <div>
                                        <span className="font-medium">{record.type}</span>
                                        <span className="text-sm text-muted-foreground ml-2">
                                          {record.name}
                                        </span>
                                      </div>
                                      <span className="text-sm font-mono">{record.value}</span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">No A records found</p>
                              )}
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="recommendations" className="space-y-4">
                          {domain.verification.errors.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                Issues Found
                              </h4>
                              <div className="space-y-2">
                                {domain.verification.errors.map((error, index) => (
                                  <div key={index} className="flex items-start gap-2 p-3 border border-red-200 rounded-lg bg-red-50">
                                    <X className="h-4 w-4 text-red-600 mt-0.5" />
                                    <span className="text-sm text-red-800">{error}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {domain.verification.recommendations.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Recommendations</h4>
                              <div className="space-y-2">
                                {domain.verification.recommendations.map((recommendation, index) => (
                                  <div key={index} className="flex items-start gap-2 p-3 border rounded-lg">
                                    <Check className="h-4 w-4 text-green-600 mt-0.5" />
                                    <span className="text-sm">{recommendation}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* DNS Configuration Dialog */}
            <Dialog open={!!dnsConfig} onOpenChange={() => setDnsConfig(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>DNS Configuration for {selectedDomain?.domain}</DialogTitle>
                  <DialogDescription>
                    Add these DNS records to your domain registrar to complete setup
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Instructions</h4>
                    <ol className="list-decimal list-inside space-y-1 text-sm">
                      {dnsConfig?.instructions.map((instruction, index) => (
                        <li key={index}>{instruction}</li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">DNS Records</h4>
                    <div className="space-y-2">
                      {dnsConfig?.records.map((record, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{record.type}</Badge>
                            <span className="font-medium">{record.name}</span>
                            <span className="text-sm font-mono">{record.value}</span>
                            {record.priority && (
                              <span className="text-sm text-muted-foreground">
                                Priority: {record.priority}
                              </span>
                            )}
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(record.value)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDnsConfig(null)}>
                    Close
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* DKIM Keys Dialog */}
            <Dialog open={!!dkimKeys} onOpenChange={() => setDkimKeys(null)}>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>DKIM Keys for {selectedDomain?.domain}</DialogTitle>
                  <DialogDescription>
                    Use these keys to configure DKIM signing for your domain
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Public Key (DNS Record)</h4>
                    <div className="p-3 border rounded bg-muted">
                      <code className="text-sm break-all">{dkimKeys?.record}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(dkimKeys?.record || '')}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Record
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Private Key</h4>
                    <div className="p-3 border rounded bg-muted">
                      <code className="text-sm break-all whitespace-pre">{dkimKeys?.privateKey}</code>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(dkimKeys?.privateKey || '')}
                      className="mt-2"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Private Key
                    </Button>
                  </div>
                  <div className="p-3 border border-yellow-200 rounded-lg bg-yellow-50">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mb-2" />
                    <p className="text-sm text-yellow-800">
                      Keep your private key secure. Do not share it with anyone.
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setDkimKeys(null)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    if (dkimKeys) {
                      const blob = new Blob([dkimKeys.privateKey], { type: 'text/plain' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `dkim-private-key-${selectedDomain?.domain}.txt`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    Download Private Key
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}