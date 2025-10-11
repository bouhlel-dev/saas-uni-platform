import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Users, FileText, Calendar, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";

const MyCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/teacher" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/teacher/courses" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
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

  const courses = [
    { 
      id: "CS401", 
      name: "Advanced Machine Learning", 
      students: 45, 
      schedule: "Mon, Wed 10:00-11:30",
      materials: 24,
      assignments: 8,
      progress: 65
    },
    { 
      id: "CS302", 
      name: "Data Structures & Algorithms", 
      students: 67, 
      schedule: "Tue, Thu 14:00-15:30",
      materials: 18,
      assignments: 6,
      progress: 78
    },
    { 
      id: "CS201", 
      name: "Introduction to Programming", 
      students: 89, 
      schedule: "Mon, Wed, Fri 09:00-10:00",
      materials: 32,
      assignments: 12,
      progress: 92
    },
    { 
      id: "CS403", 
      name: "Neural Networks", 
      students: 33, 
      schedule: "Tue, Thu 16:00-17:30",
      materials: 15,
      assignments: 5,
      progress: 55
    },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Courses">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Courses</h2>
            <p className="text-muted-foreground">Courses you're teaching this semester</p>
          </div>
          <Button onClick={() => toast({ title: "Upload Material", description: "Material upload dialog coming soon" })}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Material
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <Badge variant="outline" className="mb-2">{course.id}</Badge>
                    <CardTitle className="text-xl">{course.name}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-2">
                      <Calendar className="w-3 h-3" />
                      {course.schedule}
                    </CardDescription>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 border rounded-lg">
                    <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{course.students}</p>
                    <p className="text-xs text-muted-foreground">Students</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{course.materials}</p>
                    <p className="text-xs text-muted-foreground">Materials</p>
                  </div>
                  <div className="text-center p-3 border rounded-lg">
                    <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                    <p className="text-2xl font-bold">{course.assignments}</p>
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

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowDetails(true);
                    }}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowManage(true);
                    }}
                  >
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedCourse && (
          <>
            <ViewDetailsDialog
              open={showDetails}
              onOpenChange={setShowDetails}
              title={selectedCourse.name}
              description={`Course Code: ${selectedCourse.id}`}
              details={[
                { label: "Enrolled Students", value: selectedCourse.students },
                { label: "Schedule", value: selectedCourse.schedule },
                { label: "Course Materials", value: selectedCourse.materials },
                { label: "Assignments", value: selectedCourse.assignments },
                { label: "Progress", value: `${selectedCourse.progress}%` },
              ]}
            />
            <ViewDetailsDialog
              open={showManage}
              onOpenChange={setShowManage}
              title={`Manage ${selectedCourse.name}`}
              description="Course management options"
              details={[
                { label: "Students Enrolled", value: selectedCourse.students },
                { label: "Materials Uploaded", value: selectedCourse.materials },
                { label: "Active Assignments", value: selectedCourse.assignments },
                { label: "Schedule", value: selectedCourse.schedule },
              ]}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;
