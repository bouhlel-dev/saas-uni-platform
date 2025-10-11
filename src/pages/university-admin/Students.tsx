import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, BookOpen, TrendingUp, Plus, Search, Mail, Calendar } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddStudentDialog } from "@/components/forms/AddStudentDialog";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";

const Students = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  
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
      <NavLink to="/dashboard/university-admin/students" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Students
      </NavLink>
      <NavLink to="/dashboard/university-admin/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        Courses
      </NavLink>
      <NavLink to="/dashboard/university-admin/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const students = [
    { id: "S2024001", name: "John Anderson", department: "Computer Science", year: 3, email: "john.a@uni.edu", gpa: 3.85, enrolled: "2022-09-01" },
    { id: "S2024002", name: "Emma Thompson", department: "Business Administration", year: 2, email: "emma.t@uni.edu", gpa: 3.92, enrolled: "2023-09-01" },
    { id: "S2024003", name: "Michael Chen", department: "Engineering", year: 4, email: "michael.c@uni.edu", gpa: 3.76, enrolled: "2021-09-01" },
    { id: "S2024004", name: "Sarah Williams", department: "Medicine", year: 1, email: "sarah.w@uni.edu", gpa: 3.95, enrolled: "2024-09-01" },
    { id: "S2024005", name: "David Martinez", department: "Computer Science", year: 3, email: "david.m@uni.edu", gpa: 3.68, enrolled: "2022-09-01" },
    { id: "S2024006", name: "Lisa Johnson", department: "Economics", year: 2, email: "lisa.j@uni.edu", gpa: 3.88, enrolled: "2023-09-01" },
  ];

  const handleAddStudent = () => {
    setShowAddDialog(true);
  };

  return (
    <>
      <AddStudentDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <DashboardLayout sidebar={sidebarContent} title="Students Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Students</h2>
            <p className="text-muted-foreground">Manage student records and enrollment</p>
          </div>
          <Button onClick={handleAddStudent}>
            <Plus className="w-4 h-4 mr-2" />
            Add Student
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search students by name or ID..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => toast({ title: "Filter", description: "Filter options coming soon" })}>Filter</Button>
              <Button variant="outline" onClick={() => toast({ title: "Exporting", description: "Downloading students list..." })}>Export</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {students.map((student) => (
            <Card key={student.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="w-14 h-14">
                      <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <Badge variant="outline">{student.id}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" />
                          {student.department}
                        </span>
                        <span>Year {student.year}</span>
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">GPA</p>
                      <p className="text-2xl font-bold text-primary">{student.gpa}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">Enrolled</p>
                      <p className="text-sm font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {student.enrolled}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedStudent(student);
                        setShowProfile(true);
                      }}
                    >
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedStudent && (
          <ViewDetailsDialog
            open={showProfile}
            onOpenChange={setShowProfile}
            title={selectedStudent.name}
            description="Student Profile"
            details={[
              { label: "Student ID", value: selectedStudent.id },
              { label: "Email", value: selectedStudent.email },
              { label: "Department", value: selectedStudent.department },
              { label: "Year", value: selectedStudent.year },
              { label: "Status", value: "Active", badge: true },
              { label: "GPA", value: selectedStudent.gpa },
              { label: "Enrolled Date", value: selectedStudent.enrolled },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
    </>
  );
};

export default Students;
