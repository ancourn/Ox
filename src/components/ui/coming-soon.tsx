'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from 'lucide-react';

interface ComingSoonProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: Array<{
    title: string;
    description: string;
  }>;
  integration?: {
    name: string;
    description: string;
    features: string[];
    benefits: string[];
  };
  color: string;
}

export function ComingSoon({ 
  title, 
  description, 
  icon: Icon, 
  features, 
  integration,
  color 
}: ComingSoonProps) {
  return (
    <div className="flex h-screen bg-background">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            {/* Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${color} rounded-full mb-4`}>
                <Icon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold mb-2">{title}</h1>
              <p className="text-muted-foreground mb-4">{description}</p>
              <Badge variant="outline" className="mb-6">
                Coming Soon in Phase 2
              </Badge>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Overview Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon className="h-5 w-5" />
                    {title}
                  </CardTitle>
                  <CardDescription>
                    Advanced {title.toLowerCase()} capabilities for enhanced productivity
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {features.map((feature, index) => (
                      <Card key={index} className="border-dashed">
                        <CardContent className="p-4 text-center">
                          <div className="h-8 w-8 bg-muted rounded-full flex items-center justify-center mx-auto mb-2">
                            <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          </div>
                          <h3 className="font-medium mb-1">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">{feature.description}</p>
                          <Badge variant="secondary" className="mt-2 text-xs">
                            Planned
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Integration Info */}
              {integration && (
                <Card>
                  <CardHeader>
                    <CardTitle>{integration.name} Integration</CardTitle>
                    <CardDescription>
                      {integration.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Features</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {integration.features.map((feature, index) => (
                              <li key={index}>• {feature}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Benefits</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {integration.benefits.map((benefit, index) => (
                              <li key={index}>• {benefit}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Development Timeline</CardTitle>
                  <CardDescription>
                    Track the progress of {title.toLowerCase()} module development
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Planning Complete</span>
                          <Badge variant="secondary">Done</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Requirements and architecture finalized</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Integration Development</span>
                          <Badge variant="outline">In Progress</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Core integration and API development</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Beta Testing</span>
                          <Badge variant="outline">Upcoming</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">User testing and feedback collection</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Call to Action */}
              <Card>
                <CardContent className="p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Stay Updated</h3>
                  <p className="text-muted-foreground mb-4">
                    Be the first to know when {title.toLowerCase()} module is released
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button>
                      Join Beta Program
                    </Button>
                    <Button variant="outline">
                      View Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}