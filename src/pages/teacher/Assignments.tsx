import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Clock, Users, FileText, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreateAssignmentDialog } from "@/components/forms/CreateAssignmentDialog";
import { AssignmentDetailsDialog } from "@/components/AssignmentDetailsDialog";
import { EditAssignmentDialog } from "@/components/forms/EditAssignmentDialog";
import { GradeSubmissionsDialog } from "@/components/forms/GradeSubmissionsDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { formatDate } from "@/lib/formatUtils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { TeacherSidebar } from "@/components/TeacherSidebar";

const Assignments = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showGradeDialog, setShowGradeDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState<any>(null);
  const [deleting, setDeleting] = useState(false);

  const sidebarContent = <TeacherSidebar />;

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const data = await api.get('/teacher/assignments');

        const mappedAssignments = data.map((a: any) => ({
          id: a.id,
          course: a.Course?.title || "Unknown Course",
          title: a.title,
          dueDate: formatDate(a.deadline),
          submissions: a.submissions || 0,
          total: a.total || 0,
          graded: a.graded || 0,
          status: new Date(a.deadline) > new Date() ? "Active" : "Closed",
          description: a.description, // Ensure description is passed if available
          points: a.points // Ensure points are passed if available
        }));
        setAssignments(mappedAssignments);
      } catch (error) {
        console.error(error);
        toast({ title: "Error", description: "Failed to load assignments", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading assignments...</div>;

  const handleCreateAssignment = () => {
    setShowCreateDialog(true);
  };

  const handleAssignmentUpdate = (updatedAssignment: any) => {
    setAssignments(assignments.map((a: any) =>
      a.id === updatedAssignment.id ? { ...a, ...updatedAssignment } : a
    ));
    setSelectedAssignment(updatedAssignment);
  };

  const handleDeleteClick = (assignment: any) => {
    setAssignmentToDelete(assignment);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!assignmentToDelete) return;
    
    setDeleting(true);
    try {
      await api.delete(`/assignments/${assignmentToDelete.id}`);
      setAssignments(assignments.filter((a: any) => a.id !== assignmentToDelete.id));
      toast({
        title: "Assignment Deleted",
        description: `"${assignmentToDelete.title}" has been deleted successfully.`,
      });
      setShowDeleteDialog(false);
      setAssignmentToDelete(null);
    } catch (error: any) {
      console.error('Error deleting assignment:', error);
      toast({
        title: "Error",
        description: error?.message || "Failed to delete assignment",
        variant: "destructive"
      });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <CreateAssignmentDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <DashboardLayout sidebar={sidebarContent} title="Assignments">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Assignments</h2>
              <p className="text-muted-foreground">Manage course assignments and grading</p>
            </div>
            <Button onClick={handleCreateAssignment}>
              <Plus className="w-4 h-4 mr-2" />
              Create Assignment
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {assignments.map((assignment: any) => (
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
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-2 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{assignment.submissions}</div>
                      <div className="text-xs text-muted-foreground">Submitted</div>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{assignment.graded}</div>
                      <div className="text-xs text-muted-foreground">Graded</div>
                    </div>
                    <div className="p-2 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{assignment.total - assignment.submissions}</div>
                      <div className="text-xs text-muted-foreground">Pending</div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => {
                        setSelectedAssignment(assignment);
                        setShowGradeDialog(true);
                      }}
                    >
                      Grade Submissions
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(assignment)}
                      title="Delete assignment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedAssignment && (
            <>
              <AssignmentDetailsDialog
                open={showDetails}
                onOpenChange={setShowDetails}
                assignment={selectedAssignment}
              />
              <EditAssignmentDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                assignment={selectedAssignment}
                onSave={handleAssignmentUpdate}
              />
              <GradeSubmissionsDialog
                open={showGradeDialog}
                onOpenChange={setShowGradeDialog}
                assignment={selectedAssignment}
                onSave={handleAssignmentUpdate}
              />
            </>
          )}

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Assignment</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{assignmentToDelete?.title}"? This action cannot be undone and will also delete all student submissions for this assignment.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Assignments;
