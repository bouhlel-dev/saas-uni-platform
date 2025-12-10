import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, GraduationCap, FileCheck, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { CreateExamDialog } from "@/components/forms/CreateExamDialog";
import { ExamDetailsDialog } from "@/components/ExamDetailsDialog";
import { EditExamDialog } from "@/components/forms/EditExamDialog";
import { formatDate } from "@/lib/formatUtils";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { TeacherSidebar } from "@/components/TeacherSidebar";
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

const Exams = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [examToDelete, setExamToDelete] = useState<any>(null);

  const sidebarContent = <TeacherSidebar />;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper to format time for display (convert 24h to 12h format)
  const formatTime = (time: string): string => {
    if (!time) return "TBD";
    // If it's already in readable format, return as is
    if (time.includes("AM") || time.includes("PM")) return time;
    
    // Convert HH:mm to 12-hour format
    const match = time.match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return time;
    
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    
    if (hours === 0) hours = 12;
    else if (hours > 12) hours -= 12;
    
    return `${hours}:${minutes} ${period}`;
  };

  const fetchExams = async () => {
    try {
      const data = await api.get('/teacher/exams');

      const mappedExams = data.map((e: any) => ({
        id: e.id,
        course: e.Course?.title || "Unknown Course",
        title: `${e.type} Exam`,
        type: e.type,
        date: formatDate(e.date),
        time: formatTime(e.time) || new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        duration: `${e.duration} min`,
        room: e.room || "TBD",
        className: e.Class?.name || null,
        status: new Date(e.date) > new Date() ? "Scheduled" : "Completed"
      }));
      setExams(mappedExams);
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to load exams", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading exams...</div>;

  const handleCreateExam = () => {
    setShowCreateDialog(true);
  };

  const handleExamUpdate = async (updatedExam: any) => {
    // Refetch exams from the server to get the latest data
    await fetchExams();
    setSelectedExam(null);
  };

  const handleDeleteExam = async () => {
    if (!examToDelete) return;
    
    try {
      await api.delete(`/teacher/exams/${examToDelete.id}`);
      toast({ title: "Success", description: "Exam deleted successfully" });
      await fetchExams();
    } catch (error) {
      console.error(error);
      toast({ title: "Error", description: "Failed to delete exam", variant: "destructive" });
    } finally {
      setShowDeleteDialog(false);
      setExamToDelete(null);
    }
  };

  return (
    <>
      <CreateExamDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} onSuccess={fetchExams} />
      <DashboardLayout sidebar={sidebarContent} title="Exams">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Exams</h2>
              <p className="text-muted-foreground">Schedule and manage course examinations</p>
            </div>
            <Button onClick={handleCreateExam}>
              <Plus className="w-4 h-4 mr-2" />
              Schedule Exam
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {exams.map((exam: any) => (
              <Card key={exam.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge variant="secondary">{exam.course}</Badge>
                        <Badge variant={exam.status === "Scheduled" ? "default" : "outline"}>
                          {exam.status}
                        </Badge>
                        <Badge variant="outline">{exam.type}</Badge>
                        {exam.className && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                            {exam.className}
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                    </div>
                    <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                      <FileCheck className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{exam.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{exam.time} ({exam.duration})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Room:</span>
                      <span className="font-medium">{exam.room}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">
                        {exam.className ? exam.className : "All Classes"}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedExam(exam);
                        setShowEditDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => {
                        setExamToDelete(exam);
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    {exam.status === "Completed" ? (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedExam(exam);
                          setShowDetails(true);
                        }}
                      >
                        View Results
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          setSelectedExam(exam);
                          setShowDetails(true);
                        }}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedExam && (
            <>
              <ExamDetailsDialog
                open={showDetails}
                onOpenChange={setShowDetails}
                exam={selectedExam}
              />
              <EditExamDialog
                open={showEditDialog}
                onOpenChange={setShowEditDialog}
                exam={selectedExam}
                onSave={handleExamUpdate}
              />
            </>
          )}

          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Exam</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete "{examToDelete?.title}"? This will also delete all associated grades. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDeleteExam} className="bg-red-600 hover:bg-red-700">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DashboardLayout>
    </>
  );
};

export default Exams;
