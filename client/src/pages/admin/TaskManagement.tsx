import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, User, Clock, AlertCircle } from "lucide-react";

export function TaskManagement() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    assignee: "",
    priority: "",
    dueDate: "",
    category: ""
  });

  // Mock data for demonstration
  const tasks = [
    {
      id: "1",
      title: "Complete survey documentation for Project Alpha",
      description: "Finalize all documentation and submit to client",
      assignee: "John Doe",
      priority: "high",
      dueDate: "2024-12-25",
      status: "in-progress",
      category: "documentation"
    },
    {
      id: "2", 
      title: "Review client requirements for Beta project",
      description: "Analyze and validate client specifications",
      assignee: "Jane Smith",
      priority: "medium",
      dueDate: "2024-12-30",
      status: "pending",
      category: "review"
    },
    {
      id: "3",
      title: "Equipment calibration check",
      description: "Quarterly calibration of surveying instruments",
      assignee: "Mike Johnson",
      priority: "low",
      dueDate: "2025-01-05",
      status: "completed",
      category: "maintenance"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Task created:", formData);
    setShowAddForm(false);
    setFormData({
      title: "",
      description: "",
      assignee: "",
      priority: "",
      dueDate: "",
      category: ""
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Task Management</h2>
          <p className="text-gray-600">Assign and track team tasks and deadlines</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700" 
          data-testid="button-add-task"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
            <CardDescription>Assign a new task to team members</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter task title"
                    required
                    data-testid="input-title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assignee">Assignee</Label>
                  <Select value={formData.assignee} onValueChange={(value) => handleInputChange("assignee", value)}>
                    <SelectTrigger data-testid="select-assignee">
                      <SelectValue placeholder="Select assignee" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="mike-johnson">Mike Johnson</SelectItem>
                      <SelectItem value="sarah-wilson">Sarah Wilson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the task details"
                  rows={3}
                  data-testid="input-description"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                    <SelectTrigger data-testid="select-priority">
                      <SelectValue placeholder="Set priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger data-testid="select-category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survey">Survey Work</SelectItem>
                      <SelectItem value="documentation">Documentation</SelectItem>
                      <SelectItem value="review">Review</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="planning">Planning</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                    data-testid="input-due-date"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddForm(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" data-testid="button-create">
                  Create Task
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Tasks List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Tasks ({tasks.length})</CardTitle>
          <CardDescription>
            Current tasks assigned to team members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                data-testid={`task-${task.id}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {task.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 mb-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority} priority
                      </Badge>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                      <Badge variant="outline">
                        {task.category}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3">{task.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4" />
                        <span>Assigned to: {task.assignee}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" data-testid={`button-edit-${task.id}`}>
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-600 hover:text-red-700"
                      data-testid={`button-delete-${task.id}`}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}