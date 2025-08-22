import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, FileText } from "lucide-react";

export function ComplaintsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    subject: "",
    category: "",
    priority: "",
    description: "",
    contactPreference: ""
  });

  const addComplaintMutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch("/api/user/add-complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to submit complaint");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Complaint submitted successfully. We'll get back to you soon."
      });
      setFormData({
        subject: "",
        category: "",
        priority: "",
        description: "",
        contactPreference: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit complaint",
        variant: "destructive"
      });
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.subject.trim() || !formData.description.trim()) {
      toast({
        title: "Validation Error",
        description: "Subject and description are required",
        variant: "destructive"
      });
      return;
    }

    addComplaintMutation.mutate(formData);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-700 dark:text-gray-200">
          Submit Complaint
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Let us know about any issues or concerns you have
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-teal-600" />
            <CardTitle>Complaint Details</CardTitle>
          </div>
          <CardDescription>
            Please provide details about your complaint
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject">
                Subject <span className="text-red-500">*</span>
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                placeholder="Brief description of the issue"
                required
                data-testid="input-subject"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger data-testid="select-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="service">Service Quality</SelectItem>
                    <SelectItem value="billing">Billing/Payment</SelectItem>
                    <SelectItem value="communication">Communication</SelectItem>
                    <SelectItem value="project-delay">Project Delay</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                  <SelectTrigger data-testid="select-priority">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">
                Detailed Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Please provide a detailed description of your complaint, including any relevant dates, names, or circumstances"
                rows={6}
                required
                data-testid="input-description"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPreference">Preferred Contact Method</Label>
              <Select value={formData.contactPreference} onValueChange={(value) => handleInputChange("contactPreference", value)}>
                <SelectTrigger data-testid="select-contact">
                  <SelectValue placeholder="How should we contact you?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="both">Email and Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> We take all complaints seriously and aim to respond within 24-48 hours. 
                For urgent issues, please contact us directly at +91 9840281288.
              </p>
            </div>

            <div className="flex justify-end pt-4">
              <Button 
                type="submit" 
                disabled={addComplaintMutation.isPending}
                className="bg-teal-600 hover:bg-teal-700"
                data-testid="button-submit"
              >
                {addComplaintMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Submit Complaint
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