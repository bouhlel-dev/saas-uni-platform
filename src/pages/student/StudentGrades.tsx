import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Download, Award } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StudentGrades = () => {
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/student" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/student/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/student/assignments" className="block px-3 py-2 rounded-md hover:bg-muted">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/student/exams" className="block px-3 py-2 rounded-md hover:bg-muted">
        Exams
      </NavLink>
      <NavLink to="/dashboard/student/grades" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Grades
      </NavLink>
      <NavLink to="/dashboard/student/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const courseGrades = [
    { 
      code: "CS401", 
      name: "Advanced Machine Learning", 
      midterm: 88, 
      assignments: 92, 
      final: null, 
      total: 90,
      grade: "A",
      credits: 4
    },
    { 
      code: "CS302", 
      name: "Data Structures", 
      midterm: 85, 
      assignments: 88, 
      final: null, 
      total: 87,
      grade: "A-",
      credits: 4
    },
    { 
      code: "CS201", 
      name: "Programming Basics", 
      midterm: 95, 
      assignments: 96, 
      final: 94, 
      total: 95,
      grade: "A+",
      credits: 3
    },
    { 
      code: "MATH301", 
      name: "Linear Algebra", 
      midterm: 78, 
      assignments: 82, 
      final: null, 
      total: 80,
      grade: "B+",
      credits: 3
    },
  ];

  const recentGrades = [
    { date: "Mar 15, 2024", course: "CS201", item: "Final Exam", score: 94, total: 100 },
    { date: "Mar 12, 2024", course: "CS302", item: "Assignment 5", score: 88, total: 100 },
    { date: "Mar 10, 2024", course: "MATH301", item: "Quiz 3", score: 92, total: 100 },
    { date: "Mar 08, 2024", course: "CS401", item: "Assignment 4", score: 95, total: 100 },
    { date: "Mar 05, 2024", course: "CS201", item: "Midterm Exam", score: 95, total: 100 },
  ];

  const gpa = 3.85;
  const totalCredits = 14;

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Grades">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">My Grades</h2>
            <p className="text-muted-foreground">Track your academic performance</p>
          </div>
          <Button onClick={() => toast({ title: "Downloading Transcript", description: "Your transcript is being prepared..." })}>
            <Download className="w-4 h-4 mr-2" />
            Download Transcript
          </Button>
        </div>

        {/* GPA Card */}
        <Card className="bg-gradient-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Current GPA</CardTitle>
                <CardDescription>Based on {totalCredits} credits this semester</CardDescription>
              </div>
              <Award className="w-8 h-8 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-2">
              <p className="text-5xl font-bold text-primary">{gpa}</p>
              <p className="text-lg text-muted-foreground mb-2">/ 4.00</p>
              <div className="flex items-center gap-1 ml-4 mb-2 text-green-600 dark:text-green-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">Excellent Performance</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Course Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Course Grades</CardTitle>
            <CardDescription>Current grades for all enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {courseGrades.map((course) => (
                <div key={course.code} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{course.code}</Badge>
                        <Badge variant="secondary">{course.credits} Credits</Badge>
                      </div>
                      <h3 className="font-semibold">{course.name}</h3>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Grade</p>
                      <Badge variant="default" className="text-xl px-4 py-1">{course.grade}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-2 border rounded">
                      <p className="text-muted-foreground">Midterm</p>
                      <p className="text-lg font-bold">{course.midterm}%</p>
                    </div>
                    <div className="text-center p-2 border rounded">
                      <p className="text-muted-foreground">Assignments</p>
                      <p className="text-lg font-bold">{course.assignments}%</p>
                    </div>
                    <div className="text-center p-2 border rounded">
                      <p className="text-muted-foreground">Final</p>
                      <p className="text-lg font-bold">{course.final || '-'}</p>
                    </div>
                    <div className="text-center p-2 border rounded bg-primary/5">
                      <p className="text-muted-foreground">Total</p>
                      <p className="text-lg font-bold text-primary">{course.total}%</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Grades</CardTitle>
            <CardDescription>Latest graded items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentGrades.map((grade, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">{grade.course}</Badge>
                      <span className="font-medium text-sm">{grade.item}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{grade.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">{grade.score}</p>
                    <p className="text-xs text-muted-foreground">out of {grade.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentGrades;
