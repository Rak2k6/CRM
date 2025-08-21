import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, FolderOpen, DollarSign, TrendingUp, 
  Calendar, Clock, FileCheck, AlertCircle
} from "lucide-react";
import { Link } from "wouter";

export function AdminHome() {
  const stats = [
    {
      title: "Total Users",
      value: "1,234",
      change: "+12%",
      icon: Users,
      color: "text-blue-600"
    },
    {
      title: "Active Projects",
      value: "89",
      change: "+5%",
      icon: FolderOpen,
      color: "text-green-600"
    },
    {
      title: "Revenue (This Month)",
      value: "₹2,45,678",
      change: "+18%",
      icon: DollarSign,
      color: "text-yellow-600"
    },
    {
      title: "Pending Tasks",
      value: "23",
      change: "-8%",
      icon: AlertCircle,
      color: "text-red-600"
    }
  ];

  const recentActivities = [
    { action: "New project created", user: "John Doe", time: "2 hours ago" },
    { action: "Invoice generated", user: "Jane Smith", time: "4 hours ago" },
    { action: "Employee added", user: "Admin", time: "6 hours ago" },
    { action: "Report generated", user: "Mike Johnson", time: "1 day ago" }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome to the LDR Surveys Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className={`text-xs ${
                  stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activities
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/admin/accounting/customer-form">
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                  data-testid="button-add-user"
                >
                  <Users className="w-6 h-6 text-blue-600" />
                  <span className="text-sm font-medium">Add User</span>
                </Button>
              </Link>
              
              <Link href="/admin/projects/project">
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                  data-testid="button-new-project"
                >
                  <FolderOpen className="w-6 h-6 text-green-600" />
                  <span className="text-sm font-medium">New Project</span>
                </Button>
              </Link>
              
              <Link href="/admin/accounting/reports">
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                  data-testid="button-generate-report"
                >
                  <FileCheck className="w-6 h-6 text-yellow-600" />
                  <span className="text-sm font-medium">Generate Report</span>
                </Button>
              </Link>
              
              <Link href="/admin/task">
                <Button 
                  variant="outline" 
                  className="w-full h-auto p-4 flex flex-col items-center space-y-2 hover:bg-gray-50"
                  data-testid="button-schedule-task"
                >
                  <Calendar className="w-6 h-6 text-red-600" />
                  <span className="text-sm font-medium">Schedule Task</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}