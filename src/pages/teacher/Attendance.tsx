import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, CheckCircle, XCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { MarkAttendanceDialog } from "@/components/forms/MarkAttendanceDialog";
import { useState } from "react";

const Attendance = () => {
  const [showMarkDialog, setShowMarkDialog] = useState(false);
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/teacher" className="block px-3 py-2 rounded-md hover:bg-muted">
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
      <NavLink to="/dashboard/teacher/attendance" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Attendance
      </NavLink>
      <NavLink to="/dashboard/teacher/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
    </nav>
  );

  const courses = [
    { 
      code: "CS401", 
      name: "Advanced Machine Learning", 
      totalStudents: 45,
      present: 42,
      absent: 3,
      avgAttendance: 93,
      lastClass: "Mar 18, 2024"
    },
    { 
      code: "CS302", 
      name: "Data Structures", 
      totalStudents: 67,
      present: 64,
      absent: 3,
      avgAttendance: 95,
      lastClass: "Mar 19, 2024"
    },
    { 
      code: "CS201", 
      name: "Programming Basics", 
      totalStudents: 89,
      present: 85,
      absent: 4,
      avgAttendance: 96,
      lastClass: "Mar 18, 2024"
    },
    { 
      code: "CS403", 
      name: "Neural Networks", 
      totalStudents: 33,
      present: 30,
      absent: 3,
      avgAttendance: 91,
      lastClass: "Mar 19, 2024"
    },
  ];

  return (
    <>
      <MarkAttendanceDialog open={showMarkDialog} onOpenChange={setShowMarkDialog} />
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
                  <Button variant="outline" size="sm" className="flex-1">View History</Button>
                  <Button size="sm" className="flex-1" onClick={() => setShowMarkDialog(true)}>
                    <Users className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
    </>
  );
};

export default Attendance;
