import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, BookOpen, Calendar, Plus, GraduationCap, UserCog } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";

const UniversityAdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    university: { name: "Loading...", address: "", subscription: "" },
    counts: { faculties: 0, teachers: 0, students: 0, courses: 0 }
  });
  const [faculties, setFaculties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch Dashboard Stats
        const statsData = await api.get('/admin/dashboard-stats');
        setStats(statsData);

        // Fetch Faculties List
        const facultiesData = await api.get('/admin/faculties');
        setFaculties(facultiesData);

        // Fetch Recent Activities
        const activitiesData = await api.get('/admin/recent-activities');
        setRecentActivities(activitiesData);

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sidebarContent = <UniversityAdminSidebar />;

  const statCards = [
    { title: "Faculties", value: stats.counts.faculties, icon: Building, change: "Active" },
    { title: "Total Teachers", value: stats.counts.teachers, icon: UserCog, change: "Registered" },
    { title: "Total Students", value: stats.counts.students, icon: GraduationCap, change: "Enrolled" },
    { title: "Active Courses", value: stats.counts.courses, icon: BookOpen, change: "This Term" },
  ];

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="University Admin Dashboard">
        <div className="flex items-center justify-center h-full">
          <p>Loading dashboard...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="University Admin Dashboard">
      <div className="space-y-6">
        {/* University Info */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{stats.university.name}</CardTitle>
                <CardDescription className="text-base">{stats.university.address || 'Address not available'}</CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm capitalize">{stats.university.subscription} Plan</Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <stat.icon className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Faculties Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Faculties</CardTitle>
                <CardDescription>Manage your university faculties and departments</CardDescription>
              </div>
              <Button size="sm" onClick={() => navigate('/dashboard/university-admin/faculties')}>
                <Plus className="w-4 h-4 mr-2" />
                Manage Faculties
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faculties.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No faculties found.</p>
              ) : (
                faculties.map((faculty, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <h3 className="font-semibold">{faculty.name}</h3>
                      <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3" />
                          {faculty.departments.length} Departments
                        </span>
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {faculty.students} Students
                        </span>
                        <span className="flex items-center gap-1">
                          <UserCog className="w-3 h-3" />
                          {faculty.teachers} Teachers
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/university-admin/faculties')}>View</Button>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates and changes in your university</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivities.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">No recent activities.</p>
              ) : (
                recentActivities.map((activity, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.details}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.time).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UniversityAdminDashboard;
