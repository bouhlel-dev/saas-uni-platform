import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { MarkAttendanceDialog } from "@/components/forms/MarkAttendanceDialog";
import { AttendanceHistoryDialog } from "@/components/AttendanceHistoryDialog";
import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import { TeacherSidebar } from "@/components/TeacherSidebar";

const Attendance = () => {
  const [showMarkDialog, setShowMarkDialog] = useState(false);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);

  const sidebarContent = <TeacherSidebar />;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = useCallback(async () => {
    try {
      const data = await api.get('/teacher/attendance-stats');
      setCourses(data);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load attendance stats", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  if (loading) return <div className="p-8 text-center">Loading attendance data...</div>;

  return (
    <>
      <MarkAttendanceDialog 
        open={showMarkDialog} 
        onOpenChange={setShowMarkDialog}
        onSuccess={fetchAttendance}
      />
      <DashboardLayout sidebar={sidebarContent} title="Attendance">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Attendance Tracking</h2>
              <p className="text-muted-foreground">Monitor and record student attendance</p>
            </div>
            <Button onClick={() => setShowMarkDialog(true)}>
              <Calendar className="w-4 h-4 mr-2" />
              Take Attendance
            </Button>
          </div>

          <div className="grid gap-4">
            {courses.map((course) => (
              <Card key={course.code} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{course.code}</Badge>
                        <Badge variant="secondary">
                          {course.avgAttendance}% Avg. Attendance
                        </Badge>
                      </div>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription>Last class: {course.lastClass}</CardDescription>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">{course.totalStudents}</div>
                      <p className="text-xs text-muted-foreground">Total Students</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <p className="text-sm text-muted-foreground">Present (Last Class)</p>
                      </div>
                      <p className="text-3xl font-bold">{course.present}</p>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        <p className="text-sm text-muted-foreground">Absent (Last Class)</p>
                      </div>
                      <p className="text-3xl font-bold">{course.absent}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowHistoryDialog(true);
                      }}
                    >
                      View History
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => setShowMarkDialog(true)}>
                      <Users className="w-4 h-4 mr-2" />
                      Mark Attendance
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedCourse && (
            <AttendanceHistoryDialog
              open={showHistoryDialog}
              onOpenChange={setShowHistoryDialog}
              course={selectedCourse}
            />
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Attendance;
