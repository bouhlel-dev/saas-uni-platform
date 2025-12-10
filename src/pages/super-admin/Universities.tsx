import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Building2, Users, Search, MapPin, Calendar, MoreVertical, Trash2, CreditCard, Activity } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";


const Universities = () => {
  const navigate = useNavigate();
  const [selectedUni, setSelectedUni] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [universities, setUniversities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/super-admin/universities`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setUniversities(data);
        }
      } catch (error) {
        console.error('Error fetching universities:', error);
        toast({
          title: "Error",
          description: "Failed to load universities",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUniversities();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This action cannot be undone and will remove all associated data.`)) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/super-admin/universities/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        toast({
          title: "University Deleted",
          description: `${name} has been successfully deleted.`,
        });
        // Refresh list
        setUniversities(universities.filter(u => u.id !== id));
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete university",
        variant: "destructive"
      });
    }
  };

  const handleExport = () => {
    const headers = ["Name", "Country", "Students", "Plan", "Status", "Joined Date"];
    const csvContent = [
      headers.join(","),
      ...filteredUniversities.map(uni => [
        `"${uni.name}"`,
        `"${uni.country}"`,
        uni.students,
        `"${uni.plan}"`,
        uni.status,
        uni.joined
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "universities_export.csv");
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    toast({ title: "Export Successful", description: "Universities data downloaded as CSV." });
  };

  // Filter logic
  const filteredUniversities = universities.filter(uni => {
    const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      uni.country.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || uni.status === statusFilter;
    const matchesPlan = planFilter === "all" || uni.plan.toLowerCase().includes(planFilter.toLowerCase());

    return matchesSearch && matchesStatus && matchesPlan;
  });

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

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Universities Management">
        <div className="flex items-center justify-center h-full">
          <p>Loading universities...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or country..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Filter by Status: {statusFilter === 'all' ? 'All' : statusFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setStatusFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setStatusFilter("pending")}>Pending</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    Filter by Plan: {planFilter === 'all' ? 'All' : planFilter}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setPlanFilter("all")}>All</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlanFilter("basic")}>Basic</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlanFilter("premium")}>Premium</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPlanFilter("enterprise")}>Enterprise</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handleExport}>
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Universities Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredUniversities.length === 0 ? (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No universities found matching your criteria.</p>
            </div>
          ) : (
            filteredUniversities.map((uni, idx) => (
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedUni(uni);
                          setShowDetails(true);
                        }}>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive focus:text-destructive"
                          onClick={() => handleDelete(uni.id, uni.name)}
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete University
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
                    <Badge variant={uni.status === 'active' ? 'default' : 'secondary'}>{uni.status}</Badge>
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
            ))
          )}
        </div>

        {selectedUni && (
          <ViewDetailsDialog
            open={showDetails}
            onOpenChange={setShowDetails}
            title={selectedUni.name}
            description="University Details"
            details={[
              { label: "Country", value: selectedUni.country, icon: MapPin },
              { label: "Total Students", value: selectedUni.students.toLocaleString(), icon: Users },
              { label: "Subscription Plan", value: selectedUni.plan, badge: true, icon: CreditCard, variant: "secondary" },
              { label: "Status", value: selectedUni.status, badge: true, icon: Activity, variant: selectedUni.status === 'active' ? 'default' : 'secondary' },
              { label: "Joined Date", value: selectedUni.joined, icon: Calendar },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Universities;
