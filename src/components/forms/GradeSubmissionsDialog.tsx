import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { MessageSquare, Check, Clock, AlertCircle, CheckCircle, Loader2, FileText, ExternalLink } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";

const API_BASE_URL = "http://localhost:3000";

interface Submission {
    id: number;
    student_id: number;
    studentName: string;
    submitted: boolean;
    score: string;
    feedback: string;
    status: string;
    file_path?: string;
    submission_date?: string;
}

interface GradeSubmissionsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignment: any;
    onSave: (updatedAssignment: any) => void;
}

export function GradeSubmissionsDialog({ open, onOpenChange, assignment, onSave }: GradeSubmissionsDialogProps) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (open && assignment?.id) {
            fetchSubmissions();
        }
    }, [open, assignment?.id]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            const data = await api.get(`/assignments/${assignment.id}/submissions`);
            const mappedSubmissions: Submission[] = data.map((s: any) => ({
                id: s.id,
                student_id: s.student_id,
                studentName: s.Student?.User?.name || `Student ${s.student_id}`,
                submitted: true,
                score: s.grade?.toString() || "",
                feedback: s.feedback || "",
                status: s.grade !== null && s.grade !== undefined ? "Graded" : "Submitted",
                file_path: s.file_path,
                submission_date: s.submission_date
            }));
            setSubmissions(mappedSubmissions);
        } catch (error) {
            console.error("Error fetching submissions:", error);
            toast({
                title: "Error",
                description: "Failed to load submissions",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleGradeChange = (id: number, value: string) => {
        setSubmissions(submissions.map(s => s.id === id ? { ...s, score: value } : s));
    };

    const handleFeedbackChange = (id: number, value: string) => {
        setSubmissions(submissions.map(s => s.id === id ? { ...s, feedback: value } : s));
    };

    const handleSaveGrades = async () => {
        setSaving(true);
        try {
            // Save each submission's grade
            const submissionsToGrade = submissions.filter(s => s.score !== "");
            console.log('Submissions to grade:', submissionsToGrade);
            
            const gradePromises = submissionsToGrade.map(s => {
                const payload = {
                    student_id: s.student_id,
                    score: parseFloat(s.score),
                    feedback: s.feedback
                };
                console.log(`Grading student ${s.student_id}:`, payload);
                return api.post(`/assignments/${assignment.id}/grade`, payload);
            });

            const results = await Promise.all(gradePromises);
            console.log('Grade save results:', results);

            // Update local status based on grades
            const updatedSubmissions = submissions.map(s => ({
                ...s,
                status: s.score ? "Graded" : s.status
            }));
            setSubmissions(updatedSubmissions);

            const gradedCount = updatedSubmissions.filter(s => s.status === "Graded").length;

            // Notify parent of update
            if (assignment) {
                onSave({
                    ...assignment,
                    graded: gradedCount
                });
            }

            toast({
                title: "Grades Saved",
                description: "Student grades have been updated successfully.",
            });
            onOpenChange(false);
        } catch (error: any) {
            console.error("Error saving grades:", error);
            toast({
                title: "Error",
                description: error?.message || "Failed to save grades",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Grade Submissions</DialogTitle>
                    <DialogDescription>
                        {assignment?.title} - {assignment?.course}
                    </DialogDescription>
                </DialogHeader>

                {loading ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-6 h-6 animate-spin mr-2" />
                        <span>Loading submissions...</span>
                    </div>
                ) : submissions.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p>No submissions yet for this assignment.</p>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between py-4 border-b">
                            <div className="flex gap-4">
                                <div className="text-center">
                                    <div className="text-2xl font-bold">{submissions.length}</div>
                                    <div className="text-xs text-muted-foreground">Total</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-600">
                                        {submissions.filter(s => s.status === "Graded").length}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Graded</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-orange-600">
                                        {submissions.filter(s => s.status === "Submitted").length}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Pending</div>
                                </div>
                            </div>
                            <Button onClick={handleSaveGrades} disabled={saving}>
                                {saving ? (
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                )}
                                {saving ? "Saving..." : "Save All Grades"}
                            </Button>
                        </div>

                        <ScrollArea className="h-[350px] pr-4 mt-4">
                            <div className="space-y-4">
                                {submissions.map((submission) => (
                                    <div key={submission.id} className="p-4 border rounded-lg bg-card hover:bg-accent/5 transition-colors">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarFallback>
                                                        {submission.studentName.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <div className="font-medium">{submission.studentName}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <Badge variant="default">Submitted</Badge>
                                                        {submission.status === "Graded" && (
                                                            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                                                                Graded
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {submission.submission_date && (
                                                        <div className="text-xs text-muted-foreground mt-1">
                                                            Submitted: {new Date(submission.submission_date).toLocaleString()}
                                                        </div>
                                                    )}
                                                    {submission.file_path && (
                                                        <a
                                                            href={`${API_BASE_URL}/${submission.file_path}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-1"
                                                        >
                                                            <FileText className="w-3 h-3" />
                                                            View Submitted File
                                                            <ExternalLink className="w-3 h-3" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Label htmlFor={`grade-${submission.id}`} className="sr-only">Grade</Label>
                                                <Input
                                                    id={`grade-${submission.id}`}
                                                    type="number"
                                                    min="0"
                                                    max="20"
                                                    step="0.25"
                                                    placeholder="Score"
                                                    className="w-20 text-right font-mono"
                                                    value={submission.score}
                                                    onChange={(e) => handleGradeChange(submission.id, e.target.value)}
                                                />
                                                <span className="text-muted-foreground">/ 20</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor={`feedback-${submission.id}`} className="text-xs text-muted-foreground">Feedback</Label>
                                            <Textarea
                                                id={`feedback-${submission.id}`}
                                                placeholder="Enter feedback for the student..."
                                                className="h-20 resize-none"
                                                value={submission.feedback}
                                                onChange={(e) => handleFeedbackChange(submission.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
