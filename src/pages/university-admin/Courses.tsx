import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, Clock, Plus, Search } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddCourseDialog } from "@/components/forms/AddCourseDialog";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";

const Courses = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showManage, setShowManage] = useState(false);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/university-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
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
      <NavLink to="/dashboard/university-admin/courses" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Courses
      </NavLink>
      <NavLink to="/dashboard/university-admin/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const courses = [
    { code: "CS401", name: "Advanced Machine Learning", department: "Computer Science", teacher: "Dr. Sarah Smith", students: 45, credits: 4, schedule: "Mon, Wed 10:00-11:30" },
    { code: "CS302", name: "Data Structures & Algorithms", department: "Computer Science", teacher: "Dr. Michael Johnson", students: 67, credits: 4, schedule: "Tue, Thu 14:00-15:30" },
    { code: "BUS201", name: "Financial Accounting", department: "Business", teacher: "Dr. Emily Williams", students: 89, credits: 3, schedule: "Mon, Wed, Fri 09:00-10:00" },
    { code: "MED301", name: "Clinical Medicine", department: "Medicine", teacher: "Dr. Robert Brown", students: 52, credits: 5, schedule: "Tue, Thu 10:00-12:00" },
    { code: "ENG202", name: "Thermodynamics", department: "Engineering", teacher: "Dr. Lisa Davis", students: 43, credits: 4, schedule: "Mon, Wed 15:00-16:30" },
    { code: "ECON301", name: "Macroeconomics", department: "Economics", teacher: "Dr. James Wilson", students: 71, credits: 3, schedule: "Tue, Thu 13:00-14:30" },
  ];


  return (
    <DashboardLayout sidebar={sidebarContent} title="Courses Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Courses</h2>
            <p className="text-muted-foreground">Manage course catalog and assignments</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Course
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search courses..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => toast({ title: "Filter", description: "Department filter coming soon" })}>
                Filter by Department
              </Button>
              <Button variant="outline" onClick={() => toast({ title: "Export Started", description: "Downloading courses report..." })}>
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.code} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{course.code}</Badge>
                      <Badge variant="secondary">{course.credits} Credits</Badge>
                    </div>
                    <CardTitle className="text-lg">{course.name}</CardTitle>
                    <CardDescription>{course.department}</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Teacher</span>
                    <span className="font-medium">{course.teacher}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Enrolled Students</span>
                    <span className="font-medium flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Schedule</span>
                    <span className="font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.schedule}
                    </span>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => {
                    setSelectedCourse(course);
                    setShowManage(true);
                  }}
                >
                  Manage Course
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <AddCourseDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
        
        {selectedCourse && (
          <ViewDetailsDialog
            open={showManage}
            onOpenChange={setShowManage}
            title={`Manage ${selectedCourse.name}`}
            description={`Course Code: ${selectedCourse.code}`}
            details={[
              { label: "Department", value: selectedCourse.department },
              { label: "Teacher", value: selectedCourse.teacher },
              { label: "Enrolled Students", value: selectedCourse.students },
              { label: "Credits", value: selectedCourse.credits },
              { label: "Schedule", value: selectedCourse.schedule },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default Courses;
