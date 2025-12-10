import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { FileText, Users, Clock, CheckCircle, AlertCircle, BarChart2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

interface AssignmentDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignment: any;
}

export function AssignmentDetailsDialog({ open, onOpenChange, assignment }: AssignmentDetailsDialogProps) {
    if (!assignment) return null;

    const initials = assignment.title ? assignment.title.split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'A';

    // Safe calculations with default values
    const submissions = assignment.submissions || 0;
    const total = assignment.total || assignment.students || 0;
    const graded = assignment.graded || 0;
    const submissionRate = total > 0 ? Math.round((submissions / total) * 100) : 0;
    const pendingCount = Math.max(0, submissions - graded);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">{assignment.title}</DialogTitle>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Badge variant="secondary">{assignment.course}</Badge>
                                <Badge variant={assignment.status === "Active" ? "default" : "outline"}>
                                    {assignment.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/20 transition-colors">
                            <div className="flex justify-center mb-2 text-primary">
                                <FileText className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold">{submissions}</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Submissions</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/20 transition-colors">
                            <div className="flex justify-center mb-2 text-green-600">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold">{graded}</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Graded</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/20 transition-colors">
                            <div className="flex justify-center mb-2 text-orange-600">
                                <AlertCircle className="w-5 h-5" />
                            </div>
                            <div className="text-2xl font-bold">{pendingCount}</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Pending</div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Submission Progress</h4>
                                <span className="text-sm font-bold text-primary">{submissionRate}%</span>
                            </div>
                            <Progress value={submissionRate} className="h-2" />
                            <p className="text-xs text-muted-foreground mt-2">
                                {submissions} out of {total} students have submitted.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                    <Clock className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{assignment.dueDate}</p>
                                    <p className="text-xs text-muted-foreground">Due Date</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                                <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="font-medium">{total} Students</p>
                                    <p className="text-xs text-muted-foreground">Total Enrollment</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    <Button>Grade Submissions</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
