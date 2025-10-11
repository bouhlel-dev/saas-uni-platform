import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, FileText, ClipboardCheck, Calendar, Plus, Upload } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  
  const handleUploadMaterial = () => {
    toast({
      title: "Upload Material",
      description: "Material upload feature will be available soon.",
    });
  };
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/teacher" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Overview
      </NavLink>
      <NavLink to="/dashboard/teacher/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/teacher/assignments" className="block px-3 py-2 rounded-md hover:bg-muted">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/teacher/exams" className="block px-3 py-2 rounded-md hover:bg-muted">
        Exams
      </NavLink>
      <NavLink to="/dashboard/teacher/attendance" className="block px-3 py-2 rounded-md hover:bg-muted">
        Attendance
      </NavLink>
      <NavLink to="/dashboard/teacher/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
    </nav>
  );

  const stats = [
    { title: "My Courses", value: "6", icon: BookOpen },
    { title: "Total Students", value: "234", icon: Users },
    { title: "Pending Grades", value: "12", icon: FileText },
    { title: "Upcoming Exams", value: "3", icon: ClipboardCheck },
  ];

  const courses = [
    { id: "CS401", name: "Advanced Machine Learning", students: 45, schedule: "Mon, Wed 10:00-11:30" },
    { id: "CS302", name: "Data Structures & Algorithms", students: 67, schedule: "Tue, Thu 14:00-15:30" },
    { id: "CS201", name: "Introduction to Programming", students: 89, schedule: "Mon, Wed, Fri 09:00-10:00" },
    { id: "CS403", name: "Neural Networks", students: 33, schedule: "Tue, Thu 16:00-17:30" },
  ];

  const recentAssignments = [
    { course: "CS401", title: "ML Model Implementation", due: "Mar 25, 2024", submissions: 38, total: 45 },
    { course: "CS302", title: "Binary Tree Project", due: "Mar 22, 2024", submissions: 65, total: 67 },
    { course: "CS201", title: "Python Basics Quiz", due: "Mar 20, 2024", submissions: 89, total: 89 },
  ];

  const upcomingClasses = [
    { course: "CS401", time: "Today, 10:00 AM", topic: "Deep Learning Fundamentals", room: "Lab 301" },
    { course: "CS302", time: "Today, 2:00 PM", topic: "Graph Algorithms", room: "Room 205" },
    { course: "CS201", time: "Tomorrow, 9:00 AM", topic: "Functions and Modules", room: "Room 101" },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back, Dr. Smith!</CardTitle>
            <CardDescription className="text-base">Computer Science Department</CardDescription>
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
              </CardContent>
            </Card>
          ))}
        </div>

        {/* My Courses */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>My Courses</CardTitle>
                <CardDescription>Courses you're teaching this semester</CardDescription>
              </div>
              <Button size="sm" onClick={handleUploadMaterial}>
                <Upload className="w-4 h-4 mr-2" />
                Upload Material
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {courses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <Badge variant="outline" className="mb-2">{course.id}</Badge>
                      <h3 className="font-semibold">{course.name}</h3>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students} students
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {course.schedule}
                    </span>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/dashboard/teacher/courses')}>
                    View Course
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Recent Assignments */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Assignments</CardTitle>
                <Button size="sm" variant="outline" onClick={() => navigate('/dashboard/teacher/assignments')}>
                  <Plus className="w-4 h-4 mr-2" />
                  New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAssignments.map((assignment, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="secondary" className="text-xs mb-1">{assignment.course}</Badge>
                        <p className="font-medium text-sm">{assignment.title}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Due: {assignment.due}</span>
                      <span>{assignment.submissions}/{assignment.total} submitted</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingClasses.map((class_, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{class_.course}</Badge>
                      <span className="text-xs text-muted-foreground">{class_.time}</span>
                    </div>
                    <p className="font-medium text-sm">{class_.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">{class_.room}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TeacherDashboard;
