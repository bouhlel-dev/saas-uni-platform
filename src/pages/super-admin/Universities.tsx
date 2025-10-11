import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Users, Search, MapPin, Calendar, MoreVertical } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Universities = () => {
  const navigate = useNavigate();
  const [selectedUni, setSelectedUni] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/super-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/super-admin/universities" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
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

  const universities = [
    { name: "Harvard University", country: "USA", students: 23000, plan: "Enterprise", status: "Active", joined: "2023-01-15" },
    { name: "MIT", country: "USA", students: 11500, plan: "Enterprise", status: "Active", joined: "2023-02-20" },
    { name: "Oxford University", country: "UK", students: 24000, plan: "Premium", status: "Active", joined: "2023-03-10" },
    { name: "Cambridge University", country: "UK", students: 19000, plan: "Premium", status: "Active", joined: "2023-03-15" },
    { name: "Stanford University", country: "USA", students: 17000, plan: "Enterprise", status: "Active", joined: "2023-04-01" },
    { name: "ETH Zurich", country: "Switzerland", students: 22000, plan: "Premium", status: "Active", joined: "2023-04-15" },
    { name: "Tokyo University", country: "Japan", students: 28000, plan: "Premium", status: "Active", joined: "2023-05-01" },
    { name: "NUS Singapore", country: "Singapore", students: 30000, plan: "Enterprise", status: "Active", joined: "2023-05-10" },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="Universities Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">All Universities</h2>
            <p className="text-muted-foreground">Manage universities on the platform</p>
          </div>
          <Button onClick={() => navigate('/dashboard/super-admin/applications')}>View Applications</Button>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
              <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search universities..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => toast({ title: "Filter", description: "Filter functionality coming soon" })}>
                Filter
              </Button>
              <Button variant="outline" onClick={() => toast({ title: "Export Started", description: "Downloading universities report..." })}>
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Universities Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {universities.map((uni, idx) => (
            <Card key={idx} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{uni.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {uni.country}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Students</span>
                  <span className="font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {uni.students.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Plan</span>
                  <Badge variant="secondary">{uni.plan}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="default">{uni.status}</Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Joined</span>
                  <span className="text-xs flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {uni.joined}
                  </span>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    setSelectedUni(uni);
                    setShowDetails(true);
                  }}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedUni && (
          <ViewDetailsDialog
            open={showDetails}
            onOpenChange={setShowDetails}
            title={selectedUni.name}
            description="University Details"
            details={[
              { label: "Country", value: selectedUni.country },
              { label: "Total Students", value: selectedUni.students.toLocaleString() },
              { label: "Subscription Plan", value: selectedUni.plan, badge: true },
              { label: "Status", value: selectedUni.status, badge: true },
              { label: "Joined Date", value: selectedUni.joined },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Universities;
