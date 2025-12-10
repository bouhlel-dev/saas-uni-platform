import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/formatUtils";
import { Badge } from "@/components/ui/badge";
import { Clock, Upload, FileText, CheckCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { SubmitAssignmentDialog } from "@/components/forms/SubmitAssignmentDialog";
import { StudentAssignmentDetailsDialog } from "@/components/StudentAssignmentDetailsDialog";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentAssignments = () => {
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);

  const sidebarContent = <StudentSidebar />;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = async () => {
    try {
      const data = await api.get('/student/assignments');

      const mappedAssignments = data.map((a: any) => {
        const submission = a.AssignmentSubmissions && a.AssignmentSubmissions[0];
        const deadline = a.deadline ? new Date(a.deadline) : null;
        const daysLeft = deadline ? Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 0;
        return {
          id: a.id,
          courseCode: a.Course?.code || `C${a.course_id}`,
          course: a.Course?.title || "Unknown Course",
          title: a.title || "Untitled Assignment",
          dueDate: a.deadline ? formatDate(a.deadline) : "No deadline",
          rawDueDate: a.deadline,
          daysLeft: daysLeft,
          status: submission ? "submitted" : (deadline && deadline > new Date() ? "pending" : "overdue"),
          points: a.max_points || 20,
          description: a.description,
          grade: submission?.grade || null,
          submittedDate: submission ? formatDate(submission.submission_date) : null,
          submissionFile: submission?.file_path || null,
          submissionNotes: submission?.notes || null
        };
      });
      // Sort by deadline - upcoming first, then by status
      mappedAssignments.sort((a: any, b: any) => {
        if (a.status === 'submitted' && b.status !== 'submitted') return 1;
        if (a.status !== 'submitted' && b.status === 'submitted') return -1;
        return new Date(a.rawDueDate).getTime() - new Date(b.rawDueDate).getTime();
      });
      setAssignments(mappedAssignments);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading assignments...</div>;

  const handleSubmit = (assignment: any) => {
    setSelectedAssignment(assignment);
    setShowSubmitDialog(true);
  };

  // Calculate stats
  const totalAssignments = assignments.length;
  const submittedCount = assignments.filter((a: any) => a.status === 'submitted').length;
  const pendingCount = assignments.filter((a: any) => a.status === 'pending').length;
  const overdueCount = assignments.filter((a: any) => a.status === 'overdue').length;

  return (
    <>
      {selectedAssignment && (
        <>
          <SubmitAssignmentDialog
            open={showSubmitDialog}
            onOpenChange={setShowSubmitDialog}
            assignment={selectedAssignment}
            onSuccess={fetchAssignments}
          />
          <StudentAssignmentDetailsDialog
            open={showDetailsDialog}
            onOpenChange={setShowDetailsDialog}
            assignment={selectedAssignment}
            onSubmit={handleSubmit}
          />
        </>
      )}
      <DashboardLayout sidebar={sidebarContent} title="My Assignments">
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">My Assignments</h2>
            <p className="text-muted-foreground">Track and submit your course assignments</p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total</CardTitle>
                <FileText className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalAssignments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Submitted</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{submittedCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Pending</CardTitle>
                <Clock className="h-4 w-4 text-amber-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">{pendingCount}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
                <Clock className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">{overdueCount}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4">
            {assignments.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  No assignments found
                </CardContent>
              </Card>
            ) : assignments.map((assignment) => (
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowDetailsDialog(true);
                      }}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      View Submission
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedAssignment(assignment);
                          setShowDetailsDialog(true);
                        }}
                      >
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
