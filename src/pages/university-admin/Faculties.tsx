import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddFacultyDialog } from "@/components/forms/AddFacultyDialog";
import { useState } from "react";

const Faculties = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/university-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/university-admin/faculties" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Faculties
      </NavLink>
      <NavLink to="/dashboard/university-admin/teachers" className="block px-3 py-2 rounded-md hover:bg-muted">
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

  const faculties = [
    { 
      id: 1, 
      name: "Engineering & Technology", 
      departments: ["Computer Science", "Electrical Engineering", "Mechanical Engineering", "Civil Engineering"],
      students: 4523,
      teachers: 145,
      courses: 78
    },
    { 
      id: 2, 
      name: "Business & Economics", 
      departments: ["Business Administration", "Economics", "Finance", "Marketing"],
      students: 3821,
      teachers: 98,
      courses: 56
    },
    { 
      id: 3, 
      name: "Medicine & Health Sciences", 
      departments: ["Medicine", "Nursing", "Pharmacy", "Public Health"],
      students: 2890,
      teachers: 167,
      courses: 92
    },
    { 
      id: 4, 
      name: "Arts & Humanities", 
      departments: ["English Literature", "History", "Philosophy", "Fine Arts"],
      students: 2456,
      teachers: 77,
      courses: 64
    },
  ];

  const handleAddFaculty = () => {
    setShowAddDialog(true);
  };

  return (
    <>
      <AddFacultyDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      <DashboardLayout sidebar={sidebarContent} title="Faculties Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Faculties</h2>
            <p className="text-muted-foreground">Manage your university faculties and departments</p>
          </div>
          <Button onClick={handleAddFaculty}>
            <Plus className="w-4 h-4 mr-2" />
            Add Faculty
          </Button>
        </div>

        <div className="space-y-4">
          {faculties.map((faculty) => (
            <Card key={faculty.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <Building className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{faculty.name}</CardTitle>
                      <CardDescription>{faculty.departments.length} Departments</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => toast({ title: "Edit Faculty", description: "Edit functionality coming soon" })}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => toast({ title: "Delete Faculty", description: "Are you sure you want to delete this faculty?", variant: "destructive" })}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Students</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      {faculty.students.toLocaleString()}
                    </p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Teachers</p>
                    <p className="text-2xl font-bold">{faculty.teachers}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Courses</p>
                    <p className="text-2xl font-bold flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      {faculty.courses}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2">Departments</p>
                  <div className="flex flex-wrap gap-2">
                    {faculty.departments.map((dept, idx) => (
                      <Badge key={idx} variant="secondary">{dept}</Badge>
                    ))}
                  </div>
                </div>

                <Button variant="outline" size="sm" className="w-full" onClick={() => toast({ title: "Faculty Details", description: "Viewing detailed information" })}>
                  View Faculty Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
    </>
  );
};

export default Faculties;
