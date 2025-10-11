import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, Calendar, TrendingUp, Download, Clock } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StudentDashboard = () => {
  const navigate = useNavigate();
  
  const handleDownloadTranscript = () => {
    toast({
      title: "Downloading Transcript",
      description: "Your transcript is being prepared...",
    });
  };
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/student" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Overview
      </NavLink>
      <NavLink to="/dashboard/student/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/student/assignments" className="block px-3 py-2 rounded-md hover:bg-muted">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/student/exams" className="block px-3 py-2 rounded-md hover:bg-muted">
        Exams
      </NavLink>
      <NavLink to="/dashboard/student/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
      <NavLink to="/dashboard/student/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const stats = [
    { title: "Enrolled Courses", value: "6", icon: BookOpen },
    { title: "Current GPA", value: "3.85", icon: TrendingUp },
    { title: "Pending Tasks", value: "4", icon: FileText },
    { title: "Attendance", value: "94%", icon: Calendar },
  ];

  const enrolledCourses = [
    { id: "CS401", name: "Advanced Machine Learning", teacher: "Dr. Smith", progress: 65, grade: "A" },
    { id: "CS302", name: "Data Structures", teacher: "Dr. Johnson", progress: 78, grade: "A-" },
    { id: "CS201", name: "Programming Basics", teacher: "Dr. Williams", progress: 92, grade: "A+" },
    { id: "MATH301", name: "Linear Algebra", teacher: "Dr. Brown", progress: 55, grade: "B+" },
  ];

  const upcomingAssignments = [
    { course: "CS401", title: "ML Model Implementation", due: "Mar 25, 2024", status: "pending" },
    { course: "CS302", title: "Binary Tree Project", due: "Mar 22, 2024", status: "in-progress" },
    { course: "MATH301", title: "Matrix Operations", due: "Mar 20, 2024", status: "pending" },
  ];

  const recentGrades = [
    { course: "CS201", assignment: "Midterm Exam", grade: "95/100", date: "Mar 15, 2024" },
    { course: "CS302", assignment: "Sorting Algorithms", grade: "88/100", date: "Mar 12, 2024" },
    { course: "MATH301", assignment: "Quiz 3", grade: "92/100", date: "Mar 10, 2024" },
  ];

  const todayClasses = [
    { course: "CS401", time: "10:00 AM", room: "Lab 301", topic: "Neural Networks" },
    { course: "CS302", time: "2:00 PM", room: "Room 205", topic: "Graph Algorithms" },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="Student Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back, John!</CardTitle>
            <CardDescription className="text-base">Computer Science - Year 3</CardDescription>
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

        {/* Enrolled Courses */}
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Track your progress in each course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="outline" className="mb-2">{course.id}</Badge>
                      <h3 className="font-semibold">{course.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{course.teacher}</p>
                    </div>
                    <Badge variant="secondary">{course.grade}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/dashboard/student/courses')}>
                    View Course
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Assignments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingAssignments.map((assignment, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Badge variant="secondary" className="text-xs mb-1">{assignment.course}</Badge>
                        <p className="font-medium text-sm">{assignment.title}</p>
                      </div>
                      <Badge variant={assignment.status === "in-progress" ? "default" : "outline"} className="text-xs">
                        {assignment.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      Due: {assignment.due}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Today's Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Today's Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {todayClasses.map((class_, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">{class_.course}</Badge>
                      <span className="text-sm font-medium">{class_.time}</span>
                    </div>
                    <p className="font-medium text-sm">{class_.topic}</p>
                    <p className="text-xs text-muted-foreground mt-1">{class_.room}</p>
                  </div>
                ))}
                {todayClasses.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">No classes scheduled for today</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Grades</CardTitle>
              <Button variant="outline" size="sm" onClick={handleDownloadTranscript}>
                <Download className="w-4 h-4 mr-2" />
                Transcript
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentGrades.map((grade, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">{grade.course}</Badge>
                      <span className="text-sm font-medium">{grade.assignment}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{grade.date}</p>
                  </div>
                  <div className="text-lg font-bold text-primary">{grade.grade}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
