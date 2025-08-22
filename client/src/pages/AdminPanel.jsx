import { Switch, Route } from "wouter";
import { AdminLayout } from "@/components/AdminLayout";
import { AdminHome } from "./admin/AdminHome";
import { AdminSearch } from "./admin/Search";
import { PlaceholderPage } from "./admin/PlaceholderPage";
import { AdminRoute } from "@/contexts/AuthContext";
import { UserManagement } from "./admin/UserManagement";
import { CustomerManagement } from "./admin/CustomerManagement";
import { ProjectManagement } from "./admin/ProjectManagement";
import { TaskManagement } from "./admin/TaskManagement";
import { LeadManagement } from "./admin/LeadManagement";

export function AdminPanel() {
  return (
    <AdminRoute>
      <AdminLayout>
        <Switch>
          {/* Home */}
          <Route path="/admin" component={AdminHome} />
          
          {/* Search */}
          <Route path="/admin/search" component={AdminSearch} />
          
          {/* Lead Routes */}
          <Route path="/admin/lead/ldr-form" component={LeadManagement} />
          <Route path="/admin/lead/lsit-form">
            <PlaceholderPage title="LSIT Form" description="LSIT lead management system" />
          </Route>
          
          {/* Accounting Routes */}
          <Route path="/admin/accounting/customer-form" component={CustomerManagement} />
          <Route path="/admin/accounting/vendor">
            <PlaceholderPage title="Vendor Management" description="Vendor and supplier management" />
          </Route>
          <Route path="/admin/accounting/banking">
            <PlaceholderPage title="Banking" description="Banking and financial transactions" />
          </Route>
          <Route path="/admin/accounting/receipt">
            <PlaceholderPage title="Receipt Management" description="Receipt tracking and management" />
          </Route>
          <Route path="/admin/accounting/expenses">
            <PlaceholderPage title="Expenses" description="Expense tracking and reporting" />
          </Route>
          <Route path="/admin/accounting/receipt-expenses-report">
            <PlaceholderPage title="Receipt & Expenses Report" description="Financial reporting dashboard" />
          </Route>
          <Route path="/admin/accounting/purchase">
            <PlaceholderPage title="Purchase Management" description="Purchase orders and procurement" />
          </Route>
          <Route path="/admin/accounting/amc">
            <PlaceholderPage title="AMC Management" description="Annual Maintenance Contract management" />
          </Route>
          <Route path="/admin/accounting/reports">
            <PlaceholderPage title="General Reports" description="Comprehensive accounting reports" />
          </Route>
          
          {/* Projects Routes */}
          <Route path="/admin/projects/project" component={ProjectManagement} />
          <Route path="/admin/projects/pipeline">
            <PlaceholderPage title="Pipeline Projects" description="Project pipeline and forecasting" />
          </Route>
          <Route path="/admin/projects/requested">
            <PlaceholderPage title="Requested Projects" description="New project requests and proposals" />
          </Route>
          
          {/* Forms Routes */}
          <Route path="/admin/forms/surveyor">
            <PlaceholderPage title="Surveyor Form" description="Surveyor registration and management" />
          </Route>
          <Route path="/admin/forms/student">
            <PlaceholderPage title="Student Form" description="Student registration and training programs" />
          </Route>
          
          {/* Relationships Routes */}
          <Route path="/admin/relationships/customers">
            <PlaceholderPage title="Customer Relationships" description="Customer relationship management" />
          </Route>
          <Route path="/admin/relationships/vendor">
            <PlaceholderPage title="Vendor Relationships" description="Vendor relationship management" />
          </Route>
          <Route path="/admin/relationships/banking">
            <PlaceholderPage title="Banking Relationships" description="Banking partner management" />
          </Route>
          <Route path="/admin/relationships/receipt">
            <PlaceholderPage title="Receipt Relationships" description="Receipt processing relationships" />
          </Route>
          <Route path="/admin/relationships/expenses">
            <PlaceholderPage title="Expense Relationships" description="Expense management relationships" />
          </Route>
          <Route path="/admin/relationships/receipt-expenses-report">
            <PlaceholderPage title="Receipt & Expenses Relationship Report" description="Financial relationship reporting" />
          </Route>
          <Route path="/admin/relationships/purchase">
            <PlaceholderPage title="Purchase Relationships" description="Purchase relationship management" />
          </Route>
          <Route path="/admin/relationships/amc">
            <PlaceholderPage title="AMC Relationships" description="AMC relationship management" />
          </Route>
          
          {/* Task Management */}
          <Route path="/admin/task" component={TaskManagement} />
          
          {/* Sales Routes */}
          <Route path="/admin/sales/ldr-bill-report">
            <PlaceholderPage title="LDR Bill Report" description="LDR billing and invoice reports" />
          </Route>
          <Route path="/admin/sales/student-bill-report">
            <PlaceholderPage title="Student Bill Report" description="Student billing and payment reports" />
          </Route>
          
          {/* Asset Management Routes */}
          <Route path="/admin/assets/instruments">
            <PlaceholderPage title="Instruments" description="Survey instrument management" />
          </Route>
          <Route path="/admin/assets/stock">
            <PlaceholderPage title="Stock Management" description="Inventory and stock tracking" />
          </Route>
          <Route path="/admin/assets/due-list">
            <PlaceholderPage title="Due List" description="Outstanding payments and dues" />
          </Route>
          
          {/* HRM Routes */}
          <Route path="/admin/hrm/payroll">
            <PlaceholderPage title="Payroll" description="Employee payroll management" />
          </Route>
          <Route path="/admin/hrm/employee">
            <PlaceholderPage title="Employee Management" description="Employee records and management" />
          </Route>
          <Route path="/admin/hrm/leave">
            <PlaceholderPage title="Leave Management" description="Employee leave tracking" />
          </Route>
          <Route path="/admin/hrm/timesheet">
            <PlaceholderPage title="Timesheet" description="Employee time tracking" />
          </Route>
          <Route path="/admin/hrm/complaints">
            <PlaceholderPage title="Complaints and Letters" description="HR complaints and correspondence" />
          </Route>
          
          {/* Other Routes */}
          <Route path="/admin/circulars">
            <PlaceholderPage title="Circulars" description="Company circulars and announcements" />
          </Route>
          <Route path="/admin/user-userlog">
            <PlaceholderPage title="User and Userlog" description="User activity logging and monitoring" />
          </Route>
          <Route path="/admin/users-management" component={UserManagement} />
          
          {/* Fallback */}
          <Route>
            <PlaceholderPage title="Page Not Found" description="The requested admin page could not be found" />
          </Route>
        </Switch>
      </AdminLayout>
    </AdminRoute>
  );
}