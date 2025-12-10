import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { GraduationCap, BookOpen, TrendingUp, Plus, Search, Mail, Calendar, Upload, Filter, Download } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddStudentDialog } from "@/components/forms/AddStudentDialog";
import { StudentProfileDialog } from "@/components/StudentProfileDialog";
import { BulkUploadDialog } from "@/components/forms/BulkUploadDialog";
import { formatDate, formatGrade } from "@/lib/formatUtils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Students = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState<any>(null);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");

  interface Student {
    pk: number;
    id: number;
    user_id: number;
    student_id: string;
    enrollment_date: string;
    User: {
      name: string;
      email: string;
    };
    name: string;
    email: string;
    department: string;
    year: number;
    average_score: number;
    enrolled: string;
    className: string;
  }

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const data = await api.get('/admin/users/students');
      // Transform data
      const transformedData = data.map((s: any) => ({
        ...s,
        pk: s.id, // Database Primary Key
        id: s.student_id, // Use student_id for display ID
        name: s.User.name,
        email: s.User.email,
        department: s.specialization || "General",
        year: s.enrollment_year || 1,
        average_score: s.average_score || s.moy || 0,
        enrolled: formatDate(s.enrollment_date || s.createdAt),
        className: s.Class ? s.Class.name : "Unassigned"
      }));
      setStudents(transformedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      toast({
        title: "Error",
        description: "Failed to load students",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    try {
      await api.delete(`/admin/users/students/${id}`);
      toast({
        title: "Student Deleted",
        description: "The student has been removed successfully.",
      });
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete student",
        variant: "destructive"
      });
    }
  };

  const sidebarContent = <UniversityAdminSidebar />;

  const handleAddStudent = () => {
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Students Management">
        <div className="flex items-center justify-center h-full">
          <p>Loading students...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get unique departments, years, and classes for filters
  const departments = Array.from(new Set(students.map(s => s.department)));
  const years = Array.from(new Set(students.map(s => s.year))).sort((a, b) => a - b);
  const classes = Array.from(new Set(students.map(s => s.className))).sort();

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(student.id).toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment === "all" || student.department === selectedDepartment;
    const matchesYear = selectedYear === "all" || String(student.year) === selectedYear;
    const matchesClass = selectedClass === "all" || student.className === selectedClass;

    return matchesSearch && matchesDepartment && matchesYear && matchesClass;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Email", "Department", "Year", "Enrolled Date"];
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map(student => [
        student.id,
        `"${student.name}"`,
        student.email,
        `"${student.department}"`,
        student.year,
        student.enrolled
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "students_export.csv";
    link.click();
    toast({ title: "Export Successful", description: "Students list exported to CSV" });
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredStudents, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "students_export.json";
    link.click();
    toast({ title: "Export Successful", description: "Students list exported to JSON" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Students List", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);

    const tableColumn = ["ID", "Name", "Email", "Department", "Year", "Enrolled"];
    const tableRows = filteredStudents.map(student => [
      student.id,
      student.name,
      student.email,
      student.department,
      student.year,
      student.enrolled
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

    doc.save("students_export.pdf");
    toast({ title: "Export Successful", description: "Students list exported to PDF" });
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
            <div className="flex gap-2">
              <Button onClick={handleAddStudent}>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
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
                    placeholder="Search students by name, ID or email..."
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
                      {(selectedDepartment !== "all" || selectedYear !== "all" || selectedClass !== "all") && (
                        <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                          {(selectedDepartment !== "all" ? 1 : 0) + (selectedYear !== "all" ? 1 : 0) + (selectedClass !== "all" ? 1 : 0)}
                        </Badge>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80" align="end">
                    <div className="grid gap-4">
                      <div className="space-y-2">
                        <h4 className="font-medium leading-none">Filters</h4>
                        <p className="text-sm text-muted-foreground">
                          Refine the students list
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
                        <div className="grid gap-2">
                          <Label htmlFor="year">Year</Label>
                          <Select value={selectedYear} onValueChange={setSelectedYear}>
                            <SelectTrigger id="year">
                              <SelectValue placeholder="Select year" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Years</SelectItem>
                              {years.map(year => (
                                <SelectItem key={year} value={String(year)}>Year {year}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="class">Class</Label>
                          <Select value={selectedClass} onValueChange={setSelectedClass}>
                            <SelectTrigger id="class">
                              <SelectValue placeholder="Select class" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Classes</SelectItem>
                              {classes.map(cls => (
                                <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        {(selectedDepartment !== "all" || selectedYear !== "all" || selectedClass !== "all") && (
                          <Button
                            variant="ghost"
                            className="justify-start px-0 text-muted-foreground"
                            onClick={() => {
                              setSelectedDepartment("all");
                              setSelectedYear("all");
                              setSelectedClass("all");
                            }}
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

          {filteredStudents.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No students found matching your search.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredStudents.map((student) => (
                <Card key={student.pk} className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14">
                          <AvatarFallback className="bg-gradient-primary text-white font-semibold text-lg">
                            {student.name ? student.name.split(' ').map(n => n[0]).join('') : 'S'}
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
                            <span>{student.className}</span>
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
                          <p className="text-sm text-muted-foreground">Moyenne</p>
                          <p className="text-2xl font-bold text-primary">
                            {student.average_score > 20
                              ? formatGrade(student.average_score, 100)
                              : formatGrade(student.average_score, 20)}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Enrolled</p>
                          <p className="text-sm font-medium flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {student.enrolled}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingStudent(student);
                          setShowEditDialog(true);
                        }}
                      >
                        Edit
                      </Button>
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
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(student.pk)}
                      >
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DashboardLayout>

      <AddStudentDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onStudentAdded={fetchStudents}
      />

      <BulkUploadDialog
        open={showUploadDialog}
        onOpenChange={setShowUploadDialog}
        type="student"
        onUploadSuccess={fetchStudents}
      />

      <AddStudentDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        onStudentAdded={fetchStudents}
        editingStudent={editingStudent}
      />

      {selectedStudent && (
        <StudentProfileDialog
          open={showProfile}
          onOpenChange={setShowProfile}
          student={selectedStudent}
          onEdit={(student) => {
            setEditingStudent(student);
            setShowEditDialog(true);
            setShowProfile(false);
          }}
          onDelete={handleDelete}
        />
      )}
    </>
  );
};

export default Students;
