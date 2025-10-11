import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Users, MapPin, Clock, CheckCircle, XCircle, Eye } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ApproveApplicationDialog } from "@/components/forms/ApproveApplicationDialog";
import { useState } from "react";

const Applications = () => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  
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

  const applications = [
    { id: 1, name: "University of Melbourne", country: "Australia", students: 50000, faculties: 12, date: "2024-03-15", contact: "admin@unimelb.edu.au" },
    { id: 2, name: "Seoul National University", country: "South Korea", students: 28000, faculties: 16, date: "2024-03-14", contact: "admin@snu.ac.kr" },
    { id: 3, name: "University of Toronto", country: "Canada", students: 91000, faculties: 18, date: "2024-03-13", contact: "admin@utoronto.ca" },
    { id: 4, name: "Technical University Munich", country: "Germany", students: 45000, faculties: 15, date: "2024-03-12", contact: "admin@tum.de" },
    { id: 5, name: "Imperial College London", country: "UK", students: 17000, faculties: 9, date: "2024-03-10", contact: "admin@imperial.ac.uk" },
  ];

  const handleApprove = (app: any) => {
    setSelectedApp(app);
    setShowApproveDialog(true);
  };

  const handleReject = (name: string) => {
    toast({
      title: "Application Rejected",
      description: `${name} has been rejected and notified.`,
      variant: "destructive",
    });
  };

  return (
    <>
      {selectedApp && (
        <ApproveApplicationDialog
          open={showApproveDialog}
          onOpenChange={setShowApproveDialog}
          application={selectedApp}
        />
      )}
      <DashboardLayout sidebar={sidebarContent} title="University Applications">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Pending Applications</h2>
            <p className="text-muted-foreground">Review and approve new university registrations</p>
          </div>
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {applications.length} Pending
          </Badge>
        </div>

        <div className="space-y-4">
          {applications.map((app) => (
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
                          {app.country}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Applied {app.date}
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
                    <p className="text-sm text-muted-foreground">Total Students</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {app.students.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Faculties</p>
                    <p className="text-2xl font-bold">{app.faculties}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Contact Email</p>
                    <p className="text-sm font-medium break-all">{app.contact}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground">Requested Plan</p>
                    <Badge variant="secondary" className="mt-1">Enterprise</Badge>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleReject(app.name)}
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
          ))}
        </div>
      </div>
    </DashboardLayout>
    </>
  );
};

export default Applications;
