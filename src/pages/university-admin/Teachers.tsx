import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, BookOpen, Users, Plus, Search, Mail, Phone, Upload } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddTeacherDialog } from "@/components/forms/AddTeacherDialog";
import { TeacherProfileDialog } from "@/components/TeacherProfileDialog";
import { BulkUploadDialog } from "@/components/forms/BulkUploadDialog";
import { formatDate } from "@/lib/formatUtils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Teachers = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<any>(null);
  const [selectedTeacher, setSelectedTeacher] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  interface Teacher {
    id: number;
    user_id: number;
    specialization: string;
    hire_date: string;
    User: {
      name: string;
      email: string;
    };
    name: string;
    email: string;
    department: string;
    phone: string;
    courses: number;
    students: number;
  }

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const data = await api.get('/admin/users/teachers');
      // Transform data
      const transformedData = data.map((t: any) => ({
        ...t,
        name: t.User.name,
        email: t.User.email,
        department: t.specialization || "General",
        phone: "+1 (555) 000-0000", // Placeholder
        courses: 0, // Placeholder
        students: 0  // Placeholder
      }));
      setTeachers(transformedData);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      toast({
        title: "Error",
        description: "Failed to load teachers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;

    try {
      await api.delete(`/admin/users/teachers/${id}`);
      toast({
        title: "Teacher Deleted",
        description: "The teacher has been removed successfully.",
      });
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete teacher",
        variant: "destructive"
      });
    }
  };

  const sidebarContent = <UniversityAdminSidebar />;

  const handleAddTeacher = () => {
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Teachers Management">
        <div className="flex items-center justify-center h-full">
          <p>Loading teachers...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get unique departments for filters
  const departments = Array.from(new Set(teachers.map(t => t.department)));

  const filteredTeachers = teachers.filter(teacher => {
    const matchesSearch =
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.specialization.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment === "all" || teacher.department === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Department", "Phone"];
    const csvContent = [
      headers.join(","),
      ...filteredTeachers.map(teacher => [
        teacher.id,
        `"${teacher.name}"`,
        teacher.email,
        `"${teacher.department}"`,
        teacher.phone
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "teachers_export.csv";
    link.click();
    toast({ title: "Export Successful", description: "Teachers list exported to CSV" });
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredTeachers, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "teachers_export.json";
    link.click();
    toast({ title: "Export Successful", description: "Teachers list exported to JSON" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Teachers List", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);

    const tableColumn = ["ID", "Name", "Email", "Department", "Phone"];
    const tableRows = filteredTeachers.map(teacher => [
      teacher.id,
      teacher.name,
      teacher.email,
      teacher.department,
      teacher.phone
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] }
    });

    doc.save("teachers_export.pdf");
    toast({ title: "Export Successful", description: "Teachers list exported to PDF" });
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
            <div className="flex gap-2">
              <Button onClick={handleAddTeacher}>
                <Plus className="w-4 h-4 mr-2" />
                Add Teacher
              </Button>
              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="w-4 h-4 mr-2" />
                Import CSV
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search teachers by name, email or department..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Filter className="w-4 h-4" />
                      Filter
                      {selectedDepartment !== "all" && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                          1
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Filters</h4>
                        <p className="text-sm text-muted-foreground">
                          Refine the teachers list
                        </p>
                      </div>
                      <div className="grid gap-2">
                        <div className="grid gap-2">
                          <Label htmlFor="department">Department</Label>
                          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                            <SelectTrigger id="department">
                              <SelectValue placeholder="Select department" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Departments</SelectItem>
                              {departments.map(dept => (
                                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {selectedDepartment !== "all" && (
                          <Button
                            variant="ghost"
                            className="justify-start px-0 text-muted-foreground"
                            onClick={() => setSelectedDepartment("all")}
                          >
                            Reset filters
                          </Button>
                        )}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportCSV}>
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportJSON}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportPDF}>
                      Export as PDF
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>

          {filteredTeachers.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No teachers found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredTeachers.map((teacher) => (
                <Card key={teacher.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                          {teacher.name ? teacher.name.split(' ').map(n => n[0]).join('') : 'T'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{teacher.name}</CardTitle>
                        <CardDescription>{teacher.specialization}</CardDescription>
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
                        <span>{teacher.phone || 'N/A'}</span>
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
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingTeacher(teacher);
                          setShowEditDialog(true);
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedTeacher({
                            ...teacher,
                            department: teacher.specialization,
                            phone: teacher.phone || 'N/A'
                          });
                          setShowProfile(true);
                        }}
                      >
                        View Profile
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(teacher.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <AddTeacherDialog
            open={showAddDialog}
            onOpenChange={setShowAddDialog}
            onTeacherAdded={fetchTeachers}
          />

          <BulkUploadDialog
            open={showUploadDialog}
            onOpenChange={setShowUploadDialog}
            type="teacher"
            onUploadSuccess={fetchTeachers}
          />

          <AddTeacherDialog
            open={showEditDialog}
            onOpenChange={setShowEditDialog}
            onTeacherAdded={fetchTeachers}
            editingTeacher={editingTeacher}
          />

          {selectedTeacher && (
            <TeacherProfileDialog
              open={showProfile}
              onOpenChange={setShowProfile}
              teacher={selectedTeacher}
              onEdit={(teacher) => {
                setEditingTeacher(teacher);
                setShowEditDialog(true);
                setShowProfile(false);
              }}
              onDelete={handleDelete}
            />
          )}
        </div>
      </DashboardLayout>
    </>
  );
};

export default Teachers;
