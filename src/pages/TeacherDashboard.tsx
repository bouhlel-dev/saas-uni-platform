import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, FileText, ClipboardCheck, Calendar, Plus, Upload, Loader2, AlertCircle } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatUtils";

import { api } from "@/lib/api";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { UploadMaterialDialog } from "@/components/UploadMaterialDialog";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    courses: [],
    recentAssignments: [],
    upcomingClasses: []
  });
  const [uploadMaterialOpen, setUploadMaterialOpen] = useState(false);

  const handleUploadMaterial = () => {
    setUploadMaterialOpen(true);
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const userStr = localStorage.getItem("user");
        const user = userStr ? JSON.parse(userStr) : null;
        setUserData(user);

        // Fetch all required data using api.get which handles auth and errors (including 503)
        const [coursesData, scheduleData, assignmentsData, statsData] = await Promise.all([
          api.get('/teacher/courses'),
          api.get('/teacher/schedule'),
          api.get('/teacher/assignments'),
          api.get('/teacher/dashboard-stats')
        ]);

        // Process Courses - merge schedule info
        const coursesList = Array.isArray(coursesData) ? coursesData : [];
        const scheduleList = Array.isArray(scheduleData) ? scheduleData : [];
        
        // Add schedule info to each course
        const coursesWithSchedule = coursesList.map((course: any) => {
          const courseSchedules = scheduleList.filter((s: any) => s.course_id === course.id);
          const scheduleDays = [...new Set(courseSchedules.map((s: any) => s.day))].join(', ');
          return {
            ...course,
            schedule: scheduleDays || 'No schedule',
            classCount: [...new Set(courseSchedules.map((s: any) => s.class_id))].length
          };
        });

        // Process Assignments
        const assignmentsList = Array.isArray(assignmentsData) ? assignmentsData : [];

        const stats = [
          { title: "My Courses", value: statsData.coursesCount.toString(), icon: BookOpen },
          { title: "Total Students", value: statsData.totalStudents.toString(), icon: Users },
          { title: "Pending Grades", value: statsData.pendingGrades.toString(), icon: FileText },
          { title: "Upcoming Exams", value: statsData.upcomingExams.toString(), icon: ClipboardCheck },
        ];

        // Format upcoming classes from schedule - only today and tomorrow
        const dayOrder = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const currentDayIndex = today.getDay();
        const tomorrowDayIndex = (currentDayIndex + 1) % 7;
        const currentDayName = dayOrder[currentDayIndex];
        const tomorrowDayName = dayOrder[tomorrowDayIndex];
        
        // Filter to only today and tomorrow, then sort by day and time
        const filteredSchedule = Array.isArray(scheduleData) 
          ? scheduleData.filter((s: any) => s.day === currentDayName || s.day === tomorrowDayName)
          : [];
        
        const sortedSchedule = [...filteredSchedule].sort((a: any, b: any) => {
          // Today comes before tomorrow
          if (a.day === currentDayName && b.day === tomorrowDayName) return -1;
          if (a.day === tomorrowDayName && b.day === currentDayName) return 1;
          // Same day, sort by time
          return (a.time || '').localeCompare(b.time || '');
        });

        const upcomingClasses = sortedSchedule.map((s: any) => ({
          courseName: s.Course?.title || "Unknown Course",
          className: s.Class?.name || "Unknown Class",
          day: s.day === currentDayName ? "Today" : "Tomorrow",
          time: s.time || "TBA",
          room: s.room || "TBA"
        }));

        // Sort assignments by creation date (newest first)
        const recentAssignments = assignmentsList
          .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 3);

        setDashboardData({
          stats,
          courses: coursesWithSchedule,
          recentAssignments: recentAssignments,
          upcomingClasses: upcomingClasses.slice(0, 3)
        });

        setLoading(false);
      } catch (err: any) {
        console.error("Dashboard error:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const sidebarContent = <TeacherSidebar />;

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Teacher Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Teacher Dashboard">
        <div className="flex flex-col items-center justify-center h-[60vh] text-center">
          <AlertCircle className="w-12 h-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold">Error Loading Dashboard</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="Teacher Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back, {userData?.name || "Teacher"}!</CardTitle>
            <CardDescription className="text-base">{userData?.department || "Department"}</CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardData.stats.map((stat) => (
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
            {dashboardData.courses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No courses found</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {dashboardData.courses.map((course) => (
                  <div key={course.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <Badge variant="outline" className="mb-2">{course.code || `CS${course.id}`}</Badge>
                        <h3 className="font-semibold">{course.title}</h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {course.studentCount || course.dataValues?.studentCount || 0} students
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {course.schedule || "TBA"}
                      </span>
                    </div>
                    <Button variant="outline" size="sm" className="w-full mt-3" onClick={() => navigate('/dashboard/teacher/courses')}>
                      View Course
                    </Button>
                  </div>
                ))}
              </div>
            )}
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
              {dashboardData.recentAssignments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No recent assignments</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.recentAssignments.map((assignment: any) => (
                    <div key={assignment.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-sm truncate max-w-[200px]">{assignment.title}</h4>
                        <Badge variant="outline" className="text-xs">{assignment.Course?.title}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Due: {formatDate(assignment.deadline)}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {assignment.submissions} subs
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Classes</CardTitle>
            </CardHeader>
            <CardContent>
              {dashboardData.upcomingClasses.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No upcoming classes</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.upcomingClasses.map((class_, idx) => (
                    <div key={idx} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{class_.courseName}</Badge>
                        <Badge variant="secondary">{class_.day}</Badge>
                      </div>
                      <p className="font-medium text-sm">{class_.className}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {class_.time}
                        </span>
                        <span>Room: {class_.room}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upload Material Dialog */}
      <UploadMaterialDialog
        open={uploadMaterialOpen}
        onOpenChange={setUploadMaterialOpen}
        courses={dashboardData.courses.map(c => ({ id: String(c.id), name: c.title }))}
        onSuccess={() => {
          toast({
            title: "Success",
            description: "Material uploaded successfully!",
          });
        }}
      />
    </DashboardLayout>
  );
};

export default TeacherDashboard;
