import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, Settings, FileText, UserCheck, Users, ExternalLink, RefreshCw } from "lucide-react";

interface DatabaseManagerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DatabaseManager({ isOpen, onClose }: DatabaseManagerProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const databaseSystems = [
    { 
      name: "ERP Software", 
      records: "1000+ records", 
      icon: Database, 
      status: "connected",
      description: "Complete business management system",
      url: "https://www.landsurveys.in/admin"
    },
    { 
      name: "Admin Panel", 
      records: "500+ records", 
      icon: Settings, 
      status: "connected",
      description: "Administrative control panel",
      url: "https://www.landsurveys.in/admin/panel"
    },
    { 
      name: "Contact System", 
      records: "74 records", 
      icon: FileText, 
      status: "connected",
      description: "Client inquiry management",
      url: "https://www.landsurveys.in/contact/manage"
    },
    { 
      name: "Career Portal", 
      records: "74 records", 
      icon: UserCheck, 
      status: "connected",
      description: "Job applications and recruitment",
      url: "https://www.landsurveys.in/careers/admin"
    },
    { 
      name: "Newsletter", 
      records: "74 records", 
      icon: FileText, 
      status: "connected",
      description: "Subscription management",
      url: "https://www.landsurveys.in/newsletter/admin"
    },
    { 
      name: "Subscriptions", 
      records: "200+ records", 
      icon: Users, 
      status: "connected",
      description: "Service subscriptions",
      url: "https://www.landsurveys.in/subscriptions"
    }
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Database Management Center
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Status Overview */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium text-green-900">All Systems Operational</p>
                <p className="text-sm text-green-700">6/6 databases connected and synchronized</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="border-green-300 text-green-700 hover:bg-green-100"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh All
            </Button>
          </div>

          {/* Database Systems Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {databaseSystems.map((system, index) => (
              <Card key={index} className="border border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <system.icon className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <CardTitle className="text-sm font-semibold">{system.name}</CardTitle>
                        <p className="text-xs text-gray-500">{system.records}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">
                      Connected
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4">{system.description}</p>
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => window.open(system.url, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Settings className="h-3 w-3 mr-1" />
                      Config
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-blue-600" />
                  <div className="text-left">
                    <p className="font-medium">Database Backup</p>
                    <p className="text-sm text-gray-500">Create system backup</p>
                  </div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="flex items-center gap-3">
                  <RefreshCw className="h-5 w-5 text-green-600" />
                  <div className="text-left">
                    <p className="font-medium">Sync All Data</p>
                    <p className="text-sm text-gray-500">Synchronize databases</p>
                  </div>
                </div>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}