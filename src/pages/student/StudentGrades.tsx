import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { TrendingUp, Download, Award, ChevronDown, ChevronRight, BookOpen, FileText } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StudentSidebar } from "@/components/StudentSidebar";
import { formatDate } from "@/lib/formatUtils";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface GradeItem {
  id: number;
  score: number;
  comment: string;
  date: string;
  type: string;
}

interface CourseWithGrades {
  courseId: number;
  code: string;
  name: string;
  credits: number;
  grades: GradeItem[];
  average: number;
}

const StudentGrades = () => {
  const sidebarContent = <StudentSidebar />;

  const [courseGrades, setCourseGrades] = useState<CourseWithGrades[]>([]);
  const [loading, setLoading] = useState(true);
  const [gpa, setGpa] = useState("N/A");
  const [totalCredits, setTotalCredits] = useState(0);
  const [expandedCourses, setExpandedCourses] = useState<Set<number>>(new Set());

  const toggleCourse = (courseId: number) => {
    setExpandedCourses(prev => {
      const newSet = new Set(prev);
      if (newSet.has(courseId)) {
        newSet.delete(courseId);
      } else {
        newSet.add(courseId);
      }
      return newSet;
    });
  };

  const expandAll = () => {
    setExpandedCourses(new Set(courseGrades.map(c => c.courseId)));
  };

  const collapseAll = () => {
    setExpandedCourses(new Set());
  };

  const handleDownloadTranscript = () => {
    const doc = new jsPDF();
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : { name: "Student", email: "" };

    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("Official Academic Transcript", 105, 20, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("EduManage University", 105, 28, { align: "center" });

    // Student Info
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    doc.text(`Student Name: ${user.name}`, 20, 45);
    doc.text(`Student ID: ${user.id || "N/A"}`, 20, 50);
    doc.text(`Date Issued: ${new Date().toLocaleDateString()}`, 140, 45);

    // Grades Table - now with detailed breakdown
    const tableColumn = ["Course", "Assessment", "Score", "Date"];
    const tableRows: any[] = [];

    courseGrades.forEach((course) => {
      // Add course header row
      tableRows.push([
        { content: `${course.code} - ${course.name}`, colSpan: 3, styles: { fontStyle: 'bold', fillColor: [230, 240, 255] } },
        { content: `Avg: ${course.average.toFixed(2)}/20`, styles: { fontStyle: 'bold', fillColor: [230, 240, 255] } }
      ]);
      // Add grade rows
      course.grades.forEach(grade => {
        tableRows.push([
          "",
          grade.comment || grade.type || "Assessment",
          `${grade.score}/20`,
          grade.date
        ]);
      });
    });

    autoTable(doc, {
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [66, 133, 244], textColor: 255 },
      styles: { fontSize: 9, cellPadding: 3 },
      alternateRowStyles: { fillColor: [250, 250, 250] }
    });

    // Summary
    const finalY = (doc as any).lastAutoTable.finalY || 60;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(`Total Credits: ${totalCredits}`, 20, finalY + 15);
    doc.text(`Cumulative Average (Moyenne): ${gpa} / 20`, 20, finalY + 22);

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is a computer-generated document. No signature is required.", 105, 280, { align: "center" });

    doc.save(`transcript_${user.name.replace(/\s+/g, '_')}.pdf`);
    toast({ title: "Success", description: "Transcript downloaded successfully" });
  };

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await api.get('/student/grades');

        // Group grades by course
        const courseMap = new Map<number, CourseWithGrades>();

        data.forEach((g: any, index: number) => {
          const courseId = g.course_id;
          const courseCode = g.Course?.code || `C${courseId}`;
          const courseName = g.Course?.title || "Unknown Course";
          const credits = g.Course?.credits || 3;

          if (!courseMap.has(courseId)) {
            courseMap.set(courseId, {
              courseId,
              code: courseCode,
              name: courseName,
              credits,
              grades: [],
              average: 0
            });
          }

          // Get grade type and format it nicely
          const getGradeType = () => {
            // Check if it's an assignment grade
            if (g.isAssignment || g.Assignment) {
              return g.Assignment?.title || g.comment || 'Assignment';
            }
            // Check if it's an exam grade
            if (g.Exam?.type) {
              const typeMap: Record<string, string> = {
                'final': 'Final Exam',
                'midterm': 'Midterm Exam',
                'quiz': 'Quiz'
              };
              return typeMap[g.Exam.type] || g.Exam.type;
            }
            return "Assessment";
          };

          // Determine the grade category
          const getGradeCategory = () => {
            if (g.isAssignment || g.Assignment) return 'assignment';
            if (g.Exam?.type) return g.Exam.type;
            return 'grade';
          };

          const course = courseMap.get(courseId)!;
          course.grades.push({
            id: g.id || index,
            score: g.score ?? 0,
            comment: getGradeType(),
            date: g.Exam?.date ? formatDate(g.Exam.date) : (g.createdAt ? formatDate(g.createdAt) : "N/A"),
            type: getGradeCategory()
          });
        });

        // Calculate averages for each course
        courseMap.forEach((course) => {
          if (course.grades.length > 0) {
            const totalScore = course.grades.reduce((sum, g) => sum + (g.score ?? 0), 0);
            course.average = totalScore / course.grades.length;
          }
        });

        const coursesArray = Array.from(courseMap.values());
        setCourseGrades(coursesArray);

        // Expand all courses by default
        setExpandedCourses(new Set(coursesArray.map(c => c.courseId)));

        // Calculate overall GPA with credit weighting
        if (coursesArray.length > 0) {
          let totalWeightedScore = 0;
          let totalCreds = 0;
          coursesArray.forEach((course) => {
            totalWeightedScore += course.average * course.credits;
            totalCreds += course.credits;
          });
          const avgScore = totalCreds > 0 ? totalWeightedScore / totalCreds : 0;
          setGpa(avgScore.toFixed(2));
          setTotalCredits(totalCreds);
        }

      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load grades", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchGrades();
  }, []);

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="My Grades">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading grades...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const getGradeColor = (score: number) => {
    if (score >= 16) return "text-green-600 dark:text-green-400";
    if (score >= 14) return "text-blue-600 dark:text-blue-400";
    if (score >= 10) return "text-primary";
    return "text-red-600 dark:text-red-400";
  };

  const getGradeBadgeVariant = (score: number): "default" | "secondary" | "destructive" | "outline" => {
    if (score >= 16) return "default";
    if (score >= 10) return "secondary";
    return "destructive";
  };

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Grades">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Grades</h2>
            <p className="text-muted-foreground">Track your academic performance by course</p>
          </div>
          <Button onClick={handleDownloadTranscript}>
            <Download className="w-4 h-4 mr-2" />
            Download Transcript
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-gradient-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Average</CardTitle>
              <Award className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="flex items-baseline gap-1">
                <span className={`text-3xl font-bold ${parseFloat(gpa) >= 10 ? "text-primary" : "text-red-600"}`}>
                  {gpa}
                </span>
                <span className="text-muted-foreground">/ 20</span>
              </div>
              <div className={`flex items-center gap-1 mt-1 text-sm ${parseFloat(gpa) >= 10 ? "text-green-600" : "text-red-600"}`}>
                <TrendingUp className="w-3 h-3" />
                {parseFloat(gpa) >= 10 ? "Passing" : "Needs Improvement"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{courseGrades.length}</div>
              <p className="text-sm text-muted-foreground mt-1">{totalCredits} credits total</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Grades</CardTitle>
              <FileText className="h-5 w-5 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {courseGrades.reduce((sum, c) => sum + c.grades.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground mt-1">Across all courses</p>
            </CardContent>
          </Card>
        </div>

        {/* Grades by Course */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grades by Course</CardTitle>
                <CardDescription>Click on a course to view detailed grades</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={expandAll}>
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={collapseAll}>
                  Collapse All
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {courseGrades.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No grades available yet</p>
            ) : (
              <div className="space-y-3">
                {courseGrades.map((course) => (
                  <Collapsible
                    key={course.courseId}
                    open={expandedCourses.has(course.courseId)}
                    onOpenChange={() => toggleCourse(course.courseId)}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="w-full p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {expandedCourses.has(course.courseId) ? (
                              <ChevronDown className="w-5 h-5 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            )}
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline">{course.code}</Badge>
                                <Badge variant="secondary">{course.credits} Credits</Badge>
                                <Badge variant="outline" className="text-xs">
                                  {course.grades.length} grade{course.grades.length !== 1 ? 's' : ''}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-left">{course.name}</h3>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground mb-1">Course Average</p>
                            <p className={`text-2xl font-bold ${getGradeColor(course.average)}`}>
                              {course.average.toFixed(2)}
                              <span className="text-sm font-normal text-muted-foreground"> / 20</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="ml-8 mt-2 space-y-2 pb-2">
                        {course.grades.map((grade) => (
                          <div
                            key={grade.id}
                            className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border-l-4 border-primary/30"
                          >
                            <div className="flex items-center gap-3">
                              <Badge 
                                variant={
                                  grade.type === 'final' ? 'destructive' : 
                                  grade.type === 'midterm' ? 'default' : 
                                  grade.type === 'assignment' ? 'outline' :
                                  'secondary'
                                }
                                className={`text-xs ${grade.type === 'assignment' ? 'border-green-500 text-green-600' : ''}`}
                              >
                                {grade.type === 'final' ? 'Final' : 
                                 grade.type === 'midterm' ? 'Midterm' : 
                                 grade.type === 'quiz' ? 'Quiz' : 
                                 grade.type === 'assignment' ? 'Assignment' : 'Grade'}
                              </Badge>
                              <div>
                                <p className="font-medium">{grade.comment}</p>
                                <p className="text-xs text-muted-foreground">{grade.date}</p>
                              </div>
                            </div>
                            <Badge variant={getGradeBadgeVariant(grade.score)} className="text-sm px-3 py-1">
                              {grade.score}/20
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
