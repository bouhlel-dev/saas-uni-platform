import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { BookOpen, Users, FileText, Calendar, Upload, Search, Download, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CourseDetailsDialog } from "@/components/CourseDetailsDialog";
import { ManageCourseDialog } from "@/components/ManageCourseDialog";
import { UploadMaterialDialog } from "@/components/UploadMaterialDialog";
import { formatDate } from "@/lib/formatUtils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { TeacherSidebar } from "@/components/TeacherSidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const MyCourses = () => {
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showManage, setShowManage] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sidebarContent = <TeacherSidebar />;

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await api.get('/teacher/courses');

        console.log("Teacher courses response:", data);

        const mappedCourses = data.map((c: any) => {
          return {
            id: `CS${c.id}`,
            name: c.title,
            students: parseInt(c.studentCount) || 0,
            schedule: c.schedule || "TBD", // Use schedule from backend if available, else TBD
            materials: parseInt(c.materialsCount) || parseInt(c.dataValues?.materialsCount) || 0,
            assignments: parseInt(c.assignmentCount) || 0,
            progress: c.progress || 0
          };
        });

        setCourses(mappedCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter(course =>
    course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Schedule", "Students", "Materials", "Assignments", "Progress"];
    const csvContent = [
      headers.join(","),
      ...filteredCourses.map(course => [
        course.id,
        `"${course.name}"`,
        `"${course.schedule}"`,
        course.students,
        course.materials,
        course.assignments,
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

    const tableColumn = ["ID", "Name", "Schedule", "Students", "Materials", "Assignments", "Progress"];
    const tableRows = filteredCourses.map(course => [
      course.id,
      course.name,
      course.schedule,
      course.students,
      course.materials,
      course.assignments,
      `${course.progress}%`
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Courses</h2>
            <p className="text-muted-foreground">Courses you're teaching this semester</p>
          </div>
          <Button onClick={() => {
            if (filteredCourses.length > 0) {
              setShowUploadDialog(true);
            } else {
              toast({ title: "No Courses", description: "You don't have any courses to upload to.", variant: "destructive" });
            }
          }}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Material
          </Button>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses by name or ID..."
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
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="outline" className="mb-2">{course.id}</Badge>
                      <CardTitle className="text-xl">{course.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-2">
                        <Calendar className="w-3 h-3" />
                        {course.schedule}
                      </CardDescription>
                    </div>
                    <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 border rounded-lg">
                      <Users className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">{course.students}</p>
                      <p className="text-xs text-muted-foreground">Students</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">{course.materials}</p>
                      <p className="text-xs text-muted-foreground">Materials</p>
                    </div>
                    <div className="text-center p-3 border rounded-lg">
                      <FileText className="w-4 h-4 mx-auto mb-1 text-primary" />
                      <p className="text-2xl font-bold">{course.assignments}</p>
                      <p className="text-xs text-muted-foreground">Assignments</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Course Progress</span>
                      <span className="font-medium">{course.progress}%</span>
                    </div>
                    <Slider
                      defaultValue={[course.progress]}
                      max={100}
                      step={1}
                      onValueCommit={(value) => {
                        // Optimistic update
                        const newProgress = value[0];
                        const updatedCourses = courses.map(c =>
                          c.id === course.id ? { ...c, progress: newProgress } : c
                        );
                        setCourses(updatedCourses);

                        // API call
                        api.put(`/teacher/courses/${course.id.replace(/\D/g, '')}/progress`, { progress: newProgress })
                          .then(() => {
                            toast({ title: "Success", description: "Course progress updated" });
                          })
                          .catch((err) => {
                            console.error("Failed to update progress", err);
                            toast({ title: "Error", description: "Failed to update progress", variant: "destructive" });
                            // Revert on error (optional, but good practice)
                          });
                      }}
                      className="cursor-pointer"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowManage(true);
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {selectedCourse && (
          <>
            <CourseDetailsDialog
              open={showDetails}
              onOpenChange={setShowDetails}
              course={selectedCourse}
            />
            <ManageCourseDialog
              open={showManage}
              onOpenChange={setShowManage}
              course={selectedCourse}
              onUploadMaterial={() => {
                setSelectedCourse(selectedCourse);
                setShowUploadDialog(true);
              }}
              onCreateAssignment={() => {
                // Navigate to assignments page or show create assignment dialog
                toast({ title: "Create Assignment", description: "This feature will be available soon" });
              }}
              onViewGrades={() => {
                // Navigate to grades page
                toast({ title: "View Grades", description: "This feature will be available soon" });
              }}
              onAttendance={() => {
                // Navigate to attendance page
                toast({ title: "Attendance", description: "This feature will be available soon" });
              }}
            />
          </>
        )}

        <UploadMaterialDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          courses={filteredCourses.map(c => ({ id: c.id, name: c.name }))}
          preSelectedCourseId={selectedCourse?.id}
          onSuccess={() => {
            // Optional: Refresh courses to update material count
            // fetchCourses();
          }}
        />
      </div>
    </DashboardLayout>
  );
};

export default MyCourses;
