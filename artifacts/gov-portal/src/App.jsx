import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, ProtectedRoute } from "@/lib/AuthContext";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import FileComplaint from "@/pages/citizen/FileComplaint";
import TrackStatus from "@/pages/citizen/TrackStatus";
import ComplaintHistory from "@/pages/citizen/ComplaintHistory";
import CitizenProfile from "@/pages/citizen/CitizenProfile";
import DepartmentsDirectory from "@/pages/citizen/DepartmentsDirectory";
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
import Statistics from "@/pages/Statistics";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      <Route path="/citizen">
        {() => <ProtectedRoute roles={["citizen"]}><CitizenDashboard /></ProtectedRoute>}
      </Route>
      <Route path="/citizen/complaint/new">
        {() => <ProtectedRoute roles={["citizen"]}><FileComplaint /></ProtectedRoute>}
      </Route>
      <Route path="/citizen/track">
        {() => <ProtectedRoute roles={["citizen"]}><TrackStatus /></ProtectedRoute>}
      </Route>
      <Route path="/citizen/history">
        {() => <ProtectedRoute roles={["citizen"]}><ComplaintHistory /></ProtectedRoute>}
      </Route>
      <Route path="/citizen/departments">
        {() => <ProtectedRoute roles={["citizen"]}><DepartmentsDirectory /></ProtectedRoute>}
      </Route>
      <Route path="/citizen/profile">
        {() => <ProtectedRoute roles={["citizen"]}><CitizenProfile /></ProtectedRoute>}
      </Route>

      <Route path="/officer">
        {() => <ProtectedRoute roles={["officer"]}><OfficerDashboard /></ProtectedRoute>}
      </Route>
      <Route path="/officer/complaints">
        {() => <ProtectedRoute roles={["officer"]}><OfficerComplaints /></ProtectedRoute>}
      </Route>
      <Route path="/officer/sla">
        {() => <ProtectedRoute roles={["officer"]}><OfficerSLA /></ProtectedRoute>}
      </Route>
      <Route path="/officer/performance">
        {() => <ProtectedRoute roles={["officer"]}><OfficerPerformance /></ProtectedRoute>}
      </Route>
      <Route path="/officer/profile">
        {() => <ProtectedRoute roles={["officer"]}><OfficerProfile /></ProtectedRoute>}
      </Route>

      <Route path="/admin">
        {() => <ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>}
      </Route>
      <Route path="/admin/analytics">
        {() => <ProtectedRoute roles={["admin"]}><AdminAnalytics /></ProtectedRoute>}
      </Route>
      <Route path="/admin/officers">
        {() => <ProtectedRoute roles={["admin"]}><AdminOfficers /></ProtectedRoute>}
      </Route>
      <Route path="/admin/departments">
        {() => <ProtectedRoute roles={["admin"]}><AdminDepartments /></ProtectedRoute>}
      </Route>
      <Route path="/admin/sla">
        {() => <ProtectedRoute roles={["admin"]}><AdminSLA /></ProtectedRoute>}
      </Route>
      <Route path="/admin/audit">
        {() => <ProtectedRoute roles={["admin"]}><AdminAudit /></ProtectedRoute>}
      </Route>
      <Route path="/admin/settings">
        {() => <ProtectedRoute roles={["admin"]}><AdminSettings /></ProtectedRoute>}
      </Route>

      <Route path="/statistics">
        {() => <Statistics />}
      </Route>

      <Route path="/department/:id" component={DepartmentPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base="">
          <AuthProvider>
            <Router />
          </AuthProvider>
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
