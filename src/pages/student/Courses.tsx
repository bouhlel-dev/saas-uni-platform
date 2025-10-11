import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, Calendar, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Courses = () => {
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/student" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/student/courses" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
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

  const courses = [
    { 
      code: "CS401", 
      name: "Advanced Machine Learning", 
      teacher: "Dr. Sarah Smith", 
      credits: 4,
      schedule: "Mon, Wed 10:00-11:30",
      room: "Lab 301",
      progress: 65,
      grade: "A",
      materials: 24,
      assignments: 8
    },
    { 
      code: "CS302", 
      name: "Data Structures & Algorithms", 
      teacher: "Dr. Michael Johnson", 
      credits: 4,
      schedule: "Tue, Thu 14:00-15:30",
      room: "Room 205",
      progress: 78,
      grade: "A-",
      materials: 18,
      assignments: 6
    },
    { 
      code: "CS201", 
      name: "Introduction to Programming", 
      teacher: "Dr. Emily Williams", 
      credits: 3,
      schedule: "Mon, Wed, Fri 09:00-10:00",
      room: "Room 101",
      progress: 92,
      grade: "A+",
      materials: 32,
      assignments: 12
    },
    { 
      code: "MATH301", 
      name: "Linear Algebra", 
      teacher: "Dr. Robert Brown", 
      credits: 3,
      schedule: "Tue, Thu 11:00-12:30",
      room: "Room 303",
      progress: 55,
      grade: "B+",
      materials: 20,
      assignments: 7
    },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Courses">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Courses</h2>
          <p className="text-muted-foreground">Your enrolled courses for this semester</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.code} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{course.code}</Badge>
                      <Badge variant="secondary">{course.credits} Credits</Badge>
                      <Badge variant="default">{course.grade}</Badge>
                    </div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>{course.teacher}</CardDescription>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{course.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>Room {course.room}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center p-3 border rounded-lg">
                    <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xl font-bold">{course.materials}</p>
                    <p className="text-xs text-muted-foreground">Materials</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-xl font-bold">{course.assignments}</p>
                    <p className="text-xs text-muted-foreground">Assignments</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Course Progress</span>
                    <span className="font-medium">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} />
                </div>

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => toast({ 
                    title: "Course Details", 
                    description: `Viewing ${course.name} materials and resources...` 
                  })}
                >
                  View Course Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Courses;
