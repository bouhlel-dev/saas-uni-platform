import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FileText, Clock, Award, Upload, Download, CheckCircle } from "lucide-react";
import { useState } from "react";
import { api } from "../lib/api";

interface StudentAssignmentDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignment: any;
    onSubmit?: (assignment: any) => void;
}

export function StudentAssignmentDetailsDialog({
    open,
    onOpenChange,
    assignment,
    onSubmit
}: StudentAssignmentDetailsDialogProps) {
    if (!assignment) return null;

    const isSubmitted = assignment.status === "submitted";
    const isPastDue = assignment.daysLeft < 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <DialogDescription className="sr-only">
                            Details for assignment {assignment.title}
                        </DialogDescription>
                        <div className="flex-1">
                            <DialogTitle className="text-2xl mb-2">{assignment.title}</DialogTitle>
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                                <Badge variant="secondary">{assignment.course}</Badge>
                                <Badge variant={
                                    isSubmitted ? "default" :
                                        isPastDue ? "destructive" :
                                            "outline"
                                }>
                                    {isSubmitted ? "Submitted" : isPastDue ? "Past Due" : "Pending"}
                                </Badge>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-center gap-2 text-primary">
                                <Award className="w-5 h-5" />
                                <span className="text-2xl font-bold">{assignment.points || 20}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">Points</p>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Due Date */}
                    <div className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg border">
                        <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                            <Clock className="w-6 h-6 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium">Due: {assignment.dueDate}</p>
                            <p className="text-sm text-muted-foreground">
                                {assignment.daysLeft > 0
                                    ? `${assignment.daysLeft} days remaining`
                                    : assignment.daysLeft === 0
                                        ? "Due today"
                                        : `${Math.abs(assignment.daysLeft)} days overdue`
                                }
                            </p>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Assignment Description
                        </h3>
                        <div className="p-4 bg-muted/20 rounded-lg border">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {assignment.description || "No description provided."}
                            </p>
                        </div>
                    </div>

                    {/* Materials Provided */}
                    {assignment.materials && assignment.materials.length > 0 && (
                        <div>
                            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                                Materials Provided
                            </h3>
                            <div className="space-y-2">
                                {assignment.materials.map((material: any, index: number) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-3 bg-muted/20 rounded-lg border hover:bg-muted/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="font-medium text-sm">{material.name || `Material ${index + 1}`}</p>
                                                <p className="text-xs text-muted-foreground">{material.type || "Document"}</p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm">
                                            <Download className="w-4 h-4 mr-2" />
                                            Download
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <Separator />

                    {/* Submission Section */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                            Your Submission
                        </h3>

                        {isSubmitted ? (
                            <div className="p-6 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-900">
                                <div className="flex items-center gap-3 mb-3">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                    <div>
                                        <p className="font-semibold text-green-900 dark:text-green-100">
                                            Assignment Submitted
                                        </p>
                                        <p className="text-sm text-green-700 dark:text-green-300">
                                            Submitted on {assignment.submittedDate || assignment.dueDate}
                                        </p>
                                    </div>
                                </div>

                                {assignment.submissionFile && (
                                    <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded border flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <FileText className="w-4 h-4 text-primary" />
                                            <span className="text-sm font-medium truncate max-w-[200px]">
                                                {assignment.submissionFile.split(/[/\\]/).pop()}
                                            </span>
                                        </div>
                                        {/* Ideally add a download button here if we have a download endpoint */}
                                    </div>
                                )}

                                {assignment.grade ? (
                                    <div className="mt-4 p-3 bg-white dark:bg-gray-900 rounded border">
                                        <p className="text-sm text-muted-foreground mb-1">Grade</p>
                                        <p className="text-2xl font-bold text-primary">
                                            {assignment.grade}/{assignment.points || 20}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="mt-4">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="w-full"
                                            onClick={async () => {
                                                if (confirm("Are you sure you want to unsubmit? This will delete your uploaded file.")) {
                                                    try {
                                                        await api.delete(`/student/assignments/${assignment.id}/submit`);

                                                        // Close dialog and refresh assignments
                                                        onOpenChange(false);
                                                        if (onSubmit) onSubmit(null); // Trigger refresh

                                                    } catch (error) {
                                                        console.error("Unsubmit error:", error);
                                                        alert("Error unsubmitting assignment");
                                                    }
                                                }
                                            }}
                                        >
                                            Unsubmit Assignment
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 bg-muted/20 rounded-lg border border-dashed">
                                <div className="text-center space-y-4">
                                    <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                                    <div>
                                        <p className="font-medium mb-1">Ready to submit your work?</p>
                                        <p className="text-sm text-muted-foreground">
                                            Upload your assignment files to complete this task
                                        </p>
                                    </div>
                                    <Button
                                        className="w-full"
                                        onClick={() => {
                                            onOpenChange(false);
                                            onSubmit?.(assignment);
                                        }}
                                        disabled={isPastDue}
                                    >
                                        <Upload className="w-4 h-4 mr-2" />
                                        {isPastDue ? "Submission Closed" : "Submit Assignment"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
