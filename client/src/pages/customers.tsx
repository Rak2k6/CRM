import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Phone, Mail, Building2, User, Search, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import CustomerForm from "@/components/customer-form";
import type { Customer } from "@shared/schema";

export default function Customers() {
  const { toast } = useToast();
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddCustomer, setShowAddCustomer] = useState(false);
  
  const { data: customers = [], isLoading } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/customers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "Customer deleted",
        description: "Customer has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete customer. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer =>
    `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getPriorityBadge = (customer: Customer) => {
    // Determine priority based on customer data
    const company = customer.company?.toLowerCase();
    
    if (company?.includes('consulting') || company?.includes('developers') || customer.leadSource === 'referral') {
      return <Badge className="bg-red-100 text-red-700 border-red-200">High</Badge>;
    } else if (company?.includes('solutions') || company?.includes('planning') || customer.status === 'active') {
      return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
    } else if (customer.status === 'prospect') {
      return <Badge className="bg-purple-100 text-purple-700 border-purple-200">VIP</Badge>;
    }
    
    return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Medium</Badge>;
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-slate-200 rounded"></div>
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
            <h2 className="text-2xl font-bold tracking-tight text-gray-900">Client Management</h2>
            <p className="text-gray-600">Manage your survey clients and relationships</p>
          </div>
        </div>
        <Button onClick={() => setShowAddCustomer(true)} className="bg-green-600 hover:bg-green-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Client
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search clients by name, company, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      {/* Client Cards Grid */}
      {filteredCustomers.length === 0 ? (
        <div className="text-center py-12">
          <User className="h-12 w-12 mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No clients found</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm ? "Try adjusting your search terms" : "Add your first client to get started"}
          </p>
          {!searchTerm && (
            <Button onClick={() => setShowAddCustomer(true)} className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              Add Client
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="cursor-pointer hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {getInitials(customer.firstName, customer.lastName)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      {customer.company && (
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Building2 className="h-3 w-3" />
                          {customer.company}
                        </div>
                      )}
                    </div>
                  </div>
                  {getPriorityBadge(customer)}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    {customer.phone || "No phone"}
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    {customer.email}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Projects</p>
                      <p className="text-lg font-semibold">0</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Revenue</p>
                      <p className="text-lg font-semibold text-green-600">₹0</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => setEditingCustomer(customer)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700"
                    onClick={() => {
                      if (window.confirm(`Delete ${customer.firstName} ${customer.lastName}?`)) {
                        deleteMutation.mutate(customer.id);
                      }
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Customer Dialog */}
      <Dialog open={showAddCustomer} onOpenChange={setShowAddCustomer}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Client</DialogTitle>
          </DialogHeader>
          <CustomerForm
            onSuccess={() => {
              setShowAddCustomer(false);
              toast({
                title: "Client added",
                description: "New client has been successfully added.",
              });
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Customer Dialog */}
      <Dialog open={!!editingCustomer} onOpenChange={() => setEditingCustomer(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>
          {editingCustomer && (
            <CustomerForm
              customer={editingCustomer}
              onSuccess={() => {
                setEditingCustomer(null);
                toast({
                  title: "Client updated",
                  description: "Client has been successfully updated.",
                });
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}