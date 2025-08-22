import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, Search, Users, FileText, Calculator, FolderOpen, 
  ClipboardList, HandHeart, Briefcase, DollarSign, Building,
  Settings, LogOut, ChevronDown, ChevronRight, Menu, X,
  UserCheck, GraduationCap, Receipt, CreditCard, Package,
  TrendingUp, Calendar, Clock, FileCheck, Megaphone, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from "@/contexts/AuthContext";

interface SidebarItem {
  name: string;
  href?: string;
  icon: any;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "Search", href: "/admin/search", icon: Search },
  {
    name: "Lead",
    icon: Users,
    children: [
      { name: "LDR Form", href: "/admin/lead/ldr-form", icon: FileText },
      { name: "LSIT Form", href: "/admin/lead/lsit-form", icon: FileText }
    ]
  },
  {
    name: "Accounting",
    icon: Calculator,
    children: [
      { name: "Customer Form", href: "/admin/accounting/customer-form", icon: Users },
      { name: "Vendor", href: "/admin/accounting/vendor", icon: Building },
      { name: "Banking", href: "/admin/accounting/banking", icon: CreditCard },
      { name: "Receipt", href: "/admin/accounting/receipt", icon: Receipt },
      { name: "Expenses", href: "/admin/accounting/expenses", icon: DollarSign },
      { name: "Receipt and Expenses Report", href: "/admin/accounting/receipt-expenses-report", icon: FileCheck },
      { name: "Purchase", href: "/admin/accounting/purchase", icon: Package },
      { name: "AMC", href: "/admin/accounting/amc", icon: Settings },
      { name: "Reports (General Reports)", href: "/admin/accounting/reports", icon: TrendingUp }
    ]
  },
  {
    name: "Projects",
    icon: FolderOpen,
    children: [
      { name: "Project", href: "/admin/projects/project", icon: FolderOpen },
      { name: "Pipeline Project", href: "/admin/projects/pipeline", icon: TrendingUp },
      { name: "Requested Project", href: "/admin/projects/requested", icon: ClipboardList }
    ]
  },
  {
    name: "Forms",
    icon: ClipboardList,
    children: [
      { name: "Surveyor Form", href: "/admin/forms/surveyor", icon: UserCheck },
      { name: "Student Form", href: "/admin/forms/student", icon: GraduationCap }
    ]
  },
  {
    name: "Relationships",
    icon: HandHeart,
    children: [
      { name: "Customers", href: "/admin/relationships/customers", icon: Users },
      { name: "Vendor", href: "/admin/relationships/vendor", icon: Building },
      { name: "Banking", href: "/admin/relationships/banking", icon: CreditCard },
      { name: "Receipt", href: "/admin/relationships/receipt", icon: Receipt },
      { name: "Expenses", href: "/admin/relationships/expenses", icon: DollarSign },
      { name: "Receipt and Expenses Report", href: "/admin/relationships/receipt-expenses-report", icon: FileCheck },
      { name: "Purchase", href: "/admin/relationships/purchase", icon: Package },
      { name: "AMC", href: "/admin/relationships/amc", icon: Settings }
    ]
  },
  { name: "Task", href: "/admin/task", icon: ClipboardList },
  {
    name: "Sales",
    icon: DollarSign,
    children: [
      { name: "LDR Bill Report", href: "/admin/sales/ldr-bill-report", icon: FileCheck },
      { name: "Student Bill Report", href: "/admin/sales/student-bill-report", icon: FileCheck }
    ]
  },
  {
    name: "Asset Management",
    icon: Briefcase,
    children: [
      { name: "Instruments", href: "/admin/assets/instruments", icon: Settings },
      { name: "Stock", href: "/admin/assets/stock", icon: Package },
      { name: "Due List", href: "/admin/assets/due-list", icon: ClipboardList }
    ]
  },
  {
    name: "HRM",
    icon: Users,
    children: [
      { name: "Payroll", href: "/admin/hrm/payroll", icon: DollarSign },
      { name: "Employee", href: "/admin/hrm/employee", icon: UserCheck },
      { name: "Leave", href: "/admin/hrm/leave", icon: Calendar },
      { name: "Timesheet", href: "/admin/hrm/timesheet", icon: Clock },
      { name: "Complaints and Letters", href: "/admin/hrm/complaints", icon: FileText }
    ]
  },
  { name: "Circulars", href: "/admin/circulars", icon: Megaphone },
  { name: "User and Userlog", href: "/admin/user-userlog", icon: Users },
  { name: "Users Management", href: "/admin/users-management", icon: Shield }
];

interface AdminSidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export function AdminSidebar({ isCollapsed, onToggle }: AdminSidebarProps) {
  const [location, setLocation] = useLocation();
  const { logout } = useAuth();
  const [openSections, setOpenSections] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    if (isCollapsed) return;
    
    setOpenSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(name => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const renderSidebarItem = (item: SidebarItem, depth = 0) => {
    const isActive = item.href === location;
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openSections.includes(item.name);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <Collapsible 
          key={item.name} 
          open={isOpen && !isCollapsed} 
          onOpenChange={() => toggleSection(item.name)}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className={`w-full justify-start px-4 py-2 h-auto ${
                isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
              }`}
              style={{ paddingLeft: `${16 + depth * 16}px` }}
            >
              <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
              {!isCollapsed && (
                <>
                  <span className="flex-1 text-left">{item.name}</span>
                  {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </>
              )}
            </Button>
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent>
              <div className="ml-4 border-l border-gray-200">
                {item.children?.map(child => renderSidebarItem(child, depth + 1))}
              </div>
            </CollapsibleContent>
          )}
        </Collapsible>
      );
    }

    return (
      <Button
        key={item.name}
        variant="ghost"
        onClick={() => item.href && setLocation(item.href)}
        className={`w-full justify-start px-4 py-2 h-auto ${
          isActive ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
        }`}
        style={{ paddingLeft: `${16 + depth * 16}px` }}
        title={isCollapsed ? item.name : undefined}
      >
        <Icon className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
        {!isCollapsed && <span className="text-left">{item.name}</span>}
      </Button>
    );
  };

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-white border-r border-gray-200 flex flex-col shadow-sm transition-all duration-300 relative`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center">
              <img 
                src="https://www.landsurveys.in/images/ldr.png" 
                alt="LDR Surveys" 
                className="w-8 h-8 object-contain mr-3"
              />
              <div>
                <h1 className="text-lg font-bold text-gray-900">Admin Panel</h1>
                <p className="text-xs text-gray-500">LDR Surveys</p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="p-1"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <X className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <div className="space-y-1">
          {sidebarItems.map(item => renderSidebarItem(item))}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start px-4 py-2 h-auto text-red-600 hover:bg-red-50 hover:text-red-700 ${
            isCollapsed ? 'px-2' : ''
          }`}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut className={`w-4 h-4 ${isCollapsed ? '' : 'mr-3'}`} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}