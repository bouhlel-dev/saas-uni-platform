import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Clock, Users, FileText } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CreateAssignmentDialog } from "@/components/forms/CreateAssignmentDialog";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";

const Assignments = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/teacher" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/teacher/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/teacher/assignments" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/teacher/exams" className="block px-3 py-2 rounded-md hover:bg-muted">
        Exams
      </NavLink>
      <NavLink to="/dashboard/teacher/attendance" className="block px-3 py-2 rounded-md hover:bg-muted">
        Attendance
      </NavLink>
      <NavLink to="/dashboard/teacher/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
    </nav>
  );

  const assignments = [
    { 
      id: 1,
      course: "CS401", 
      title: "ML Model Implementation", 
      dueDate: "Mar 25, 2024", 
      submissions: 38, 
      total: 45,
      graded: 25,
      status: "Active"
    },
    { 
      id: 2,
      course: "CS302", 
      title: "Binary Tree Project", 
      dueDate: "Mar 22, 2024", 
      submissions: 65, 
      total: 67,
      graded: 60,
      status: "Active"
    },
    { 
      id: 3,
      course: "CS201", 
      title: "Python Basics Quiz", 
      dueDate: "Mar 20, 2024", 
      submissions: 89, 
      total: 89,
      graded: 89,
      status: "Closed"
    },
    { 
      id: 4,
      course: "CS403", 
      title: "CNN Architecture Design", 
      dueDate: "Mar 28, 2024", 
      submissions: 12, 
      total: 33,
      graded: 8,
      status: "Active"
    },
    { 
      id: 5,
      course: "CS401", 
      title: "Dataset Analysis Report", 
      dueDate: "Apr 01, 2024", 
      submissions: 5, 
      total: 45,
      graded: 0,
      status: "Active"
    },
  ];

  const handleCreateAssignment = () => {
    setShowCreateDialog(true);
  };

  return (
    <>
      <CreateAssignmentDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <DashboardLayout sidebar={sidebarContent} title="Assignments">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Assignments</h2>
            <p className="text-muted-foreground">Manage and grade student assignments</p>
          </div>
          <Button onClick={handleCreateAssignment}>
            <Plus className="w-4 h-4 mr-2" />
            Create Assignment
          </Button>
        </div>

        <div className="grid gap-4">
          {assignments.map((assignment) => (
            <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{assignment.course}</Badge>
                      <Badge variant={assignment.status === "Active" ? "default" : "outline"}>
                        {assignment.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl">{assignment.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      Due: {assignment.dueDate}
                    </CardDescription>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setSelectedAssignment(assignment);
                      setShowDetails(true);
                    }}
                  >
                    View Details
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">Submissions</p>
                    </div>
                    <p className="text-2xl font-bold">{assignment.submissions}/{assignment.total}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-primary" />
                      <p className="text-sm text-muted-foreground">Graded</p>
                    </div>
                    <p className="text-2xl font-bold">{assignment.graded}/{assignment.submissions}</p>
                  </div>
                  <div className="p-3 border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Pending</p>
                    <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                      {assignment.submissions - assignment.graded}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Submission Progress</span>
                    <span className="font-medium">
                      {Math.round((assignment.submissions / assignment.total) * 100)}%
                    </span>
                  </div>
                  <Progress value={(assignment.submissions / assignment.total) * 100} />
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  <Button size="sm" className="flex-1">Grade Submissions</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedAssignment && (
          <ViewDetailsDialog
            open={showDetails}
            onOpenChange={setShowDetails}
            title={selectedAssignment.title}
            description={`Course: ${selectedAssignment.course}`}
            details={[
              { label: "Due Date", value: selectedAssignment.dueDate },
              { label: "Status", value: selectedAssignment.status, badge: true },
              { label: "Total Students", value: selectedAssignment.total },
              { label: "Submissions", value: selectedAssignment.submissions },
              { label: "Graded", value: selectedAssignment.graded },
              { label: "Pending", value: selectedAssignment.submissions - selectedAssignment.graded },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
    </>
  );
};

export default Assignments;
