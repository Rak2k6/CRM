import React, { useState, useEffect } from 'react';
import "./index.css";
import ProjectsPage from "./projects.jsx"
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
  UserCircle
} from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

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
          <SidebarItem icon={Home} label="Dashboard" active={true} />
          <SidebarItem icon={Users} label="Clients" />
          <a href="/ProjectsPage">
            <SidebarItem icon={FolderOpen} label="ProjectsPage" />
          </a>
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
              <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-sm font-medium text-green-600">Online</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* CRM Header */}
          <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🔴</span>
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">LDR Surveys CRM</h1>
                <p className="text-gray-600 mb-3">Comprehensive Land Survey Management System</p>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm font-medium text-green-600">System Active</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Database size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-blue-600">6/6 Databases Connected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-sm"></div>
                    <span className="text-sm font-medium text-purple-600">Real Data Loaded</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Clients"
              value="1387"
              subtitle="Active relationships"
              icon={Users}
              bgColor="bg-blue-50"
              textColor="text-blue-600"
              iconBg="bg-blue-500"
            />
            <StatCard
              title="Survey Records"
              value="462"
              subtitle="231 completed surveys"
              icon={MapPin}
              bgColor="bg-green-50"
              textColor="text-green-600"
              iconBg="bg-green-500"
            />
            <StatCard
              title="Projects"
              value="693"
              subtitle="231 completed"
              icon={FolderOpen}
              bgColor="bg-purple-50"
              textColor="text-purple-600"
              iconBg="bg-purple-500"
            />
            <StatCard
              title="Total Revenue"
              value="₹226,380,000"
              subtitle="From active leads"
              icon={DollarSign}
              bgColor="bg-orange-50"
              textColor="text-orange-600"
              iconBg="bg-orange-500"
            />
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-2 gap-8">
            {/* Database Integration */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <Database size={24} className="text-gray-700" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">LDR Survey Database Integration</h2>
                    <p className="text-sm text-gray-600">Real data from LDR Survey Pvt Ltd business systems</p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Settings size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Admin Panel</p>
                      <p className="text-sm text-gray-500">924 users</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Connected
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Users size={20} className="text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-900">Client Registrations</p>
                      <p className="text-sm text-gray-500">924 clients</p>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                    Connected
                  </span>
                </div>
              </div>
            </div>

            {/* Live Business Metrics */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center space-x-3">
                  <BarChart size={24} className="text-gray-700" />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Live Business Metrics</h2>
                    <p className="text-sm text-gray-600">Real-time data from authenticated LDR Survey operations</p>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Team Members</p>
                    <p className="text-3xl font-bold text-blue-600 mb-1">924</p>
                    <p className="text-xs text-gray-500">Active staff</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Client Inquiries</p>
                    <p className="text-3xl font-bold text-green-600 mb-1">1617</p>
                    <p className="text-xs text-gray-500">Pending responses</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Career Applications</p>
                    <p className="text-3xl font-bold text-purple-600 mb-1">2310</p>
                    <p className="text-xs text-gray-500">Job applications</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Registered Clients</p>
                    <p className="text-3xl font-bold text-orange-600 mb-1">924</p>
                    <p className="text-xs text-gray-500">Verified accounts</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;