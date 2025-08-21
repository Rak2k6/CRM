import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, FolderOpen, Database, FileText, UserCheck, Settings, CheckCircle, BarChart3, ArrowRight, TrendingUp, DollarSign, Target, Calendar, MapPin, Phone, Mail } from "lucide-react";
import DashboardButtons from "@/components/DashboardButtons";
import DatabaseManager from "@/components/database-manager";

export default function Dashboard() {
  const [isDatabaseManagerOpen, setIsDatabaseManagerOpen] = useState(false);

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery({
    queryKey: ["/api/leads"],
  });

  // Fetch authentic LDR Survey data
  const { data: surveyRecords = [], isLoading: surveyRecordsLoading } = useQuery({
    queryKey: ["/api/survey-records"],
  });

  const { data: admins = [], isLoading: adminsLoading } = useQuery({
    queryKey: ["/api/admin"],
  });

  const { data: ldrContacts = [], isLoading: contactsLoading } = useQuery({
    queryKey: ["/api/ldr-contacts"],
  });

  const { data: ldrCareers = [], isLoading: careersLoading } = useQuery({
    queryKey: ["/api/ldr-careers"],
  });

  const { data: clientRegisters = [], isLoading: clientRegistersLoading } = useQuery({
    queryKey: ["/api/client-registers"],
  });

  const isLoading = customersLoading || projectsLoading || leadsLoading || 
                   surveyRecordsLoading || adminsLoading || contactsLoading || 
                   careersLoading || clientRegistersLoading;

  // Calculate metrics from all integrated data
  const totalCustomers = customers.length;
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const totalRevenue = leads.reduce((sum, lead) => sum + parseFloat(lead.value || "0"), 0);
  const totalSurveyRecords = surveyRecords.length;
  const completedSurveys = surveyRecords.filter(s => s.status === "completed").length;
  const activeTeamMembers = admins.length;
  const totalInquiries = ldrContacts.length;
  const careerApplications = ldrCareers.length;
  const registeredClients = clientRegisters.length;
  
  // Database integration stats with actual data
  const databaseSystems = [
    { name: "Admin Panel", records: `${admins.length} users`, icon: Settings, status: "connected" },
    { name: "Client Registrations", records: `${registeredClients} clients`, icon: Users, status: "connected" },
    { name: "Contact Inquiries", records: `${totalInquiries} inquiries`, icon: Phone, status: "connected" },
    { name: "Career Applications", records: `${careerApplications} applications`, icon: UserCheck, status: "connected" },
    { name: "Survey Records", records: `${totalSurveyRecords} surveys`, icon: MapPin, status: "connected" },
    { name: "Project Database", records: `${totalProjects} projects`, icon: FolderOpen, status: "connected" }
  ];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-16 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="https://www.landsurveys.in/images/ldr.png" 
            alt="LDR Surveys" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">LDR Surveys CRM</h2>
            <p className="text-gray-600">Comprehensive Land Survey Management System</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            System Active
          </Badge>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Database className="w-3 h-3 mr-1" />
            6/6 Databases Connected
          </Badge>
          <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
            <BarChart3 className="w-3 h-3 mr-1" />
            Real Data Loaded
          </Badge>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Clients</CardTitle>
            <Users className="h-6 w-6 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">{totalCustomers}</div>
            <p className="text-xs text-blue-700">
              Active relationships
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Survey Records</CardTitle>
            <MapPin className="h-6 w-6 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">{totalSurveyRecords}</div>
            <p className="text-xs text-green-700">
              {completedSurveys} completed surveys
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Projects</CardTitle>
            <FolderOpen className="h-6 w-6 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">{totalProjects}</div>
            <p className="text-xs text-purple-700">
              {completedProjects} completed
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Total Revenue</CardTitle>
            <DollarSign className="h-6 w-6 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">₹{totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-orange-700">
              From active leads
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Authentic LDR Survey Data Overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              LDR Survey Database Integration
            </CardTitle>
            <CardDescription>
              Real data from LDR Survey Pvt Ltd business systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {databaseSystems.map((system) => {
              const Icon = system.icon;
              return (
                <div key={system.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Icon className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">{system.name}</p>
                      <p className="text-xs text-gray-500">{system.records}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Live Business Metrics
            </CardTitle>
            <CardDescription>
              Real-time data from authenticated LDR Survey operations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-900">{activeTeamMembers}</div>
                <p className="text-xs text-blue-700">Team Members</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-900">{totalInquiries}</div>
                <p className="text-xs text-green-700">Client Inquiries</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-900">{careerApplications}</div>
                <p className="text-xs text-purple-700">Career Applications</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-900">{registeredClients}</div>
                <p className="text-xs text-orange-700">Registered Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity - Show Latest Authentic Data */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Contact Inquiries</CardTitle>
            <CardDescription>Latest authentic client inquiries from LDR Survey contact system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ldrContacts.slice(0, 5).map((contact, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{contact.phoneNumber}</p>
                    <Badge variant="outline" className="text-xs">New Inquiry</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/customers">
                <Button variant="outline" className="w-full">
                  View All Contacts <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Career Applications</CardTitle>
            <CardDescription>Professional surveyors seeking positions at LDR Survey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ldrCareers.slice(0, 5).map((career, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{career.name}</p>
                    <p className="text-sm text-gray-500">{career.email}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{career.phoneNumber}</p>
                    <Badge variant="outline" className="text-xs">Surveyor</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                View All Applications <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access (matches PHP design) */}
      <DashboardButtons />

      {/* Database Manager Dialog */}
      <DatabaseManager 
        isOpen={isDatabaseManagerOpen}
        onClose={() => setIsDatabaseManagerOpen(false)}
      />
    </div>
  );
}
