import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, DollarSign, TrendingUp, CheckCircle, XCircle, Clock } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ApproveApplicationDialog } from "@/components/forms/ApproveApplicationDialog";
import { useState } from "react";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [selectedApp, setSelectedApp] = useState<{ name: string; country: string } | null>(null);
  
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

  const stats = [
    { title: "Total Universities", value: "124", icon: Building2, trend: "+12%" },
    { title: "Active Users", value: "45,231", icon: Users, trend: "+18%" },
    { title: "Monthly Revenue", value: "$89,450", icon: DollarSign, trend: "+23%" },
    { title: "Platform Growth", value: "156%", icon: TrendingUp, trend: "+8%" },
  ];

  const pendingApplications = [
    { id: 1, name: "Stanford University", country: "USA", date: "2024-01-15", students: 15000 },
    { id: 2, name: "Oxford University", country: "UK", date: "2024-01-14", students: 22000 },
    { id: 3, name: "Tokyo University", country: "Japan", date: "2024-01-13", students: 28000 },
  ];

  const handleApprove = (app: { name: string; country: string }) => {
    setSelectedApp(app);
  };

  const handleReject = (name: string) => {
    toast({
      title: "Application Rejected",
      description: `${name} has been rejected.`,
      variant: "destructive",
    });
  };

  return (
    <>
      <ApproveApplicationDialog 
        open={!!selectedApp} 
        onOpenChange={(open) => !open && setSelectedApp(null)}
        application={selectedApp || { name: "", country: "" }}
      />
    <DashboardLayout sidebar={sidebarContent} title="Super Admin Dashboard">
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend} from last month
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pending Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Pending University Applications</CardTitle>
            <CardDescription>Review and approve new universities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingApplications.map((app) => (
                <div key={app.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold">{app.name}</h3>
                    <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {app.country}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {app.students.toLocaleString()} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {app.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="default" onClick={() => handleApprove(app)}>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleReject(app.name)}>
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              ))}
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
              {["Harvard University", "MIT", "Cambridge University", "ETH Zurich"].map((uni, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Building2 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{uni}</p>
                      <p className="text-sm text-muted-foreground">Active</p>
                    </div>
                  </div>
                  <Badge variant="secondary">Premium Plan</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </>
  );
};

export default SuperAdminDashboard;
