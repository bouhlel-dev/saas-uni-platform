import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, TrendingUp, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { EditGradeDialog } from "@/components/forms/EditGradeDialog";
import { useState } from "react";

const Grades = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  
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
      <NavLink to="/dashboard/teacher/attendance" className="block px-3 py-2 rounded-md hover:bg-muted">
        Attendance
      </NavLink>
      <NavLink to="/dashboard/teacher/grades" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Grades
      </NavLink>
    </nav>
  );

  const students = [
    { id: "S2024001", name: "John Anderson", course: "CS401", midterm: 88, assignments: 92, final: 85, total: 88, grade: "A" },
    { id: "S2024002", name: "Emma Thompson", course: "CS401", midterm: 95, assignments: 98, final: 93, total: 95, grade: "A+" },
    { id: "S2024003", name: "Michael Chen", course: "CS401", midterm: 78, assignments: 85, final: 80, total: 81, grade: "B+" },
    { id: "S2024004", name: "Sarah Williams", course: "CS401", midterm: 92, assignments: 90, final: 91, total: 91, grade: "A" },
    { id: "S2024005", name: "David Martinez", course: "CS401", midterm: 85, assignments: 88, final: 87, total: 87, grade: "A-" },
  ];

  const handleEditGrade = (student: any) => {
    setSelectedStudent(student);
    setShowEditDialog(true);
  };

  return (
    <>
      {selectedStudent && (
        <EditGradeDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          student={selectedStudent}
        />
      )}
      <DashboardLayout sidebar={sidebarContent} title="Grades Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Student Grades</h2>
            <p className="text-muted-foreground">Manage and input student grades</p>
          </div>
          <Button>
            <FileText className="w-4 h-4 mr-2" />
            Export Grades
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search students..." className="pl-10" />
              </div>
              <Button variant="outline">Filter by Course</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>CS401 - Advanced Machine Learning</CardTitle>
                <CardDescription>Grades for 45 students</CardDescription>
              </div>
              <Badge variant="secondary">Spring 2024</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{student.name}</p>
                        <Badge variant="outline" className="text-xs">{student.id}</Badge>
                      </div>
                      <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                        <span>Midterm: {student.midterm}%</span>
                        <span>Assignments: {student.assignments}%</span>
                        <span>Final: {student.final}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <p className="text-2xl font-bold">{student.total}%</p>
                      </div>
                    </div>
                    <div className="text-center min-w-[60px]">
                      <p className="text-sm text-muted-foreground mb-1">Grade</p>
                      <Badge variant="default" className="text-lg px-3 py-1">{student.grade}</Badge>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => handleEditGrade(student)}>Edit</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
    </>
  );
};

export default Grades;
