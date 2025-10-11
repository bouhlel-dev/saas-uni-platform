import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, BookOpen, Users, Plus, Search, Mail, Phone } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddTeacherDialog } from "@/components/forms/AddTeacherDialog";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";

const Teachers = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/university-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/university-admin/faculties" className="block px-3 py-2 rounded-md hover:bg-muted">
        Faculties
      </NavLink>
      <NavLink to="/dashboard/university-admin/teachers" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Teachers
      </NavLink>
      <NavLink to="/dashboard/university-admin/students" className="block px-3 py-2 rounded-md hover:bg-muted">
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

  const teachers = [
    { id: 1, name: "Dr. Sarah Smith", department: "Computer Science", email: "sarah.smith@uni.edu", phone: "+1 555-0101", courses: 4, students: 234 },
    { id: 2, name: "Dr. Michael Johnson", department: "Computer Science", email: "m.johnson@uni.edu", phone: "+1 555-0102", courses: 3, students: 189 },
    { id: 3, name: "Dr. Emily Williams", department: "Business Administration", email: "e.williams@uni.edu", phone: "+1 555-0103", courses: 5, students: 312 },
    { id: 4, name: "Dr. Robert Brown", department: "Medicine", email: "r.brown@uni.edu", phone: "+1 555-0104", courses: 6, students: 156 },
    { id: 5, name: "Dr. Lisa Davis", department: "Engineering", email: "l.davis@uni.edu", phone: "+1 555-0105", courses: 4, students: 203 },
    { id: 6, name: "Dr. James Wilson", department: "Economics", email: "j.wilson@uni.edu", phone: "+1 555-0106", courses: 3, students: 178 },
  ];

  const handleAddTeacher = () => {
    setShowAddDialog(true);
  };

  return (
    <>
      <AddTeacherDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <DashboardLayout sidebar={sidebarContent} title="Teachers Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Teachers</h2>
            <p className="text-muted-foreground">Manage teaching staff across all departments</p>
          </div>
          <Button onClick={handleAddTeacher}>
            <Plus className="w-4 h-4 mr-2" />
            Add Teacher
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search teachers..." className="pl-10" />
              </div>
              <Button variant="outline" onClick={() => toast({ title: "Filter", description: "Department filter coming soon" })}>Filter by Department</Button>
              <Button variant="outline" onClick={() => toast({ title: "Exporting", description: "Downloading teachers list..." })}>Export</Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {teacher.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{teacher.name}</CardTitle>
                    <CardDescription>{teacher.department}</CardDescription>
                    <Badge variant="secondary" className="mt-2">Active</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{teacher.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{teacher.phone}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <div className="p-2 border rounded text-center">
                    <p className="text-xs text-muted-foreground">Courses</p>
                    <p className="text-lg font-bold flex items-center justify-center gap-1">
                      <BookOpen className="w-4 h-4 text-primary" />
                      {teacher.courses}
                    </p>
                  </div>
                  <div className="p-2 border rounded text-center">
                    <p className="text-xs text-muted-foreground">Students</p>
                    <p className="text-lg font-bold">{teacher.students}</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => {
                    setSelectedTeacher(teacher);
                    setShowProfile(true);
                  }}
                >
                  View Profile
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedTeacher && (
          <ViewDetailsDialog
            open={showProfile}
            onOpenChange={setShowProfile}
            title={selectedTeacher.name}
            description="Teacher Profile"
            details={[
              { label: "Department", value: selectedTeacher.department },
              { label: "Email", value: selectedTeacher.email },
              { label: "Phone", value: selectedTeacher.phone },
              { label: "Status", value: "Active", badge: true },
              { label: "Courses Teaching", value: selectedTeacher.courses },
              { label: "Total Students", value: selectedTeacher.students },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
    </>
  );
};

export default Teachers;
