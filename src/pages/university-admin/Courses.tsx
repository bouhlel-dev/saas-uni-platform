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

const Courses = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingCourse, setEditingCourse] = useState<any>(null);
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showManage, setShowManage] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedTeacher, setSelectedTeacher] = useState("all");

  interface Course {
    id: number;
    code: string;
    name: string;
    department: string;
    teacher: string;
    students: number;
    credits: number;
    schedule: string;
  }

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await api.get('/admin/courses');
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: "Error",
        description: "Failed to load courses",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this course?")) return;

    try {
      await api.delete(`/courses/${id}`);
      toast({
        title: "Course Deleted",
        description: "The course has been removed successfully.",
      });
      fetchCourses(); // Refresh list
    } catch (error) {
      console.error('Error deleting course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete course",
        variant: "destructive"
      });
    }
  };

  const sidebarContent = <UniversityAdminSidebar />;

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Courses Management">
        <div className="flex items-center justify-center h-full">
          <p>Loading courses...</p>
        </div>
      </DashboardLayout>
    );
  }

  // Get unique departments and teachers for filters
  const departments = Array.from(new Set(courses.map(c => c.department)));
  const teachers = Array.from(new Set(courses.map(c => c.teacher)));

  const filteredCourses = courses.filter(course => {
    const matchesSearch =
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.teacher.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment = selectedDepartment === "all" || course.department === selectedDepartment;
    const matchesTeacher = selectedTeacher === "all" || course.teacher === selectedTeacher;

    return matchesSearch && matchesDepartment && matchesTeacher;
  });

  const handleExportCSV = () => {
    const headers = ["ID", "Code", "Name", "Department", "Teacher", "Credits", "Schedule"];
    const csvContent = [
      headers.join(","),
      ...filteredCourses.map(course => [
        course.id,
        course.code,
        `"${course.name}"`,
        `"${course.department}"`,
        `"${course.teacher}"`,
        course.credits,
        `"${course.schedule}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "courses_export.csv";
    link.click();
    toast({ title: "Export Successful", description: "Courses list exported to CSV" });
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredCourses, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "courses_export.json";
    link.click();
    toast({ title: "Export Successful", description: "Courses list exported to JSON" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Courses List", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);

    const tableColumn = ["ID", "Code", "Name", "Department", "Teacher", "Credits", "Schedule"];
    const tableRows = filteredCourses.map(course => [
      course.id,
      course.code,
      course.name,
      course.department,
      course.teacher,
      course.credits,
      course.schedule
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

    doc.save("courses_export.pdf");
    toast({ title: "Export Successful", description: "Courses list exported to PDF" });
  };

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
                <Input
                  placeholder="Search courses by name, code, department or teacher..."
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
                    {(selectedDepartment !== "all" || selectedTeacher !== "all") && (
                      <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                        {(selectedDepartment !== "all" ? 1 : 0) + (selectedTeacher !== "all" ? 1 : 0)}
                      </Badge>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80" align="end">
                  <div className="grid gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Filters</h4>
                      <p className="text-sm text-muted-foreground">
                        Refine the courses list
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
                        <Label htmlFor="teacher">Teacher</Label>
                        <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                          <SelectTrigger id="teacher">
                            <SelectValue placeholder="Select teacher" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Teachers</SelectItem>
                            {teachers.map(teacher => (
                              <SelectItem key={teacher} value={teacher}>{teacher}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {(selectedDepartment !== "all" || selectedTeacher !== "all") && (
                        <Button
                          variant="ghost"
                          className="justify-start px-0 text-muted-foreground"
                          onClick={() => {
                            setSelectedDepartment("all");
                            setSelectedTeacher("all");
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

        {filteredCourses.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-muted-foreground">No courses found matching your search.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
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
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setEditingCourse(course);
                        setShowEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(course.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <AddCourseDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onCourseAdded={fetchCourses}
        />

        <AddCourseDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onCourseAdded={fetchCourses}
          editingCourse={editingCourse}
        />

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
