import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Download, TrendingUp, TrendingDown, Users, DollarSign, Target } from "lucide-react";
import type { Customer, Project, Lead, Communication } from "@shared/schema";
import PageHeader from "@/components/PageHeader";

export default function Reports() {
  const { data: customers = [], isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: communications = [], isLoading: communicationsLoading } = useQuery<Communication[]>({
    queryKey: ["/api/communications"],
  });

  const isLoading = customersLoading || projectsLoading || leadsLoading || communicationsLoading;

  // Calculate metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(c => c.status === "active").length;
  const prospectCustomers = customers.filter(c => c.status === "prospect").length;
  
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === "in_progress").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  
  const totalLeads = leads.length;
  const openLeads = leads.filter(l => !["closed_won", "closed_lost"].includes(l.stage)).length;
  const wonLeads = leads.filter(l => l.stage === "closed_won").length;
  const lostLeads = leads.filter(l => l.stage === "closed_lost").length;
  
  const totalRevenue = projects
    .filter(p => p.budget)
    .reduce((sum, p) => sum + parseFloat(p.budget || "0"), 0);

  const pipelineValue = leads
    .filter(l => l.value && !["closed_won", "closed_lost"].includes(l.stage))
    .reduce((sum, l) => sum + parseFloat(l.value || "0"), 0);

  // Lead sources
  const leadSources = customers.reduce((acc, customer) => {
    const source = customer.leadSource || "Unknown";
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Project status distribution
  const projectStatusDistribution = projects.reduce((acc, project) => {
    acc[project.status] = (acc[project.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Monthly communication trends (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  const recentCommunications = communications.filter(c => 
    new Date(c.createdAt!) >= sixMonthsAgo
  );

  const communicationsByType = recentCommunications.reduce((acc, comm) => {
    acc[comm.type] = (acc[comm.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const exportReport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        prospects: prospectCustomers,
      },
      projects: {
        total: totalProjects,
        active: activeProjects,
        completed: completedProjects,
      },
      leads: {
        total: totalLeads,
        open: openLeads,
        won: wonLeads,
        lost: lostLeads,
        conversionRate: totalLeads > 0 ? (wonLeads / totalLeads * 100).toFixed(1) : "0",
      },
      revenue: {
        total: totalRevenue,
        pipeline: pipelineValue,
      },
      leadSources,
      projectStatusDistribution,
      communicationsByType,
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `crm-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-slate-200 rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="Business Reports"
        subtitle="Comprehensive overview of your CRM performance"
        action={(
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        )}
      />

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Customer Growth</p>
                <p className="text-2xl font-bold text-slate-900">
                  {activeCustomers}/{totalCustomers}
                </p>
                <p className="text-xs text-slate-500">Active/Total</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={totalCustomers > 0 ? (activeCustomers / totalCustomers) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Project Success Rate</p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-500">{completedProjects} completed</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={totalProjects > 0 ? (completedProjects / totalProjects) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Lead Conversion</p>
                <p className="text-2xl font-bold text-slate-900">
                  {totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0}%
                </p>
                <p className="text-xs text-slate-500">{wonLeads} won leads</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <Progress 
                value={totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0} 
                className="h-2" 
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Revenue</p>
                <p className="text-2xl font-bold text-slate-900">${totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-slate-500">From completed projects</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="h-4 w-4 text-accent mr-1" />
              <span className="text-accent font-medium">${pipelineValue.toLocaleString()}</span>
              <span className="text-slate-600 ml-1">in pipeline</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(leadSources).length === 0 ? (
              <p className="text-slate-500 text-center py-8">No lead source data available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(leadSources)
                  .sort(([,a], [,b]) => b - a)
                  .map(([source, count]) => {
                    const percentage = totalCustomers > 0 ? (count / totalCustomers) * 100 : 0;
                    return (
                      <div key={source}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700 capitalize">
                            {source}
                          </span>
                          <span className="text-sm text-slate-600">
                            {count} customers ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Project Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(projectStatusDistribution).length === 0 ? (
              <p className="text-slate-500 text-center py-8">No project data available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(projectStatusDistribution)
                  .sort(([,a], [,b]) => b - a)
                  .map(([status, count]) => {
                    const percentage = totalProjects > 0 ? (count / totalProjects) * 100 : 0;
                    const statusLabels = {
                      planning: "Planning",
                      in_progress: "In Progress",
                      completed: "Completed",
                      cancelled: "Cancelled",
                    };
                    return (
                      <div key={status}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {statusLabels[status as keyof typeof statusLabels] || status}
                          </span>
                          <span className="text-sm text-slate-600">
                            {count} projects ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Communication Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Communication Activity (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.keys(communicationsByType).length === 0 ? (
              <p className="text-slate-500 text-center py-8">No communication data available</p>
            ) : (
              <div className="space-y-4">
                {Object.entries(communicationsByType)
                  .sort(([,a], [,b]) => b - a)
                  .map(([type, count]) => {
                    const percentage = recentCommunications.length > 0 ? (count / recentCommunications.length) * 100 : 0;
                    const typeLabels = {
                      email: "Email",
                      phone: "Phone",
                      meeting: "Meeting",
                      note: "Note",
                    };
                    return (
                      <div key={type}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-slate-700">
                            {typeLabels[type as keyof typeof typeLabels] || type}
                          </span>
                          <span className="text-sm text-slate-600">
                            {count} communications ({percentage.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={percentage} className="h-2" />
                      </div>
                    );
                  })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pipeline Health */}
        <Card>
          <CardHeader>
            <CardTitle>Pipeline Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Pipeline Value</span>
                  <span className="text-lg font-bold text-slate-900">${pipelineValue.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <span>{openLeads} open leads</span>
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Win Rate</span>
                  <span className="text-lg font-bold text-slate-900">
                    {totalLeads > 0 ? Math.round((wonLeads / totalLeads) * 100) : 0}%
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <span>{wonLeads} won, {lostLeads} lost</span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-600">Average Deal Size</span>
                  <span className="text-lg font-bold text-slate-900">
                    {wonLeads > 0 
                      ? `$${Math.round(leads
                          .filter(l => l.stage === "closed_won" && l.value)
                          .reduce((sum, l) => sum + parseFloat(l.value || "0"), 0) / wonLeads
                        ).toLocaleString()}`
                      : "$0"}
                  </span>
                </div>
                <div className="flex items-center text-sm text-slate-500">
                  <span>From won deals</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
