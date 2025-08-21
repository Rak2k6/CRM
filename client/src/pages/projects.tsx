import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FolderOpen, Calendar, FileText, Search, Plus, MapPin, Clock, DollarSign, User, BarChart3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Customer } from "@shared/schema";

export default function Projects() {
  const { toast } = useToast();
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddProject, setShowAddProject] = useState(false);
  
  const { data: projects = [], isLoading: projectsLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const isLoading = projectsLoading || customersLoading;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/projects/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Project deleted",
        description: "Project has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter projects based on search term
  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">In Progress</Badge>;
      case "planning":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Planning</Badge>;
      case "on_hold":
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">On Hold</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700 border-gray-200">Unknown</Badge>;
    }
  };

  const getProjectTypeBadge = (project: Project) => {
    const description = project.description?.toLowerCase() || '';
    const name = project.name.toLowerCase();
    
    if (description.includes('topographical') || name.includes('topographical')) {
      return <Badge className="bg-blue-100 text-blue-700">Topographical</Badge>;
    } else if (description.includes('land') || name.includes('land')) {
      return <Badge className="bg-green-100 text-green-700">Land Survey</Badge>;
    } else if (description.includes('building') || name.includes('building')) {
      return <Badge className="bg-purple-100 text-purple-700">Building Survey</Badge>;
    } else if (description.includes('web') || name.includes('web')) {
      return <Badge className="bg-orange-100 text-orange-700">Web Development</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-700">General Project</Badge>;
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : 'Unknown Client';
  };

  // Calculate project statistics
  const totalProjects = projects.length;
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const activeProjects = projects.filter(p => p.status === "in_progress").length;
  const totalRevenue = projects.reduce((sum, project) => sum + parseFloat(project.budget || "0"), 0);

  if (isLoading) {
    return (
      <div className="space-y-8 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src="https://www.landsurveys.in/images/ldr.png" 
            alt="LDR Surveys" 
            className="w-10 h-10 object-contain"
          />
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Project Management</h2>
            <p className="text-gray-600">Track and manage all survey and development projects</p>
          </div>
        </div>
        <Button onClick={() => setShowAddProject(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Total Projects</CardTitle>
            <FolderOpen className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{totalProjects}</div>
            <p className="text-xs text-blue-700">All projects</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-900">Completed</CardTitle>
            <BarChart3 className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">{completedProjects}</div>
            <p className="text-xs text-green-700">Finished projects</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-900">Active Projects</CardTitle>
            <Clock className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{activeProjects}</div>
            <p className="text-xs text-orange-700">In progress</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-900">Total Value</CardTitle>
            <DollarSign className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">₹{(totalRevenue / 100000).toFixed(1)}L</div>
            <p className="text-xs text-purple-700">Project budgets</p>
          </CardContent>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search projects by name or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Add your first project to get started"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowAddProject(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Project
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
              <h3 className="text-lg font-semibold text-gray-900">All Projects</h3>
              <p className="text-sm text-gray-600">Comprehensive project management and tracking</p>
            </div>
            
            <div className="divide-y divide-gray-200">
              {filteredProjects.map((project) => (
                <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-semibold text-gray-900 truncate">{project.name}</h4>
                          {getProjectTypeBadge(project)}
                          {getStatusBadge(project.status)}
                        </div>
                        
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {project.description || "No description provided"}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <User className="h-4 w-4 flex-shrink-0" />
                            <span>Client: {getCustomerName(project.customerId || '')}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>Started: {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <DollarSign className="h-4 w-4 flex-shrink-0" />
                            <span>Budget: {project.budget ? `₹${parseFloat(project.budget).toLocaleString()}` : 'Not specified'}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span>Due: {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Link href="/survey-records">
                        <Button variant="outline" size="sm">
                          <BarChart3 className="h-3 w-3 mr-1" />
                          Survey Data
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}