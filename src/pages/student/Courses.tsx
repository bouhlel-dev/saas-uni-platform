import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, Calendar, FileText, Search, Download, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/formatUtils";
import { StudentSidebar } from "@/components/StudentSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CourseDetailsDialog } from "@/components/CourseDetailsDialog";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Courses = () => {
  const sidebarContent = <StudentSidebar />;

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showCourseDialog, setShowCourseDialog] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get('/student/courses');

        // Map backend data to frontend structure
        const mappedCourses = data.map((c: any) => {
          const schedule = c.Schedules && c.Schedules[0];
          const teacherName = schedule?.Teacher?.User?.name || "Unknown Teacher";
          const scheduleTime = schedule ? `${schedule.day} ${schedule.time}` : "TBA";
          const room = schedule?.room || "TBA";

          return {
            id: c.id,
            code: c.code || `C${c.id}`,
            name: c.title,
            description: c.description,
            teacher: teacherName,
            credits: c.credits || 3,
            schedule: scheduleTime,
            room: room,
            progress: c.progress || 0,
            grade: c.studentGrade !== 'N/A' ? c.studentGrade : "N/A",
            materials: c.materialsCount || 0,
            assignments: c.assignmentsCount || 0
          };
        });
        setCourses(mappedCourses);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.teacher.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["Code", "Name", "Teacher", "Credits", "Schedule", "Room", "Grade", "Progress"];
    const csvContent = [
      headers.join(","),
      ...filteredCourses.map(course => [
        course.code,
        `"${course.name}"`,
        `"${course.teacher}"`,
        course.credits,
        `"${course.schedule}"`,
        `"${course.room}"`,
        course.grade,
        `${course.progress}%`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my_courses_export.csv";
    link.click();
    toast({ title: "Export Successful", description: "Courses list exported to CSV" });
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(filteredCourses, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "my_courses_export.json";
    link.click();
    toast({ title: "Export Successful", description: "Courses list exported to JSON" });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("My Courses List", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${formatDate(new Date())}`, 14, 30);

    const tableColumn = ["Code", "Name", "Teacher", "Credits", "Schedule", "Grade"];
    const tableRows = filteredCourses.map(course => [
      course.code,
      course.name,
      course.teacher,
      course.credits,
      course.schedule,
      course.grade
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

    doc.save("my_courses_export.pdf");
    toast({ title: "Export Successful", description: "Courses list exported to PDF" });
  };

  if (loading) return <div className="p-8 text-center">Loading courses...</div>;

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Courses">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Courses</h2>
          <p className="text-muted-foreground">Your enrolled courses for this semester</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses by name, code or teacher..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
          <div className="grid gap-6 md:grid-cols-2">
            {filteredCourses.map((course: any) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{course.code}</Badge>
                        <Badge variant="secondary">{course.credits} Credits</Badge>
                      </div>
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                      <CardDescription>{course.teacher}</CardDescription>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Room {course.room}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{course.materials}</p>
                      <p className="text-xs text-muted-foreground">Materials</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-xl font-bold">{course.assignments}</p>
                      <p className="text-xs text-muted-foreground">Assignments</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Progress value={course.progress} />
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setSelectedCourse(course);
                      setShowCourseDialog(true);
                    }}
                  >
                    View Course Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <CourseDetailsDialog
        open={showCourseDialog}
        onOpenChange={setShowCourseDialog}
        course={selectedCourse}
      />
    </DashboardLayout>
  );
};

export default Courses;
