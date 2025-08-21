import { Link, useLocation } from "wouter";
import { Home, Users, FolderOpen, Plus, Database, BarChart3, User, CheckCircle, ChevronLeft, ChevronRight, LogOut, Shield, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import CustomerForm from "./customer-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAuth, ProtectedRoute } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [isAddCustomerOpen, setIsAddCustomerOpen] = useState(false);
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home, current: location === "/" },
    { name: "Clients", href: "/customers", icon: Users, current: location === "/customers" },
    { name: "Projects", href: "/projects", icon: FolderOpen, current: location === "/projects" },
    { name: "Survey Records", href: "/survey-records", icon: BarChart3, current: location === "/survey-records" },
  ];

  const adminNavigation = user?.role === 'admin' ? [
    { name: "Admin Panel", href: "/admin", icon: Shield, current: location === "/admin" },
  ] : [];

  const getPageTitle = () => {
    const currentNav = navigation.find(nav => nav.current);
    return currentNav ? currentNav.name : "Dashboard";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${isSidebarMinimized ? 'w-20' : 'w-64'} bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 relative`}>
        {/* Minimize Button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute -right-3 top-6 z-10 w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm hover:shadow-md"
          onClick={() => setIsSidebarMinimized(!isSidebarMinimized)}
        >
          {isSidebarMinimized ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </Button>

        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <img 
              src="https://www.landsurveys.in/images/ldr.png" 
              alt="LDR Surveys" 
              className="w-10 h-10 object-contain"
            />
            {!isSidebarMinimized && (
              <div>
                <h1 className="text-lg font-bold text-gray-900">LDR Surveys</h1>
                <p className="text-xs text-gray-500">Pvt Ltd</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-6">
          <ul className="space-y-2">
            {[...navigation, ...adminNavigation].map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link href={item.href}>
                    <div
                      className={`flex items-center ${isSidebarMinimized ? 'px-2 justify-center' : 'px-4'} py-3 text-sm font-medium rounded-lg transition-colors cursor-pointer ${
                        item.current
                          ? "text-green-700 bg-green-50 border border-green-200"
                          : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                      title={isSidebarMinimized ? item.name : undefined}
                    >
                      <Icon className={`w-5 h-5 ${isSidebarMinimized ? '' : 'mr-3'}`} />
                      {!isSidebarMinimized && item.name}
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Add Project Button */}
          <div className="mt-8">
            <Button 
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 ${isSidebarMinimized ? 'px-2' : ''}`}
              onClick={() => setIsAddCustomerOpen(true)}
              title={isSidebarMinimized ? "Add Project" : undefined}
            >
              <Plus className={`w-4 h-4 ${isSidebarMinimized ? '' : 'mr-2'}`} />
              {!isSidebarMinimized && "Add Project"}
            </Button>
          </div>
        </nav>
        
        {/* User Profile */}
        <div className="p-6 border-t border-gray-100">
          {user && (
            <div className={`flex items-center ${isSidebarMinimized ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              {!isSidebarMinimized && (
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                    {user.role}
                  </p>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="ml-2 text-gray-500 hover:text-red-600"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-gray-900">{getPageTitle()}</h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <CheckCircle className="w-3 h-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>

      {/* Add Customer Dialog */}
      <Dialog open={isAddCustomerOpen} onOpenChange={setIsAddCustomerOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSuccess={() => {
              setIsAddCustomerOpen(false);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <ProtectedRoute>
      <LayoutContent>{children}</LayoutContent>
    </ProtectedRoute>
  );
}