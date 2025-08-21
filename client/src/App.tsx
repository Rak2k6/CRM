import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Customers from "@/pages/customers";
import Projects from "@/pages/projects";
import Pipeline from "@/pages/pipeline";
import Communications from "@/pages/communications";
import Reports from "@/pages/reports";
import SurveyRecords from "@/pages/survey-records";
import { LoginPage } from "@/pages/LoginPage";
import { SignupPage } from "@/pages/SignupPage";
import { LoginOTP } from "@/pages/LoginOTP";
import { SignupOTP } from "@/pages/SignupOTP";
import { AdminPanel } from "@/pages/AdminPanel";
import { AuthProvider } from "@/contexts/AuthContext";
import { UserLayout } from "@/components/UserLayout";
import { UserDashboard } from "@/pages/user/UserDashboard";
import { ProfilePage } from "@/pages/user/ProfilePage";
import { UserCustomerForm } from "@/pages/user/UserCustomerForm";
import { AddCustomerForm } from "@/pages/user/AddCustomerForm";
import { AddLeadForm } from "@/pages/user/AddLeadForm";
import { TasksPage } from "@/pages/user/TasksPage";
import { ComplaintsPage } from "@/pages/user/ComplaintsPage";
import { RulesPage } from "@/pages/user/RulesPage";
import { LeaveHistory } from "@/pages/user/LeaveHistory";
import { HolidaysPage } from "@/pages/user/HolidaysPage";

function Router() {
  return (
    <Switch>
      {/* Authentication routes - no layout needed */}
      <Route path="/login" component={LoginPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login-otp" component={LoginOTP} />
      <Route path="/signup-otp" component={SignupOTP} />
      
      {/* Protected routes with layout */}
      <Route path="/admin" component={AdminPanel} />
      
      {/* User dashboard routes */}
      <Route path="/user/:rest*">
        <UserLayout>
          <Switch>
            <Route path="/user" component={UserDashboard} />
            <Route path="/user/profile" component={ProfilePage} />
            <Route path="/user/leads" component={AddLeadForm} />
            <Route path="/user/customer" component={AddCustomerForm} />
            <Route path="/user/tasks" component={TasksPage} />
            <Route path="/user/holidays" component={HolidaysPage} />
            <Route path="/user/leaves" component={LeaveHistory} />
            <Route path="/user/complaints" component={ComplaintsPage} />
            <Route path="/user/rules" component={RulesPage} />
            <Route component={NotFound} />
          </Switch>
        </UserLayout>
      </Route>
      
      <Route>
        {/* All other routes use the main layout */}
        <Layout>
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/customers" component={Customers} />
            <Route path="/projects" component={Projects} />
            <Route path="/survey-records" component={SurveyRecords} />
            <Route path="/pipeline" component={Pipeline} />
            <Route path="/communications" component={Communications} />
            <Route path="/reports" component={Reports} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
