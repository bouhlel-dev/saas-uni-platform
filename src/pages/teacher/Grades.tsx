import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Search, TrendingUp, FileText, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { EditGradeDialog } from "@/components/forms/EditGradeDialog";
import { formatDate } from "@/lib/formatUtils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Grades = () => {
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("all");

  const sidebarContent = <TeacherSidebar />;

  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get('/teacher/courses');
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId(String(data[0].id));
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;

    const fetchGrades = async () => {
      setLoading(true);
      try {
        const data = await api.get(`/teacher/courses/${selectedCourseId}/grades`);

        const mappedStudents = data.map((s: any) => ({
          id: `S${s.id}`,
          name: s.name,
          course: `CS${s.course}`,
          className: s.className || "Unassigned",
          midterm: s.midterm,
          assignments: s.assignments,
          final: s.final,
          total: s.total,
          grade: s.grade
        }));
        setStudents(mappedStudents);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load grades", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, [selectedCourseId]);

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClass = selectedClass === "all" || student.className === selectedClass;
    return matchesSearch && matchesClass;
  });

  const classes = Array.from(new Set(students.map(s => s.className))).sort();

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Class", "Midterm (/20)", "Assignments (/20)", "Final (/20)", "Total (/20)", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredStudents.map(student => [
        student.id,
        `"${student.name}"`,
        `"${student.className}"`,
        student.midterm,
        student.assignments,
        student.final,
        student.total,
        student.total >= 10 ? "Passing" : "Failing"
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "grades_export.csv";
    link.click();
    toast({ title: "Export Successful", description: "Grades exported to CSV" });
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredStudents, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "grades_export.json";
    link.click();
    toast({ title: "Export Successful", description: "Grades exported to JSON" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Student Grades (Scale: /20)", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);

    const tableColumn = ["ID", "Name", "Class", "Midterm", "Assignments", "Final", "Total", "Status"];
    const tableRows = filteredStudents.map(student => [
      student.id,
      student.name,
      student.className,
      `${student.midterm}/20`,
      `${student.assignments}/20`,
      `${student.final}/20`,
      `${student.total}/20`,
      student.total >= 10 ? "Passing" : "Failing"
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

    doc.save("grades_export.pdf");
    toast({ title: "Export Successful", description: "Grades exported to PDF" });
  };

  if (loading && !students.length) return <div className="p-8 text-center">Loading grades...</div>;

  const handleEditGrade = (student: any) => {
    setSelectedStudent(student);
    setShowEditDialog(true);
  };

  const handleGradeSaved = () => {
    // Refetch grades after saving
    if (selectedCourseId) {
      const fetchGrades = async () => {
        try {
          const data = await api.get(`/teacher/courses/${selectedCourseId}/grades`);
          const mappedStudents = data.map((s: any) => ({
            id: `S${s.id}`,
            name: s.name,
            course: `CS${s.course}`,
            className: s.className || "Unassigned",
            midterm: s.midterm,
            assignments: s.assignments,
            final: s.final,
            total: s.total,
            grade: s.grade
          }));
          setStudents(mappedStudents);
        } catch (error) {
          console.error(error);
        }
      };
      fetchGrades();
    }
  };

  const currentCourse = courses.find(c => String(c.id) === selectedCourseId);

  return (
    <>
      {selectedStudent && selectedCourseId && (
        <EditGradeDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          student={selectedStudent}
          courseId={selectedCourseId}
          onSave={handleGradeSaved}
        />
      )}
      <DashboardLayout sidebar={sidebarContent} title="Grades Management">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Student Grades</h2>
              <p className="text-muted-foreground">Manage and input student grades</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Download className="w-4 h-4" />
                  Export Grades
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

          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search students..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCourseId || ""} onValueChange={setSelectedCourseId}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map(course => (
                        <SelectItem key={course.id} value={String(course.id)}>
                          {course.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedClass} onValueChange={setSelectedClass}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Filter by Class" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {classes.map(cls => (
                        <SelectItem key={cls} value={cls}>
                          {cls}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{currentCourse?.title || "Select a Course"}</CardTitle>
                  <CardDescription>Grades for {filteredStudents.length} students</CardDescription>
                </div>
                <Badge variant="secondary">Spring 2024</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredStudents.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No students found matching filters.</p>
                ) : (
                  filteredStudents.map((student) => (
                    <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-10 h-10">
                          <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                            {student.name.split(' ').map((n: string) => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{student.name}</p>
                            <Badge variant="outline" className="text-xs">{student.id}</Badge>
                            <Badge variant="secondary" className="text-xs">{student.className}</Badge>
                          </div>
                          <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                            <span>Midterm: {student.midterm}/20</span>
                            <span>Assignments: {student.assignments}/20</span>
                            <span>Final: {student.final}/20</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-sm text-muted-foreground">Total</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className={`w-4 h-4 ${student.total >= 10 ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`} />
                            <p className={`text-2xl font-bold ${student.total < 10 ? 'text-red-600' : ''}`}>{student.total}</p>
                            <span className="text-sm text-muted-foreground">/20</span>
                          </div>
                        </div>
                        <div className="text-center min-w-[80px]">
                          <p className="text-sm text-muted-foreground mb-1">Status</p>
                          <Badge variant={student.total >= 10 ? "default" : "destructive"} className="text-sm px-3 py-1">
                            {student.total >= 10 ? 'Passing' : 'Failing'}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => handleEditGrade(student)}>Edit</Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Grades;
