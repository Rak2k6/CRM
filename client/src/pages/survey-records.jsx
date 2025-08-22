import { useState } from "react";
import { Plus, Search, MapPin, Calendar, FileText, Eye, Edit, Trash2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SurveyRecord, InsertSurveyRecord, Customer, Project } from "@shared/schema";
import PageHeader from "@/components/PageHeader";

export default function SurveyRecordsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<SurveyRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const queryClient = useQueryClient();

  // Fetch survey records
  const { data: records = [], isLoading } = useQuery<SurveyRecord[]>({
    queryKey: ["/api/survey-records"],
  });

  // Fetch customers for dropdown
  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // Fetch projects for dropdown
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  // Create record mutation
  const createRecordMutation = useMutation({
    mutationFn: (data: InsertSurveyRecord) => apiRequest("/api/survey-records", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/survey-records"] });
      setIsCreateDialogOpen(false);
      toast({
        title: "Success",
        description: "Survey record created successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create survey record. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Filter records based on search
  const filteredRecords = records.filter(record =>
    record.surveyType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.village?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.surveyNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.plotNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRecord = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const recordData: InsertSurveyRecord = {
      projectId: formData.get("projectId") as string || null,
      customerId: formData.get("customerId") as string || null,
      surveyType: formData.get("surveyType") as string,
      surveyNumber: formData.get("surveyNumber") as string || null,
      plotNumber: formData.get("plotNumber") as string || null,
      area: formData.get("area") as string || null,
      location: formData.get("location") as string || null,
      village: formData.get("village") as string || null,
      district: formData.get("district") as string || null,
      state: formData.get("state") as string || "Tamil Nadu",
      notes: formData.get("notes") as string || null,
      status: formData.get("status") as string || "in_progress",
      surveyDate: formData.get("surveyDate") ? new Date(formData.get("surveyDate") as string) : null,
      surveyorName: formData.get("surveyorName") as string || null,
      equipmentUsed: formData.get("equipmentUsed") as string || null,
      accuracy: formData.get("accuracy") as string || null,
    };

    createRecordMutation.mutate(recordData);
  };

  const getStatusColor = (status: string | null) => {
    switch (status) {
      case "completed": return "default";
      case "in_progress": return "secondary";
      case "pending": return "outline";
      default: return "outline";
    }
  };

  const getSurveyTypeColor = (type: string | null) => {
    switch (type) {
      case "Land Survey": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "Topographical Survey": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "FMB Sketch": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "Building Plans": return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "Layout Survey": return "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200";
      case "Interior Survey": return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
      default: return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-8">
      <PageHeader
        title="Survey Records"
        subtitle="Manage and track survey records from LDR Survey operations"
        action={(
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Survey Record
          </Button>
        )}
      />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{records.length}</div>
            <p className="text-xs text-muted-foreground">
              Survey records tracked
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.filter(r => r.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Surveys completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {records.filter(r => r.status === "in_progress").length}
            </div>
            <p className="text-xs text-muted-foreground">
              Active surveys
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Districts Covered</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(records.map(r => r.district).filter(Boolean)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Areas serviced
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <CardTitle>Search Survey Records</CardTitle>
          <CardDescription>
            Find records by survey type, location, village, or survey number
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search records..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Survey Records Table */}
      <Card>
        <CardHeader>
          <CardTitle>Survey Records</CardTitle>
          <CardDescription>
            Complete listing of LDR Survey records and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Survey Number</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Plot/Area</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Surveyor</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">
                    {record.surveyNumber || "N/A"}
                  </TableCell>
                  <TableCell>
                    <Badge className={getSurveyTypeColor(record.surveyType)}>
                      {record.surveyType || "General"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{record.village || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.district}, {record.state}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div>{record.plotNumber || "N/A"}</div>
                      <div className="text-sm text-muted-foreground">
                        {record.area || "N/A"}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(record.status)}>
                      {record.status?.replace("_", " ") || "Unknown"}
                    </Badge>
                  </TableCell>
                  <TableCell>{record.surveyorName || "N/A"}</TableCell>
                  <TableCell>
                    {record.surveyDate 
                      ? new Date(record.surveyDate).toLocaleDateString()
                      : "N/A"
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedRecord(record);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Record Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Survey Record</DialogTitle>
            <DialogDescription>
              Add a new survey record to the LDR Survey database.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateRecord}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="surveyType">Survey Type *</Label>
                  <Select name="surveyType" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select survey type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Land Survey">Land Survey</SelectItem>
                      <SelectItem value="Topographical Survey">Topographical Survey</SelectItem>
                      <SelectItem value="FMB Sketch">FMB Sketch</SelectItem>
                      <SelectItem value="Building Plans">Building Plans</SelectItem>
                      <SelectItem value="Layout Survey">Layout Survey</SelectItem>
                      <SelectItem value="Interior Survey">Interior Survey</SelectItem>
                      <SelectItem value="Property Survey">Property Survey</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select name="status" defaultValue="in_progress">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="surveyNumber">Survey Number</Label>
                  <Input id="surveyNumber" name="surveyNumber" placeholder="LDR-2024-001" />
                </div>
                <div>
                  <Label htmlFor="plotNumber">Plot Number</Label>
                  <Input id="plotNumber" name="plotNumber" placeholder="Plot-123" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="area">Area</Label>
                  <Input id="area" name="area" placeholder="2.5 acres" />
                </div>
                <div>
                  <Label htmlFor="accuracy">Accuracy</Label>
                  <Input id="accuracy" name="accuracy" placeholder="±2cm" />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" name="location" placeholder="Velachery, Chennai" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="village">Village</Label>
                  <Input id="village" name="village" placeholder="Velachery" />
                </div>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Input id="district" name="district" placeholder="Chennai" />
                </div>
                <div>
                  <Label htmlFor="state">State</Label>
                  <Input id="state" name="state" defaultValue="Tamil Nadu" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="surveyorName">Surveyor Name</Label>
                  <Input id="surveyorName" name="surveyorName" placeholder="Gangeyan R" />
                </div>
                <div>
                  <Label htmlFor="surveyDate">Survey Date</Label>
                  <Input id="surveyDate" name="surveyDate" type="date" />
                </div>
              </div>

              <div>
                <Label htmlFor="equipmentUsed">Equipment Used</Label>
                <Input id="equipmentUsed" name="equipmentUsed" placeholder="Total Station, GPS, Theodolite" />
              </div>

              <div>
                <Label htmlFor="notes">Notes</Label>
                <Textarea 
                  id="notes" 
                  name="notes" 
                  placeholder="Additional survey notes and observations..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRecordMutation.isPending}>
                {createRecordMutation.isPending ? "Creating..." : "Create Record"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Record Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Survey Record Details</DialogTitle>
            <DialogDescription>
              Complete details for survey record {selectedRecord?.surveyNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedRecord && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Survey Type</Label>
                    <Badge className={getSurveyTypeColor(selectedRecord.surveyType)}>
                      {selectedRecord.surveyType || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Survey Number</Label>
                    <p className="text-sm">{selectedRecord.surveyNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Plot Number</Label>
                    <p className="text-sm">{selectedRecord.plotNumber || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Area</Label>
                    <p className="text-sm">{selectedRecord.area || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Status</Label>
                    <Badge variant={getStatusColor(selectedRecord.status)}>
                      {selectedRecord.status?.replace("_", " ") || "Unknown"}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Location</Label>
                    <p className="text-sm">{selectedRecord.location || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Village</Label>
                    <p className="text-sm">{selectedRecord.village || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">District</Label>
                    <p className="text-sm">{selectedRecord.district || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">State</Label>
                    <p className="text-sm">{selectedRecord.state || "N/A"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Survey Date</Label>
                    <p className="text-sm">
                      {selectedRecord.surveyDate 
                        ? new Date(selectedRecord.surveyDate).toLocaleDateString()
                        : "N/A"
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-sm font-medium">Surveyor</Label>
                  <p className="text-sm">{selectedRecord.surveyorName || "N/A"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Accuracy</Label>
                  <p className="text-sm">{selectedRecord.accuracy || "N/A"}</p>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Equipment Used</Label>
                <p className="text-sm">{selectedRecord.equipmentUsed || "N/A"}</p>
              </div>

              {selectedRecord.notes && (
                <div>
                  <Label className="text-sm font-medium">Notes</Label>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedRecord.notes}</p>
                </div>
              )}

              {selectedRecord.coordinates && (
                <div>
                  <Label className="text-sm font-medium">Coordinates</Label>
                  <pre className="text-sm bg-muted p-3 rounded-md overflow-x-auto">
                    {JSON.stringify(selectedRecord.coordinates, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}