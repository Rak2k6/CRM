import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Edit, Trash2, Mail, Phone, Calendar, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
// Removed type-only imports for JS compatibility
import PageHeader from "@/components/PageHeader";

export default function Communications() {
  const { toast } = useToast();
  const [isAddCommunicationOpen, setIsAddCommunicationOpen] = useState(false);
  
  const { data: communications = [], isLoading: communicationsLoading } = useQuery({
    queryKey: ["/api/communications"],
  });

  const { data: customers = [], isLoading: customersLoading } = useQuery({
    queryKey: ["/api/customers"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/communications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/communications"] });
      toast({
        title: "Communication deleted",
        description: "Communication has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete communication. Please try again.",
        variant: "destructive",
      });
    },
  });

  const isLoading = communicationsLoading || customersLoading;

  const getTypeIcon = (type) => {
    const icons = {
      email: Mail,
      phone: Phone,
      meeting: Calendar,
      note: FileText,
    };
    const Icon = icons[type] || FileText;
    return <Icon className="h-4 w-4" />;
  };

  const getTypeBadge = (type) => {
    const typeConfig = {
      email: { label: "Email", variant: "default" },
      phone: { label: "Phone", variant: "secondary" },
      meeting: { label: "Meeting", variant: "outline" },
      note: { label: "Note", variant: "secondary" },
    };
    const config = typeConfig[type] || typeConfig.note;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getDirectionBadge = (direction) => {
    const config = direction === "inbound" 
      ? { label: "Inbound", variant: "default" }
      : { label: "Outbound", variant: "secondary" };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getCustomerName = (customerId) => {
    if (!customerId) return "—";
    const customer = customers.find(c => c.id === customerId);
    return customer ? `${customer.firstName} ${customer.lastName}` : "Unknown Customer";
  };

  const getCustomerCompany = (customerId) => {
    if (!customerId) return "—";
    const customer = customers.find(c => c.id === customerId);
    return customer?.company || "—";
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleString();
  };

  const handleDelete = (communication) => {
    const customerName = getCustomerName(communication.customerId);
    if (window.confirm(`Are you sure you want to delete this communication with ${customerName}?`)) {
      deleteMutation.mutate(communication.id);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-slate-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-8">
      <PageHeader
        title="Communications"
        subtitle="Track emails, calls, meetings, and notes"
        action={(
          <Button onClick={() => setIsAddCommunicationOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Communication
          </Button>
        )}
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Total Communications</p>
                <p className="text-2xl font-bold text-slate-900">{communications.length}</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Emails</p>
                <p className="text-2xl font-bold text-slate-900">
                  {communications.filter(c => c.type === "email").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                <Mail className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Calls</p>
                <p className="text-2xl font-bold text-slate-900">
                  {communications.filter(c => c.type === "phone").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Phone className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600">Meetings</p>
                <p className="text-2xl font-bold text-slate-900">
                  {communications.filter(c => c.type === "meeting").length}
                </p>
              </div>
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>Communication Log</CardTitle>
        </CardHeader>
        <CardContent>
          {communications.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-500">No communications logged yet. Start tracking your customer interactions.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {communications
                    .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
                    .map((communication) => (
                    <TableRow key={communication.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(communication.type)}
                          {getTypeBadge(communication.type)}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-900">
                        {getCustomerName(communication.customerId)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-900">
                        {getCustomerCompany(communication.customerId)}
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="text-sm font-medium text-slate-900">
                            {communication.subject || "—"}
                          </div>
                          <div className="text-sm text-slate-500 truncate max-w-xs">
                            {communication.content}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getDirectionBadge(communication.direction)}
                      </TableCell>
                      <TableCell className="text-sm text-slate-500">
                        {formatDate(communication.createdAt)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(communication)}
                            disabled={deleteMutation.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Communication Modal */}
      <Dialog open={isAddCommunicationOpen} onOpenChange={setIsAddCommunicationOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Log Communication</DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <p className="text-slate-500">Communication form would be implemented here.</p>
            <div className="flex justify-end mt-4">
              <Button onClick={() => setIsAddCommunicationOpen(false)}>Close</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
