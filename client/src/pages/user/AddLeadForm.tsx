import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, UserPlus } from "lucide-react";

export function AddLeadForm() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    company: "",
    serviceType: "",
    stage: "new",
    value: "",
    probability: "",
    expectedCloseDate: "",
    description: "",
    notes: ""
  });

  const addLeadMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await fetch("/api/user/add-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to add lead");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Lead added successfully"
      });
      // Reset form
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        company: "",
        serviceType: "",
        stage: "new",
        value: "",
        probability: "",
        expectedCloseDate: "",
        description: "",
        notes: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add lead",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.customerName.trim() || !formData.serviceType.trim()) {
      toast({
        title: "Validation Error",
        description: "Customer name and service type are required fields",
        variant: "destructive"
      });
      return;
    }

    addLeadMutation.mutate(formData);
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
          Add New Lead
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Add potential customer lead to the system
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <UserPlus className="h-5 w-5 text-teal-600" />
            <CardTitle>Lead Information</CardTitle>
          </div>
          <CardDescription>
            Enter lead details below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">
                  Customer Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange("customerName", e.target.value)}
                  placeholder="Enter customer name"
                  required
                  data-testid="input-customer-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Company name"
                  data-testid="input-company"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="customer@example.com"
                  data-testid="input-email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="+91 9876543210"
                  data-testid="input-phone"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceType">
                  Service Type <span className="text-red-500">*</span>
                </Label>
                <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                  <SelectTrigger data-testid="select-service-type">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Land Survey">Land Survey</SelectItem>
                    <SelectItem value="Topographical Survey">Topographical Survey</SelectItem>
                    <SelectItem value="Property Survey">Property Survey</SelectItem>
                    <SelectItem value="Layout Survey">Layout Survey</SelectItem>
                    <SelectItem value="Building Plans">Building Plans</SelectItem>
                    <SelectItem value="FMB Sketch">FMB Sketch</SelectItem>
                    <SelectItem value="Interior Survey">Interior Survey</SelectItem>
                    <SelectItem value="Real Estate Services">Real Estate Services</SelectItem>
                    <SelectItem value="Digital Land Services">Digital Land Services</SelectItem>
                    <SelectItem value="Web Development">Web Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="stage">Lead Stage</Label>
                <Select value={formData.stage} onValueChange={(value) => handleInputChange("stage", value)}>
                  <SelectTrigger data-testid="select-stage">
                    <SelectValue placeholder="Select stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="new">New Lead</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="qualified">Qualified</SelectItem>
                    <SelectItem value="proposal">Proposal Sent</SelectItem>
                    <SelectItem value="negotiation">In Negotiation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Estimated Value (₹)</Label>
                <Input
                  id="value"
                  type="number"
                  value={formData.value}
                  onChange={(e) => handleInputChange("value", e.target.value)}
                  placeholder="50000"
                  data-testid="input-value"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="probability">Probability (%)</Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.probability}
                  onChange={(e) => handleInputChange("probability", e.target.value)}
                  placeholder="50"
                  data-testid="input-probability"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expectedCloseDate">Expected Close Date</Label>
                <Input
                  id="expectedCloseDate"
                  type="date"
                  value={formData.expectedCloseDate}
                  onChange={(e) => handleInputChange("expectedCloseDate", e.target.value)}
                  data-testid="input-close-date"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Brief description of the opportunity"
                rows={3}
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Any additional notes about this lead"
                rows={4}
                data-testid="input-notes"
              />
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={addLeadMutation.isPending}
                className="bg-teal-600 hover:bg-teal-700"
                data-testid="button-save"
              >
                {addLeadMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Adding Lead...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Add Lead
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}