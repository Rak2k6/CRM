import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { 
  User, 
  Building, 
  Calendar, 
  Clock, 
  LogOut, 
  Home,
  Menu,
  X,
  UserPlus,
  Briefcase,
  MapPin,
  ClipboardList,
  Bell,
  Settings,
  FileText,
  Shield
} from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/user",
    icon: Home
  },
  {
    name: "Profile",
    href: "/user/profile", 
    icon: User
  },
  {
    name: "Lead",
    href: "/user/leads",
    icon: UserPlus
  },
  {
    name: "Customer",
    href: "/user/customer",
    icon: Building
  },
  {
    name: "Task",
    href: "/user/tasks",
    icon: ClipboardList
  },
  {
    name: "Circular",
    href: "/user/holidays",
    icon: Bell
  },
  {
    name: "Leave",
    href: "/user/leaves",
    icon: Clock
  },
  {
    name: "Change Password",
    href: "/user/password",
    icon: Shield
  },
  {
    name: "Time Sheet",
    href: "/user/timesheet",
    icon: Calendar
  },
  {
    name: "Complaint",
    href: "/user/complaints",
    icon: FileText
  },
  {
    name: "Rules & Regulations",
    href: "/user/rules",
    icon: Settings
  }
];

interface UserLayoutProps {
  children: React.ReactNode;
}

export function UserLayout({ children }: UserLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="flex">
        {/* Sidebar - Desktop */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto bg-gradient-to-b from-teal-600 to-teal-700">
            {/* Logo Section */}
            <div className="flex items-center px-4 mb-8">
              <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center mr-3">
                <span className="text-teal-600 font-bold text-lg">S</span>
              </div>
              <div className="text-white">
                <div className="font-bold text-lg">SCRM - PHP</div>
                <div className="text-xs text-teal-200">Simple Customer Relationship Management System - Customer Side</div>
              </div>
            </div>

            {/* Welcome Section */}
            <div className="px-4 mb-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-green-400 rounded-full flex items-center justify-center mr-3">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div className="text-white">
                  <div className="text-sm font-medium">Welcome</div>
                  <div className="text-xs text-teal-200">
                    {user?.username} - DigitalMarketing
                  </div>
                  <div className="text-xs text-teal-200">Online</div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="px-2 pb-4 space-y-1">
              <div className="text-white text-xs uppercase tracking-wide px-3 py-2 font-semibold">
                Browse
              </div>
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        isActive
                          ? "bg-teal-800 text-white"
                          : "text-teal-100 hover:bg-teal-700 hover:text-white"
                      }`}
                      data-testid={`nav-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      <span>{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="px-2 mt-auto">
              <Button
                onClick={handleLogout}
                className="w-full bg-teal-800 hover:bg-teal-900 text-white border-0"
                size="sm"
                data-testid="button-logout"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <header className="sticky top-0 z-50 w-full border-b bg-teal-600">
            <div className="flex h-16 items-center px-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:bg-teal-700"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
              
              <div className="ml-4 flex items-center space-x-2">
                <div className="h-8 w-8 bg-white rounded-lg flex items-center justify-center">
                  <span className="text-teal-600 font-bold text-sm">S</span>
                </div>
                <span className="font-semibold text-white">SCRM</span>
              </div>

              <div className="ml-auto">
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-teal-700"
                  data-testid="button-logout-mobile"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          {/* Mobile Navigation */}
          {isMobileMenuOpen && (
            <div className="bg-teal-600 border-t border-teal-500">
              <nav className="px-2 py-4 space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location === item.href;
                  return (
                    <Link key={item.href} href={item.href}>
                      <div
                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                          isActive
                            ? "bg-teal-800 text-white"
                            : "text-teal-100 hover:bg-teal-700 hover:text-white"
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        <span>{item.name}</span>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col flex-1">
          {/* Top Header for Desktop */}
          <header className="hidden md:block bg-white dark:bg-gray-800 shadow-sm border-b">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="text-gray-600 dark:text-gray-300 text-sm">
                  Simple Customer Relationship Management System - Customer Side
                </div>
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    Update
                  </Button>
                  <Button
                    onClick={handleLogout}
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-gray-800"
                    data-testid="button-logout-desktop"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-gray-100 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">LDR Survey Pvt Ltd</h3>
              <p className="text-sm text-muted-foreground">
                Professional survey project management and web development services across Tamil Nadu, Kerala, Karnataka, and Andhra Pradesh.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Email: lands@landsurveys.in</p>
                <p>Phone: +91 9840281288</p>
                <p>Hours: Sun-Sat 9:30 AM - 6:30 PM</p>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Services</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>Land Survey, Topographical Survey</p>
                <p>Building Plans, FMB Sketch</p>
                <p>Real Estate & Digital Land Services</p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t text-center text-sm text-muted-foreground">
            <p>&copy; 2025 LDR Survey Pvt Ltd. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}