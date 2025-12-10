import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building, Users, BookOpen, Plus, Edit, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddFacultyDialog } from "@/components/forms/AddFacultyDialog";
import { FacultyDetailsDialog } from "@/components/FacultyDetailsDialog";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";

const Faculties = () => {
  interface Department {
    id: number;
    name: string;
    students: number;
    teachers: number;
    courses: number;
  }

  interface Faculty {
    id: number;
    name: string;
    departments: Department[];
    students: number;
    teachers: number;
    courses: number;
  }

  const [faculties, setFaculties] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [selectedFaculty, setSelectedFaculty] = useState<Faculty | null>(null);

  const fetchFaculties = async () => {
    try {
      const data = await api.get('/admin/faculties');
      setFaculties(data);
    } catch (error) {
      console.error('Error fetching faculties:', error);
      toast({
        title: "Error",
        description: "Failed to load faculties",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}? This will also delete all departments and courses in this faculty.`)) return;

    try {
      await api.delete(`/admin/faculties/${id}`);
      toast({
        title: "Faculty Deleted",
        description: `${name} has been removed successfully.`,
      });
      fetchFaculties();
    } catch (error) {
      console.error('Error deleting faculty:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete faculty",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (faculty: Faculty) => {
    setEditingFaculty(faculty);
    setShowEditDialog(true);
  };

  const handleViewDetails = (faculty: Faculty) => {
    setSelectedFaculty(faculty);
    setShowDetailsDialog(true);
  };

  const sidebarContent = <UniversityAdminSidebar />;

  const handleAddFaculty = () => {
    setEditingFaculty(null); // Ensure editingFaculty is null when adding
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Faculties Management">
        <div className="flex items-center justify-center h-full">
          <p>Loading faculties...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <>
      <AddFacultyDialog
        open={showAddDialog || showEditDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          setShowEditDialog(open);
          if (!open) setEditingFaculty(null);
        }}
        onFacultyAdded={fetchFaculties}
        editingFaculty={editingFaculty}
      />

      <FacultyDetailsDialog
        open={showDetailsDialog}
        onOpenChange={setShowDetailsDialog}
        faculty={selectedFaculty}
      />

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

          {faculties.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No faculties found. Add one to get started.</p>
            </div>
          ) : (
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
                        <Button variant="outline" size="icon" onClick={() => handleEdit(faculty)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleDelete(faculty.id, faculty.name)}>
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
                        {faculty.departments.map((dept) => (
                          <Badge key={dept.id} variant="secondary">{dept.name}</Badge>
                        ))}
                      </div>
                    </div>

                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleViewDetails(faculty)}>
                      View Faculty Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

      </DashboardLayout>
    </>
  );
};

export default Faculties;
