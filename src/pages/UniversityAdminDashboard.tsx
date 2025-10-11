import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, BookOpen, Calendar, Plus, GraduationCap, UserCog } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const UniversityAdminDashboard = () => {
  const navigate = useNavigate();
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/university-admin" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Overview
      </NavLink>
      <NavLink to="/dashboard/university-admin/faculties" className="block px-3 py-2 rounded-md hover:bg-muted">
        Faculties
      </NavLink>
      <NavLink to="/dashboard/university-admin/teachers" className="block px-3 py-2 rounded-md hover:bg-muted">
        Teachers
      </NavLink>
      <NavLink to="/dashboard/university-admin/students" className="block px-3 py-2 rounded-md hover:bg-muted">
        Students
      </NavLink>
      <NavLink to="/dashboard/university-admin/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        Courses
      </NavLink>
      <NavLink to="/dashboard/university-admin/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const stats = [
    { title: "Faculties", value: "12", icon: Building, change: "+2 this year" },
    { title: "Total Teachers", value: "487", icon: UserCog, change: "+34 this semester" },
    { title: "Total Students", value: "15,234", icon: GraduationCap, change: "+1,203 new" },
    { title: "Active Courses", value: "234", icon: BookOpen, change: "18 new this term" },
  ];

  const faculties = [
    { name: "Engineering & Technology", departments: 8, students: 4523, teachers: 145 },
    { name: "Business & Economics", departments: 5, students: 3821, teachers: 98 },
    { name: "Medicine & Health Sciences", departments: 6, students: 2890, teachers: 167 },
    { name: "Arts & Humanities", departments: 7, students: 2456, teachers: 77 },
  ];

  const recentActivities = [
    { action: "New course created", details: "Advanced Machine Learning - CS401", time: "2 hours ago" },
    { action: "Teacher assigned", details: "Dr. Smith to Data Science course", time: "5 hours ago" },
    { action: "Timetable updated", details: "Spring 2024 schedule published", time: "1 day ago" },
    { action: "Exam scheduled", details: "Final exams for Computer Science dept", time: "2 days ago" },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="University Admin Dashboard">
      <div className="space-y-6">
        {/* University Info */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Stanford University</CardTitle>
                <CardDescription className="text-base">California, United States</CardDescription>
              </div>
              <Badge variant="secondary" className="text-sm">Premium Plan</Badge>
            </div>
          </CardHeader>
        </Card>

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
                Add Faculty
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faculties.map((faculty, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold">{faculty.name}</h3>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3" />
                        {faculty.departments} Departments
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        {faculty.students.toLocaleString()} Students
                      </span>
                      <span className="flex items-center gap-1">
                        <UserCog className="w-3 h-3" />
                        {faculty.teachers} Teachers
                      </span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/university-admin/faculties')}>Manage</Button>
                </div>
              ))}
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
              {recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-2 h-2 mt-2 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{activity.action}</p>
                    <p className="text-sm text-muted-foreground">{activity.details}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default UniversityAdminDashboard;
