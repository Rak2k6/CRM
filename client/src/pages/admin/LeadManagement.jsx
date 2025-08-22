import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, TrendingUp, DollarSign, User } from "lucide-react";
import { useState } from "react";

export function LeadManagement() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: leads, isLoading } = useQuery({
    queryKey: ["/api/leads"]
  });

  const filteredLeads = leads?.filter(lead =>
    lead.customerId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.inquirySource?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStageColor = (stage) => {
    switch (stage) {
      case "qualified": return "bg-green-100 text-green-800";
      case "proposal": return "bg-blue-100 text-blue-800";
      case "negotiation": return "bg-yellow-100 text-yellow-800";
      case "closed-won": return "bg-emerald-100 text-emerald-800";
      case "closed-lost": return "bg-red-100 text-red-800";
      case "new": return "bg-purple-100 text-purple-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  // Calculate lead statistics
  const totalValue = leads?.reduce((sum, lead) => sum + (parseFloat(lead.value || "0") || 0), 0) || 0;
  const qualifiedLeads = leads?.filter(lead => lead.stage === "qualified").length || 0;
  const closedWonLeads = leads?.filter(lead => lead.stage === "closed-won").length || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Lead Management</h2>
          <p className="text-gray-600">Track and manage your sales pipeline</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700" data-testid="button-add-lead">
          <Plus className="w-4 h-4 mr-2" />
          New Lead
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Total Leads</p>
                <p className="text-2xl font-bold">{leads?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Qualified</p>
                <p className="text-2xl font-bold">{qualifiedLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Pipeline Value</p>
                <p className="text-2xl font-bold">₹{totalValue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <div className="ml-2">
                <p className="text-sm font-medium leading-none">Closed Won</p>
                <p className="text-2xl font-bold">{closedWonLeads}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search leads by customer name, title, or source..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button variant="outline" data-testid="button-filter">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Leads List */}
      <Card>
        <CardHeader>
          <CardTitle>Leads ({filteredLeads.length})</CardTitle>
          <CardDescription>
            All leads in your sales pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredLeads.length === 0 ? (
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No leads found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria" : "Start by adding your first lead"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  data-testid={`lead-${lead.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          Lead #{lead.id.slice(0, 8)}
                        </h3>
                        <Badge className={getStageColor(lead.stage)}>
                          {lead.stage}
                        </Badge>
                        {lead.urgency && (
                          <Badge className={getPriorityColor(lead.urgency)}>
                            {lead.urgency} urgency
                          </Badge>
                        )}
                      </div>
                      
                      {lead.notes && (
                        <p className="text-gray-600 mb-3">{lead.notes}</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        {lead.value && (
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4" />
                            <span>Value: ₹{parseFloat(lead.value).toLocaleString()}</span>
                          </div>
                        )}
                        
                        {lead.probability && (
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-4 h-4" />
                            <span>Probability: {lead.probability}%</span>
                          </div>
                        )}
                        
                        {lead.inquirySource && (
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>Source: {lead.inquirySource}</span>
                          </div>
                        )}
                      </div>

                      {lead.expectedCloseDate && (
                        <div className="mt-2 text-sm text-gray-600">
                          <strong>Expected Close:</strong> {new Date(lead.expectedCloseDate).toLocaleDateString()}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-edit-${lead.id}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        data-testid={`button-delete-${lead.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>


                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}