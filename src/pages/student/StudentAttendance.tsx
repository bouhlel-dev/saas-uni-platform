import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { formatDate } from "@/lib/formatUtils";
import { Calendar, CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentAttendance = () => {
  const sidebarContent = <StudentSidebar />;

  const [attendance, setAttendance] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    percentage: 0
  });

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const data = await api.get('/student/attendance');
        setAttendance(data);

        // Calculate stats
        const total = data.length;
        const present = data.filter((a: any) => a.status === 'present').length;
        const absent = data.filter((a: any) => a.status === 'absent').length;
        const late = data.filter((a: any) => a.status === 'late').length;
        const excused = data.filter((a: any) => a.status === 'excused').length;
        const percentage = total > 0 ? Math.round(((present + excused) / total) * 100) : 100;

        setStats({ total, present, absent, late, excused, percentage });
      } catch (error) {
        console.error("Error fetching attendance:", error);
        toast({
          title: "Error",
          description: "Failed to load attendance records",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'absent':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'late':
        return <Clock className="h-4 w-4 text-amber-600" />;
      case 'excused':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'absent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      case 'late':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400';
      case 'excused':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="My Attendance">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading attendance...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Attendance">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Attendance</h2>
          <p className="text-muted-foreground">Track your class attendance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-5">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Classes</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Present</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.present}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Absent</CardTitle>
              <XCircle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Late</CardTitle>
              <Clock className="h-4 w-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{stats.late}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Excused</CardTitle>
              <AlertCircle className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.excused}</div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Rate Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <CardTitle>Attendance Rate</CardTitle>
            <CardDescription>Your overall attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Progress value={stats.percentage} className="h-3" />
              </div>
              <div className={`text-3xl font-bold ${stats.percentage >= 75 ? 'text-green-600' : stats.percentage >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {stats.percentage}%
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              {stats.percentage >= 75 
                ? "Great attendance! Keep it up." 
                : stats.percentage >= 50 
                  ? "Your attendance needs improvement." 
                  : "Warning: Low attendance may affect your grades."}
            </p>
          </CardContent>
        </Card>

        {/* Attendance Records */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>Your attendance records by course</CardDescription>
          </CardHeader>
          <CardContent>
            {attendance.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No attendance records found</p>
            ) : (
              <div className="space-y-3">
                {attendance.map((record: any) => (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-primary/10">
                        {getStatusIcon(record.status)}
                      </div>
                      <div>
                        <h4 className="font-medium">{record.Course?.title || "Course"}</h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {record.date ? formatDate(record.date) : "N/A"}
                        </div>
                      </div>
                    </div>
                    <Badge className={getStatusColor(record.status || 'present')}>
                      {(record.status || 'present').charAt(0).toUpperCase() + (record.status || 'present').slice(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
