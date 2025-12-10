

import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, Mail } from "lucide-react";
import { formatDate } from "@/lib/formatUtils";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { api } from "@/lib/api";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUniversities: 0,
    activeUniversities: 0,
    totalStudents: 0,
    pendingApplications: 0
  });
  const [accessRequests, setAccessRequests] = useState<any[]>([]);
  const [recentUniversities, setRecentUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [credentialsDialog, setCredentialsDialog] = useState<{ open: boolean; email: string; password: string; emailSent?: boolean } | null>(null);

  const fetchData = async () => {
    try {
      // Fetch stats and access requests using api.get
      const [statsData, requestsData] = await Promise.all([
        api.get('/super-admin/dashboard-stats'),
        api.get('/request-access')
      ]);

      setStats(statsData.stats);
      setRecentUniversities(statsData.recentUniversities);

      // Filter only pending requests for the main view
      setAccessRequests(requestsData.filter((r: any) => r.status === 'pending'));

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/super-admin" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Overview
      </NavLink>
      <NavLink to="/dashboard/super-admin/universities" className="block px-3 py-2 rounded-md hover:bg-muted">
        Universities
      </NavLink>
      <NavLink to="/dashboard/super-admin/applications" className="block px-3 py-2 rounded-md hover:bg-muted">
        Applications
      </NavLink>
      <NavLink to="/dashboard/super-admin/billing" className="block px-3 py-2 rounded-md hover:bg-muted">
        Billing
      </NavLink>
      <NavLink to="/dashboard/super-admin/settings" className="block px-3 py-2 rounded-md hover:bg-muted">
        Settings
      </NavLink>
    </nav>
  );

  const statCards = [
    { title: "Total Universities", value: stats?.totalUniversities?.toString() || '0', icon: Building2, trend: "+12%" },
    { title: "Active Universities", value: stats?.activeUniversities?.toString() || '0', icon: Users, trend: "+18%" },
    { title: "Total Students", value: stats?.totalStudents?.toLocaleString() || '0', icon: DollarSign, trend: "+23%" },
    { title: "Pending Applications", value: stats?.pendingApplications?.toString() || '0', icon: TrendingUp, trend: "+8%" },
  ];

  const handleApprove = async (id: number, name: string) => {
    try {
      const data = await api.post(`/request-access/${id}/approve`, {});

      if (data.emailSent) {
        toast({
          title: "Request Approved & Email Sent",
          description: `${name} has been approved. Credentials have been emailed to the admin.`,
          className: "bg-green-50 border-green-200"
        });
      } else {
        toast({
          title: "Request Approved (Email Failed)",
          description: `${name} has been approved, but the email could not be sent. Please send credentials manually.`,
          variant: "destructive"
        });
      }

      // Show credentials
      if (data.credentials) {
        setCredentialsDialog({
          open: true,
          email: data.credentials.email,
          password: data.credentials.password,
          emailSent: data.emailSent
        });
      }

      fetchData(); // Refresh data
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number, name: string) => {
    try {
      await api.post(`/request-access/${id}/reject`, {});

      toast({
        title: "Request Rejected",
        description: `${name} has been rejected.`,
        variant: "destructive",
      });
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Super Admin Dashboard">
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <Dialog open={!!credentialsDialog?.open} onOpenChange={(open) => !open && setCredentialsDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>University Created Successfully</DialogTitle>
            <DialogDescription>
              {credentialsDialog?.emailSent
                ? "Credentials have been emailed to the user. You can also view them below."
                : "Email sending failed. Please save these credentials and send them manually."
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Email:</span>
                <span className="font-mono">{credentialsDialog?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Temporary Password:</span>
                <span className="font-mono">{credentialsDialog?.password}</span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setCredentialsDialog(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DashboardLayout sidebar={sidebarContent} title="Super Admin Dashboard">
        <div className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <stat.icon className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value || '0'}</div>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.trend} from last month
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Access Requests */}
          <Card>
            <CardHeader>
              <CardTitle>Access Requests</CardTitle>
              <CardDescription>Review and approve new university access requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {accessRequests.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No pending requests.</p>
                ) : (
                  accessRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{req.institutionName}</h3>
                          <Badge variant="outline">{req.role}</Badge>
                          {req.subscriptionPlan && (
                            <Badge variant="default" className="bg-gradient-primary">
                              {req.subscriptionPlan} Plan
                            </Badge>
                          )}
                        </div>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {req.name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {req.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatDate(req.createdAt)}
                          </span>
                        </div>
                        {req.message && (
                          <p className="text-sm text-muted-foreground mt-2 italic">"{req.message}"</p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="default" onClick={() => handleApprove(req.id, req.institutionName)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleReject(req.id, req.institutionName)}>
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Universities */}
          <Card>
            <CardHeader>
              <CardTitle>Recently Approved Universities</CardTitle>
              <CardDescription>Latest universities added to the platform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentUniversities.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No active universities yet.</p>
                ) : (
                  recentUniversities.map((uni, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{uni.name}</p>
                          <p className="text-sm text-muted-foreground">Active</p>
                        </div>
                      </div>
                      <Badge variant="secondary">{uni.plan || 'Basic Plan'}</Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default SuperAdminDashboard;
