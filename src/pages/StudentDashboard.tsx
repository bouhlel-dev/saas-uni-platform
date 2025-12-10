import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, FileText, Calendar, TrendingUp, Download, Clock, Loader2, AlertCircle } from "lucide-react";

import { api } from "@/lib/api";
import { StudentSidebar } from "@/components/StudentSidebar";
import { formatDate, formatGPA } from "@/lib/formatUtils";
import { CourseDetailsDialog } from "@/components/CourseDetailsDialog";

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);
  const [dashboardData, setDashboardData] = useState({
    stats: [],
    courses: [],
    assignments: [],
    grades: [],
    todayClasses: []
  });

  const showToast = (title, description, variant = "default") => {
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${variant === 'destructive'
      ? 'bg-red-600 text-white'
      : 'bg-white text-gray-900 border border-gray-200'
      }`;
    toast.innerHTML = `
      <div class="font-semibold mb-1">${title}</div>
      <div class="text-sm ${variant === 'destructive' ? 'text-red-100' : 'text-gray-600'}">${description}</div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 4000);
  };

  // Check authentication and fetch data
  useEffect(() => {
    const fetchDashboardData = async () => {
      const userStr = localStorage.getItem("user");

      try {
        const user = userStr ? JSON.parse(userStr) : null;
        setUserData(user);

        const [coursesData, assignmentsData, gradesData, scheduleData, statsData] = await Promise.all([
          api.get('/student/courses'),
          api.get('/student/assignments'),
          api.get('/student/grades'),
          api.get('/student/schedule'),
          api.get('/student/dashboard-stats')
        ]);

        // Map backend data to frontend structure
        const courses = Array.isArray(coursesData) ? coursesData.map((c: any) => {
          const schedule = c.Schedules && c.Schedules[0];
          const teacherName = schedule?.Teacher?.User?.name || "TBA";
          return {
            id: c.id,
            code: c.code || `CS${c.id}0${c.semester || 1}`,
            name: c.title,
            teacher: teacherName,
            grade: c.studentGrade !== 'N/A' ? c.studentGrade : "N/A",
            progress: c.progress || 0,
            credits: c.credits || 3
          };
        }) : [];

        const assignments = Array.isArray(assignmentsData) ? assignmentsData.map((a: any) => ({
          id: a.id,
          courseCode: a.Course?.code || `CS${a.course_id}01`,
          course: a.Course?.title || "Course",
          title: a.title,
          status: a.AssignmentSubmissions?.length > 0 ? "submitted" : 
                  (new Date(a.deadline) > new Date() ? "pending" : "overdue"),
          dueDate: a.deadline
        })) : [];

        const grades = Array.isArray(gradesData) ? gradesData.map((g: any) => ({
          id: g.id,
          courseCode: g.Course?.code || `CS${g.course_id}01`,
          course: g.Course?.title || "Course",
          assignment: g.comment || "Assessment",
          date: g.createdAt,
          score: g.score
        })) : [];

        // Filter schedule for today and tomorrow only
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const today = new Date();
        const todayName = daysOfWeek[today.getDay()];
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowName = daysOfWeek[tomorrow.getDay()];

        const upcomingClasses = Array.isArray(scheduleData) ? scheduleData
          .filter((s: any) => s.day === todayName || s.day === tomorrowName)
          .map((s: any) => ({
            courseCode: s.Course?.code || `CS${s.course_id}01`,
            courseName: s.Course?.title || "Course",
            time: s.time,
            room: s.room || "TBA",
            day: s.day,
            isToday: s.day === todayName
          }))
          .sort((a: any, b: any) => {
            // Sort by day (today first) then by time
            if (a.isToday !== b.isToday) return a.isToday ? -1 : 1;
            return a.time.localeCompare(b.time);
          }) : [];

        // Calculate stats
        const attendancePercentage = statsData?.attendancePercentage ?? 100;
        const attendanceColor = attendancePercentage >= 50 ? "text-green-600" : "text-red-600";

        const stats = [
          {
            title: "Enrolled Courses",
            value: (statsData?.coursesCount ?? 0).toString(),
            icon: BookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
            valueColor: "text-foreground"
          },
          {
            title: "Moyenne",
            value: `${statsData?.averageGrade ?? 0}/20`,
            icon: TrendingUp,
            color: "text-emerald-600",
            bgColor: "bg-emerald-100 dark:bg-emerald-900/20",
            valueColor: "text-blue-600"
          },
          {
            title: "Pending Tasks",
            value: (statsData?.pendingAssignmentsCount ?? 0).toString(),
            icon: FileText,
            color: "text-amber-600",
            bgColor: "bg-amber-100 dark:bg-amber-900/20",
            valueColor: "text-red-600"
          },
          {
            title: "Attendance",
            value: `${attendancePercentage}%`,
            icon: Calendar,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
            valueColor: attendanceColor
          },
        ];

        setDashboardData({
          stats,
          courses,
          assignments,
          grades,
          todayClasses: upcomingClasses
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

  const calculateGPA = (grades) => {
    if (!grades || !Array.isArray(grades) || grades.length === 0) return "N/A";
    const total = grades.reduce((sum, g) => sum + (g.score || 0), 0);
    const average = total / grades.length;
    return formatGPA(average, 100);
  };

  const calculateAttendance = (courses) => {
    if (!courses || courses.length === 0) return "N/A";
    const total = courses.reduce((sum, c) => sum + (c.attendance || 0), 0);
    return Math.round(total / courses.length) + "%";
  };

  const handleDownloadTranscript = async () => {
    showToast("Coming Soon", "Transcript download will be available in a future update.");
  };

  const handleViewCourse = (course) => {
    setSelectedCourse(course);
    setShowCourseDialog(true);
  };

  const sidebarContent = <StudentSidebar />;

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Student Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Student Dashboard">
        <div className="flex items-center justify-center h-[60vh]">
          <Card className="max-w-md">
            <CardContent className="pt-6">
              <div className="text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error Loading Dashboard</h3>
                <p className="text-gray-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="Student Dashboard">
      <div className="space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle className="text-2xl">
              Welcome back, {userData?.name || "Student"}!
            </CardTitle>
            <CardDescription className="text-base">
              {userData?.department || "Computer Science"} - Year {userData?.year || "3"}
            </CardDescription>
          </CardHeader>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {dashboardData.stats.map((stat: any) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${stat.valueColor}`}>{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>



        <div className="grid gap-6 md:grid-cols-2">
          {/* Upcoming Assignments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Assignments</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/assignments')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {dashboardData.assignments.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No pending assignments</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.assignments.filter((a: any) => a.status !== 'submitted').slice(0, 3).map((assignment) => (
                    <div key={assignment.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <Badge variant="secondary" className="text-xs mb-1">
                            {assignment.courseCode || assignment.course}
                          </Badge>
                          <p className="font-medium text-sm">{assignment.title}</p>
                        </div>
                        <Badge
                          variant={assignment.status === "in-progress" ? "default" : "outline"}
                          className="text-xs"
                        >
                          {assignment.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        Due: {formatDate(assignment.dueDate)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Classes */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Today and tomorrow's schedule</CardDescription>
              </div>
              <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/timetable')}>
                View All
              </Button>
            </CardHeader>
            <CardContent>
              {dashboardData.todayClasses.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No classes scheduled</p>
              ) : (
                <div className="space-y-3">
                  {dashboardData.todayClasses.map((class_, idx) => (
                    <div key={idx} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{class_.courseCode}</Badge>
                        <Badge variant={class_.isToday ? "default" : "secondary"}>
                          {class_.isToday ? "Today" : "Tomorrow"}
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{class_.courseName}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
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

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Grades</CardTitle>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard/student/grades')}>
                  View All
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownloadTranscript}>
                  <Download className="w-4 h-4 mr-2" />
                  Transcript
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {dashboardData.grades.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No grades available yet</p>
            ) : (
              <div className="space-y-3">
                {dashboardData.grades.slice(0, 3).map((grade) => (
                  <div key={grade.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="secondary" className="text-xs">
                          {grade.courseCode || grade.course}
                        </Badge>
                        <span className="text-sm font-medium">{grade.assignment || grade.title}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(grade.date)}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      {grade.score || grade.grade}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <CourseDetailsDialog
        open={showCourseDialog}
        onOpenChange={setShowCourseDialog}
        course={selectedCourse}
      />
    </DashboardLayout>
  );
};

export default StudentDashboard;