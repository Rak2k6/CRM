import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Building, Phone, Mail, AlertCircle, CheckCircle, XCircle, FolderPlus, Briefcase } from "lucide-react";
import { Link } from "wouter";
import type { User as UserProfile } from "@shared/schema";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  phoneNumber?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

interface UserLeave {
  id: number;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  totalDays: number;
}

interface Holiday {
  id: number;
  name: string;
  date: string;
  type: string;
}

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200", 
  rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
};

const statusIcons = {
  pending: AlertCircle,
  approved: CheckCircle,
  rejected: XCircle
};

export function UserDashboard() {
  const { user: authUser } = useAuth();

  const { data: profile } = useQuery<UserProfile>({
    queryKey: ["/api/user/profile"],
    enabled: !!authUser
  });

  const { data: recentLeaves = [] } = useQuery({
    queryKey: ["/api/user/leaves"],
    enabled: !!authUser,
    select: (data: UserLeave[]) => data.slice(0, 3) // Show only recent 3 leaves
  });

  const { data: upcomingHolidays = [] } = useQuery({
    queryKey: ["/api/holidays"],
    enabled: !!authUser,
    select: (data: Holiday[]) => {
      const today = new Date();
      return data
        .filter(holiday => new Date(holiday.date) >= today)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 3);
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (dateString: string) => {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
          Dashboard
        </h1>
      </div>

      {/* Main Dashboard Cards - Matching Screenshot Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-medium">Project Planner</CardTitle>
            <FolderPlus className="h-6 w-6 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">0</div>
            <p className="text-blue-100 text-sm">Active planning items</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white border-0 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-lg font-medium">Total Projects</CardTitle>
            <Briefcase className="h-6 w-6 text-white/80" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold mb-2">0</div>
            <p className="text-teal-100 text-sm">Projects submitted</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Profile Summary</span>
            </CardTitle>
            <CardDescription>Your account information at a glance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center space-x-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">
                    {profile?.firstName && profile?.lastName 
                      ? `${profile.firstName} ${profile.lastName}` 
                      : profile?.username || "Not set"}
                  </p>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{profile?.email || "Not set"}</p>
                  <p className="text-xs text-muted-foreground">Email Address</p>
                </div>
              </div>
              {profile?.phoneNumber && (
                <div className="flex items-center space-x-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{profile.phoneNumber}</p>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                  </div>
                </div>
              )}
              {profile?.company && (
                <div className="flex items-center space-x-3">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{profile.company}</p>
                    <p className="text-xs text-muted-foreground">Company</p>
                  </div>
                </div>
              )}
            </div>
            <div className="pt-2">
              <Link href="/user/profile">
                <Button variant="outline" size="sm" className="w-full" data-testid="button-edit-profile">
                  Edit Profile
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Recent Leave Applications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Recent Leave Applications</span>
            </CardTitle>
            <CardDescription>Your latest leave requests and their status</CardDescription>
          </CardHeader>
          <CardContent>
            {recentLeaves.length === 0 ? (
              <div className="text-center py-6">
                <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No leave applications yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentLeaves.map((leave: UserLeave) => {
                  const StatusIcon = statusIcons[leave.status];
                  return (
                    <div key={leave.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium">{leave.leaveType}</p>
                          <Badge className={statusColors[leave.status]} variant="outline">
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {leave.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(leave.startDate)} - {formatDate(leave.endDate)} ({leave.totalDays} days)
                        </p>
                      </div>
                    </div>
                  );
                })}
                <Link href="/user/leaves">
                  <Button variant="outline" size="sm" className="w-full mt-3" data-testid="button-view-all-leaves">
                    View All Applications
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Holidays */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Upcoming Holidays</span>
          </CardTitle>
          <CardDescription>Next few holidays and company events</CardDescription>
        </CardHeader>
        <CardContent>
          {upcomingHolidays.length === 0 ? (
            <div className="text-center py-6">
              <Calendar className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No upcoming holidays</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {upcomingHolidays.map((holiday: Holiday) => {
                const daysUntil = getDaysUntil(holiday.date);
                return (
                  <div key={holiday.id} className="p-4 border rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                    <div className="space-y-2">
                      <h3 className="font-medium">{holiday.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(holiday.date)}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {daysUntil === 0 ? "Today" : daysUntil === 1 ? "Tomorrow" : `${daysUntil} days away`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="pt-4">
            <Link href="/user/holidays">
              <Button variant="outline" size="sm" className="w-full" data-testid="button-view-all-holidays">
                View All Holidays
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Commonly used features</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/user/profile">
              <Button variant="outline" className="w-full h-16 flex flex-col space-y-2" data-testid="button-quick-profile">
                <User className="h-5 w-5" />
                <span className="text-sm">Update Profile</span>
              </Button>
            </Link>
            <Link href="/user/customer">
              <Button variant="outline" className="w-full h-16 flex flex-col space-y-2" data-testid="button-quick-customer">
                <Building className="h-5 w-5" />
                <span className="text-sm">Customer Info</span>
              </Button>
            </Link>
            <Link href="/user/leaves">
              <Button variant="outline" className="w-full h-16 flex flex-col space-y-2" data-testid="button-quick-leave">
                <Clock className="h-5 w-5" />
                <span className="text-sm">Apply Leave</span>
              </Button>
            </Link>
            <Link href="/user/holidays">
              <Button variant="outline" className="w-full h-16 flex flex-col space-y-2" data-testid="button-quick-holidays">
                <Calendar className="h-5 w-5" />
                <span className="text-sm">View Holidays</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}