import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { formatDate } from "@/lib/formatUtils";
import { useState, useEffect } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

const Applications = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [credentialsDialog, setCredentialsDialog] = useState<{ open: boolean; email: string; password: string } | null>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/request-access`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        // Filter only pending requests
        setApplications(data.filter((r: any) => r.status === 'pending'));
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast({
        title: "Error",
        description: "Failed to load applications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/super-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/super-admin/universities" className="block px-3 py-2 rounded-md hover:bg-muted">
        Universities
      </NavLink>
      <NavLink to="/dashboard/super-admin/applications" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
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

  const handleApprove = async (app: any) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/request-access/${app.id}/approve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Request Approved",
          description: `${app.institutionName} has been approved.`,
        });

        if (data.credentials) {
          setCredentialsDialog({
            open: true,
            email: data.credentials.email,
            password: data.credentials.password
          });
        }
        fetchApplications();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve request",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (app: any) => {
    if (!confirm(`Are you sure you want to reject the request from ${app.institutionName}?`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/request-access/${app.id}/reject`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "Request Rejected",
          description: `${app.institutionName} has been rejected.`,
          variant: "destructive",
        });
        fetchApplications();
      }
    } catch (error) {
      console.error('Error rejecting request:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="University Applications">
        <div className="flex items-center justify-center h-full">
          <p>Loading applications...</p>
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
              Please save these credentials securely. They will be needed for the University Admin to log in.
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
      <DashboardLayout sidebar={sidebarContent} title="University Applications">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Access Requests</h2>
              <p className="text-muted-foreground">Review and approve new university access requests</p>
            </div>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {applications.length} Pending
            </Badge>
          </div>

          <div className="space-y-4">
            {applications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No pending access requests.</p>
            ) : (
              applications.map((app) => (
                <Card key={app.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-16 h-16 rounded-lg bg-gradient-primary flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl">{app.name}</CardTitle>
                          <CardDescription className="flex items-center gap-4 mt-2">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {app.institutionName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              Applied {formatDate(app.createdAt)}
                            </span>
                          </CardDescription>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Requester Name</p>
                        <p className="text-lg font-bold flex items-center gap-2">
                          <Users className="w-5 h-5 text-primary" />
                          {app.name}
                        </p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="text-lg font-bold">{app.role}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Contact Email</p>
                        <p className="text-sm font-medium break-all">{app.email}</p>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <p className="text-sm text-muted-foreground">Requested Plan</p>
                        <Badge variant="secondary" className="mt-1">{app.subscriptionPlan || 'Basic'}</Badge>
                      </div>
                    </div>
                    <div className="flex gap-3 justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(app)}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(app)}
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Applications;
