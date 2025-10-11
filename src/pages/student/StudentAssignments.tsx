import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Upload, FileText, CheckCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { SubmitAssignmentDialog } from "@/components/forms/SubmitAssignmentDialog";
import { useState } from "react";

const StudentAssignments = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/student" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/student/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/student/assignments" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/student/exams" className="block px-3 py-2 rounded-md hover:bg-muted">
        Exams
      </NavLink>
      <NavLink to="/dashboard/student/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
      <NavLink to="/dashboard/student/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const assignments = [
    { 
      id: 1,
      course: "CS401", 
      title: "ML Model Implementation", 
      dueDate: "Mar 25, 2024",
      daysLeft: 7,
      status: "pending",
      points: 100,
      description: "Implement a neural network model for image classification"
    },
    { 
      id: 2,
      course: "CS302", 
      title: "Binary Tree Project", 
      dueDate: "Mar 22, 2024",
      daysLeft: 4,
      status: "in-progress",
      points: 100,
      description: "Create a balanced binary search tree implementation"
    },
    { 
      id: 3,
      course: "MATH301", 
      title: "Matrix Operations", 
      dueDate: "Mar 20, 2024",
      daysLeft: 2,
      status: "pending",
      points: 50,
      description: "Solve matrix algebra problems"
    },
    { 
      id: 4,
      course: "CS201", 
      title: "Python Quiz", 
      dueDate: "Mar 15, 2024",
      daysLeft: 0,
      status: "submitted",
      points: 50,
      grade: 48,
      description: "Complete the Python fundamentals quiz"
    },
  ];

  const handleSubmit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowSubmitDialog(true);
  };

  return (
    <>
      {selectedAssignment && (
        <SubmitAssignmentDialog
          open={showSubmitDialog}
          onOpenChange={setShowSubmitDialog}
          assignment={selectedAssignment}
        />
      )}
      <DashboardLayout sidebar={sidebarContent} title="My Assignments">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Assignments</h2>
          <p className="text-muted-foreground">Track and submit your course assignments</p>
        </div>

        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{assignment.course}</Badge>
                      <Badge variant={
                        assignment.status === "submitted" ? "default" :
                        assignment.status === "in-progress" ? "secondary" :
                        assignment.daysLeft <= 3 ? "destructive" : "outline"
                      }>
                        {assignment.status === "submitted" ? "Submitted" :
                         assignment.status === "in-progress" ? "In Progress" :
                         assignment.daysLeft <= 3 ? `Due in ${assignment.daysLeft} days` : "Pending"}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                    <CardDescription className="mt-1">{assignment.description}</CardDescription>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
                    {assignment.status === "submitted" ? (
                      <CheckCircle className="w-6 h-6 text-white" />
                    ) : (
                      <FileText className="w-6 h-6 text-white" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Due Date</p>
                    </div>
                    <p className="font-medium">{assignment.dueDate}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Points</p>
                    <p className="text-2xl font-bold">
                      {assignment.status === "submitted" && assignment.grade ? (
                        <span className="text-primary">{assignment.grade}/{assignment.points}</span>
                      ) : (
                        assignment.points
                      )}
                    </p>
                  </div>
                </div>

                {assignment.status === "submitted" ? (
                  <Button variant="outline" size="sm" className="w-full" disabled>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Submitted
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button size="sm" className="flex-1" onClick={() => handleSubmit(assignment)}>
                      <Upload className="w-4 h-4 mr-2" />
                      Submit
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
    </>
  );
};

export default StudentAssignments;
