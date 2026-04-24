import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import Landing from "@/pages/Landing";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import FileComplaint from "@/pages/citizen/FileComplaint";
import TrackStatus from "@/pages/citizen/TrackStatus";
import ComplaintHistory from "@/pages/citizen/ComplaintHistory";
import CitizenProfile from "@/pages/citizen/CitizenProfile";
import OfficerDashboard from "@/pages/officer/OfficerDashboard";
import OfficerComplaints from "@/pages/officer/OfficerComplaints";
import OfficerSLA from "@/pages/officer/OfficerSLA";
import OfficerPerformance from "@/pages/officer/OfficerPerformance";
import OfficerProfile from "@/pages/officer/OfficerProfile";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminOfficers from "@/pages/admin/AdminOfficers";
import AdminDepartments from "@/pages/admin/AdminDepartments";
import AdminSLA from "@/pages/admin/AdminSLA";
import AdminAudit from "@/pages/admin/AdminAudit";
import AdminSettings from "@/pages/admin/AdminSettings";
import DepartmentPage from "@/pages/DepartmentPage";

import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />

      <Route path="/citizen" component={CitizenDashboard} />
      <Route path="/citizen/complaint/new" component={FileComplaint} />
      <Route path="/citizen/track" component={TrackStatus} />
      <Route path="/citizen/history" component={ComplaintHistory} />
      <Route path="/citizen/profile" component={CitizenProfile} />

      <Route path="/officer" component={OfficerDashboard} />
      <Route path="/officer/complaints" component={OfficerComplaints} />
      <Route path="/officer/sla" component={OfficerSLA} />
      <Route path="/officer/performance" component={OfficerPerformance} />
      <Route path="/officer/profile" component={OfficerProfile} />

      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/analytics" component={AdminAnalytics} />
      <Route path="/admin/officers" component={AdminOfficers} />
      <Route path="/admin/departments" component={AdminDepartments} />
      <Route path="/admin/sla" component={AdminSLA} />
      <Route path="/admin/audit" component={AdminAudit} />
      <Route path="/admin/settings" component={AdminSettings} />

      <Route path="/department/:id" component={DepartmentPage} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL?.replace(/\/$/, "") || ""}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
