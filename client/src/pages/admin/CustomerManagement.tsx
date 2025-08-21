import React, { useState, useMemo, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Edit, Trash2, Phone, Mail, Building, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import type { Customer } from "@shared/schema";

// Sub-components for better organization
const CustomerCard: React.FC<{
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}> = React.memo(({ customer, onEdit, onDelete }) => {
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "potential": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  }, []);

  return (
    <div
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
      data-testid={`customer-${customer.id}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              {customer.firstName} {customer.lastName}
            </h3>
            <Badge className={getStatusColor(customer.status)}>
              {customer.status}
            </Badge>
          </div>
          
          <div className="mt-2 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            {customer.email && (
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{customer.email}</span>
              </div>
            )}
            
            {customer.phone && (
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{customer.phone}</span>
              </div>
            )}
            
            {customer.company && (
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>{customer.company}</span>
              </div>
            )}
          </div>

          {customer.address && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Address:</strong> {customer.address}
            </div>
          )}

          {customer.leadSource && (
            <div className="mt-2 text-sm text-gray-600">
              <strong>Lead Source:</strong> {customer.leadSource}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(customer)}
            aria-label={`Edit ${customer.firstName} ${customer.lastName}`}
            data-testid={`button-edit-${customer.id}`}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-red-600 hover:text-red-700"
            onClick={() => onDelete(customer)}
            aria-label={`Delete ${customer.firstName} ${customer.lastName}`}
            data-testid={`button-delete-${customer.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {customer.notes && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <strong>Notes:</strong> {customer.notes}
          </p>
        </div>
      )}
    </div>
  );
});

CustomerCard.displayName = 'CustomerCard';

const LoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <Card key={i}>
        <CardContent className="pt-6">
          <Skeleton className="h-4 w-1/3 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const ErrorAlert: React.FC<{ error: Error; onRetry: () => void }> = ({ error, onRetry }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Failed to load customers: {error.message}. 
      <Button variant="outline" size="sm" onClick={onRetry} className="ml-2">
        Retry
      </Button>
    </AlertDescription>
  </Alert>
);

export const CustomerManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const queryClient = useQueryClient();

  const { data: customers, isLoading, error, refetch } = useQuery<Customer[], Error>({
    queryKey: ["/api/customers"],
    queryFn: async () => {
      const response = await fetch("/api/customers");
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const deleteMutation = useMutation({
    mutationFn: async (customerId: string) => {
      const response = await fetch(`/api/customers/${customerId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete customer');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
    },
  });

  const filteredCustomers = useMemo(() => {
    if (!customers) return [];
    
    return customers.filter(customer =>
      `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.company?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  const handleEdit = useCallback((customer: Customer) => {
    setEditingCustomer(customer);
    setShowAddModal(true);
  }, []);

  const handleDelete = useCallback((customer: Customer) => {
    if (window.confirm(`Are you sure you want to delete ${customer.firstName} ${customer.lastName}?`)) {
      deleteMutation.mutate(customer.id);
    }
  }, [deleteMutation]);

  const handleCloseModal = useCallback(() => {
    setShowAddModal(false);
    setEditingCustomer(null);
  }, []);

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <ErrorAlert error={error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
          <p className="text-gray-600">Manage your customer database and relationships</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700" 
          onClick={() => setShowAddModal(true)}
          data-testid="button-add-customer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers by name, email, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
                aria-label="Search customers"
              />
            </div>
            <Button variant="outline" data-testid="button-filter">
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <Card>
        <CardHeader>
          <CardTitle>Customers ({filteredCustomers.length})</CardTitle>
          <CardDescription>
            All registered customers in your system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredCustomers.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search criteria" : "Start by adding your first customer"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredCustomers.map((customer) => (
                <CustomerCard
                  key={customer.id}
                  customer={customer}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal - Placeholder for now */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>
                {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Customer form would go here...</p>
              <div className="mt-4 flex justify-end space-x-2">
                <Button variant="outline" onClick={handleCloseModal}>
                  Cancel
                </Button>
                <Button>
                  {editingCustomer ? 'Update' : 'Add'} Customer
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

// Default export for compatibility
export default CustomerManagement;
