import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import LeadForm from "@/components/lead-form";
import type { Lead, Customer } from "@shared/schema";
import PageHeader from "@/components/PageHeader";

export default function Pipeline() {
  const { toast } = useToast();
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  
  const { data: leads = [], isLoading: leadsLoading } = useQuery<Lead[]>({
    queryKey: ["/api/leads"],
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/leads/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leads"] });
      toast({
        title: "Lead deleted",
        description: "Lead has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete lead. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = leadsLoading || customersLoading;

  const getStageInfo = (stage: string) => {
    const stageConfig = {
      prospecting: { label: "Prospecting", variant: "secondary" as const, color: "bg-blue-500" },
      qualified: { label: "Qualified", variant: "default" as const, color: "bg-amber-500" },
      proposal: { label: "Proposal", variant: "outline" as const, color: "bg-emerald-500" },
      negotiation: { label: "Negotiation", variant: "destructive" as const, color: "bg-green-600" },
      closed_won: { label: "Closed Won", variant: "default" as const, color: "bg-green-700" },
      closed_lost: { label: "Closed Lost", variant: "secondary" as const, color: "bg-red-500" },
    };
    return stageConfig[stage as keyof typeof stageConfig] || stageConfig.prospecting;
  };

  const getCustomerName = (customerId: string | null) => {
    if (!customerId) return "—";
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer";
  };

  const getCustomerCompany = (customerId: string | null) => {
    if (!customerId) return "—";
    const customer = customers.find(c => c.id === customerId);
    return customer?.company || "—";
  };

  const formatCurrency = (amount: string | null) => {
    if (!amount) return "—";
    return `$${parseFloat(amount).toLocaleString()}`;
  };

  const formatDate = (date: Date | string | null) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  const handleDelete = (lead: Lead) => {
    const customerName = getCustomerName(lead.customerId);
    if (window.confirm(`Are you sure you want to delete the lead for ${customerName}?`)) {
      deleteMutation.mutate(lead.id);
    }
  };

  // Pipeline overview
  const leadsByStage = leads.reduce((acc, lead) => {
    acc[lead.stage] = (acc[lead.stage] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = leads
    .filter(l => l.value && !["closed_won", "closed_lost"].includes(l.stage))
    .reduce((sum, l) => sum + parseFloat(l.value || "0"), 0);

  const pipelineStages = [
    { name: "Prospecting", value: leadsByStage.prospecting || 0, stage: "prospecting" },
    { name: "Qualified", value: leadsByStage.qualified || 0, stage: "qualified" },
    { name: "Proposal", value: leadsByStage.proposal || 0, stage: "proposal" },
    { name: "Negotiation", value: leadsByStage.negotiation || 0, stage: "negotiation" },
  ];

  const maxLeads = Math.max(...pipelineStages.map(s => s.value), 1);

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, i) => (
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
    <div className="space-y-6 p-8">
      <PageHeader
        title="Sales Pipeline"
        subtitle="Track and manage your leads through each stage"
      />

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Pipeline Value</p>
                <p className="text-3xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Active Leads</p>
                <p className="text-3xl font-bold text-slate-900">
                  {leads.filter(l => !["closed_won", "closed_lost"].includes(l.stage)).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🎯</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Conversion Rate</p>
                <p className="text-3xl font-bold text-slate-900">
                  {leads.length > 0 
                    ? Math.round((leadsByStage.closed_won || 0) / leads.length * 100) 
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📈</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Pipeline Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {pipelineStages.every(stage => stage.value === 0) ? (
            <p className="text-slate-500 text-center py-8">No leads in pipeline</p>
          ) : (
            <div className="space-y-4">
              {pipelineStages.map((stage) => (
                <div key={stage.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-600">{stage.name}</span>
                    <span className="text-sm font-bold text-slate-900">{stage.value} leads</span>
                  </div>
                  <Progress 
                    value={(stage.value / maxLeads) * 100} 
                    className="h-3" 
                  />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leads Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>All Leads</CardTitle>
          <Button onClick={() => setIsAddLeadOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </CardHeader>
        <CardContent>
          {leads.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No leads yet. Add your first lead to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Stage</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>Probability</TableHead>
                    <TableHead>Expected Close</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leads.map((lead) => {
                    const stageInfo = getStageInfo(lead.stage);
                    return (
                      <TableRow key={lead.id}>
                        <TableCell className="text-sm text-slate-900">
                          {getCustomerName(lead.customerId)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-900">
                          {getCustomerCompany(lead.customerId)}
                        </TableCell>
                        <TableCell>
                          <Badge variant={stageInfo.variant}>{stageInfo.label}</Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-900">
                          {formatCurrency(lead.value)}
                        </TableCell>
                        <TableCell className="text-sm text-slate-900">
                          {lead.probability !== null ? `${lead.probability}%` : "—"}
                        </TableCell>
                        <TableCell className="text-sm text-slate-500">
                          {formatDate(lead.expectedCloseDate)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setEditingLead(lead)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(lead)}
                              disabled={deleteMutation.isPending}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Lead Modal */}
      <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Lead</DialogTitle>
          </DialogHeader>
          <LeadForm onSuccess={() => setIsAddLeadOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Lead Modal */}
      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {editingLead && (
            <LeadForm
              lead={editingLead}
              onSuccess={() => setEditingLead(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
