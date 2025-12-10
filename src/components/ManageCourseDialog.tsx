import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Upload, FilePlus, ClipboardCheck, Users, BarChart2, Settings, MessageSquare } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface ManageCourseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: any;
    onUploadMaterial?: () => void;
    onCreateAssignment?: () => void;
    onViewGrades?: () => void;
    onAttendance?: () => void;
}

export function ManageCourseDialog({ open, onOpenChange, course, onUploadMaterial, onCreateAssignment, onViewGrades, onAttendance }: ManageCourseDialogProps) {
    if (!course) return null;

    const initials = course.name ? course.name.split(' ').map((n: string) => n[0]).join('') : 'C';

    const handleAction = (action: string, callback?: () => void) => {
        if (callback) {
            onOpenChange(false); // Close the dialog
            callback(); // Execute the callback
        } else {
            toast({
                title: action,
                description: `This feature will be available soon.`,
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-2">
                        <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">Manage {course.name}</DialogTitle>
                            <DialogDescription>Course Code: {course.id}</DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-2">
                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3 mb-6">
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => handleAction("Upload Material", onUploadMaterial)}>
                            <Upload className="w-6 h-6" />
                            <span>Upload Material</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => handleAction("Create Assignment", onCreateAssignment)}>
                            <FilePlus className="w-6 h-6" />
                            <span>Create Assignment</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => handleAction("View Grades", onViewGrades)}>
                            <BarChart2 className="w-6 h-6" />
                            <span>View Grades</span>
                        </Button>
                        <Button variant="outline" className="h-auto py-4 flex flex-col gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30" onClick={() => handleAction("Attendance", onAttendance)}>
                            <ClipboardCheck className="w-6 h-6" />
                            <span>Attendance</span>
                        </Button>
                    </div>

                    <Separator className="my-6" />

                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Course Statistics</h4>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">Total Enrollment</span>
                            </div>
                            <span className="font-bold text-lg">{course.students}</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <ClipboardCheck className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">Submission Rate</span>
                            </div>
                            <span className="font-bold text-lg text-green-600">92%</span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                            <div className="flex items-center gap-3">
                                <MessageSquare className="w-5 h-5 text-muted-foreground" />
                                <span className="font-medium">Unread Discussions</span>
                            </div>
                            <span className="font-bold text-lg text-blue-600">5</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => handleAction("Course Settings")}>
                            <Settings className="w-4 h-4 mr-2" />
                            Course Settings
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
