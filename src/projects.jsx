import React, { useState, useEffect } from 'react';
import { 
  Users, 
  MapPin, 
  FolderOpen, 
  DollarSign, 
  Database, 
  BarChart, 
  Settings, 
  Plus,
  Home,
  FileText,
  Shield,
  ChevronLeft,
  UserCircle,
  Search,
  Clock,
  TrendingUp,
  Edit3
} from 'lucide-react';

const ProjectsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const StatCard = ({ title, value, subtitle, icon: Icon, bgColor, textColor, iconBg }) => (
    <div className={`${bgColor} rounded-xl p-6 relative overflow-hidden hover:shadow-lg transition-all duration-300`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>
          <p className={`${textColor} text-3xl font-bold mb-1`}>{value}</p>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
        <div className={`${iconBg} p-3 rounded-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        
      </div>
    </div>
  );

  const SidebarItem = ({ icon: Icon, label, active = false }) => (
    <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg cursor-pointer transition-colors ${
      active ? 'bg-green-50 text-green-600' : 'text-gray-600 hover:bg-gray-50'
    }`}>
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );

  const ProjectCard = ({ title, description, status, type, location, client, date, amount }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
            <FolderOpen size={24} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-1">{title}</h3>
            <p className="text-gray-600 text-sm mb-3">{description}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>📍 {location}</span>
              <span>👤 {client}</span>
              <span>📅 {date}</span>
              <span>💰 {amount}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            type === 'Land Survey' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {type}
          </span>
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
            status === 'In Progress' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
          }`}>
            {status}
          </span>
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            <BarChart size={16} />
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Survey Data
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
            Edit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-white shadow-sm">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">🔴</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900">LDR Surveys</h1>
              <p className="text-xs text-gray-500">Pvt Ltd</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-4 py-6 space-y-1">
          <SidebarItem icon={Home} label="Dashboard" />
          <SidebarItem icon={Users} label="Clients" />
          <SidebarItem icon={FolderOpen} label="Projects" active={true} />
          <SidebarItem icon={FileText} label="Survey Records" />
          <SidebarItem icon={Shield} label="Admin Panel" />
        </div>

        {/* Add Project Button */}
        <div className="px-4 mb-6">
          <button className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
            <Plus size={18} />
            <span>Add Project</span>
          </button>
        </div>

        {/* User Profile */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <UserCircle size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-800">admin</p>
              <p className="text-xs text-gray-500">admin</p>
            </div>
            <ChevronLeft size={16} className="text-gray-400 ml-auto transform rotate-180" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <div className="bg-white shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ChevronLeft size={20} className="text-gray-400" />
              <h1 className="text-2xl font-semibold text-gray-900">Projects</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Project Management Header */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">🔴</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">Project Management</h1>
                  <p className="text-gray-600">Track and manage all survey and development projects</p>
                </div>
              </div>
              <button className="bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg flex items-center space-x-2 transition-colors">
                <Plus size={18} />
                <span>Add Project</span>
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Projects"
              value="693"
              subtitle="All projects"
              icon={FolderOpen}
              bgColor="bg-blue-50"
              textColor="text-blue-600"
              iconBg="bg-blue-500"
            />
            <StatCard
              title="Completed"
              value="231"
              subtitle="Finished projects"
              icon={TrendingUp}
              bgColor="bg-green-50"
              textColor="text-green-600"
              iconBg="bg-green-500"
            />
            <StatCard
              title="Active Projects"
              value="231"
              subtitle="In progress"
              icon={Clock}
              bgColor="bg-orange-50"
              textColor="text-orange-600"
              iconBg="bg-orange-500"
            />
            <StatCard
              title="Total Value"
              value="₹2425.5L"
              subtitle="Project budgets"
              icon={DollarSign}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
              iconBg="bg-purple-500"
            />
          </div>

          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* All Projects Section */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-1">All Projects</h2>
              <p className="text-sm text-gray-600">Comprehensive project management and tracking</p>
            </div>
            
            <div className="p-6">
              <ProjectCard
                title="Chennai Residential Complex Survey"
                description="Complete land survey and boundary demarcation for 50-unit residential complex"
                status="In Progress"
                type="Land Survey"
                location="Chennai, Tamil Nadu"
                client="Shri Constructions Pvt. Ltd."
                date="Started: 2024-01-15"
                amount="₹8,50,000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;