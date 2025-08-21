import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Users, FolderOpen, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AdminSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("all");

  const searchResults = [
    {
      type: "user",
      title: "John Doe",
      description: "Senior Surveyor - Active",
      icon: Users,
      id: "user-1"
    },
    {
      type: "project",
      title: "Land Survey - Chennai Project",
      description: "Active project - Due: 2024-02-15",
      icon: FolderOpen,
      id: "project-1"
    },
    {
      type: "document",
      title: "Survey Report - Site 001",
      description: "Generated on 2024-01-10",
      icon: FileText,
      id: "doc-1"
    }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Global Search</h2>
        <p className="text-gray-600">Search across all system data</p>
      </div>

      {/* Search Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="w-5 h-5 mr-2" />
            Search System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Enter search query..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={searchType} onValueChange={setSearchType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Search in..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="projects">Projects</SelectItem>
                <SelectItem value="documents">Documents</SelectItem>
                <SelectItem value="customers">Customers</SelectItem>
              </SelectContent>
            </Select>
            <Button>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Results */}
      <Card>
        <CardHeader>
          <CardTitle>Search Results</CardTitle>
          <p className="text-sm text-gray-600">Found {searchResults.length} results</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {searchResults.map((result) => {
              const Icon = result.icon;
              return (
                <div
                  key={result.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{result.title}</h3>
                    <p className="text-sm text-gray-600">{result.description}</p>
                  </div>
                  <div className="text-xs text-gray-500 capitalize">
                    {result.type}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}