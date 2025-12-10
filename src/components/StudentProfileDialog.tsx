import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Calendar, MapPin, BookOpen, GraduationCap, TrendingUp, Edit, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface StudentProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    student: any;
    onEdit: (student: any) => void;
    onDelete: (id: number) => void;
}

export function StudentProfileDialog({ open, onOpenChange, student, onEdit, onDelete }: StudentProfileDialogProps) {
    if (!student) return null;

    const initials = student.name ? student.name.split(' ').map((n: string) => n[0]).join('') : 'S';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                                <AvatarImage src={student.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-xl">{student.name}</DialogTitle>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <span>{student.department} Department</span>
                                    <Badge variant="secondary" className="text-xs font-normal">Active</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => onEdit(student)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this student?")) {
                                        onDelete(student.pk);
                                        onOpenChange(false);
                                    }
                                }}
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-2">
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="flex justify-center mb-1 text-primary">
                                <GraduationCap className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold">{student.year}</div>
                            <div className="text-xs text-muted-foreground">Year</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="flex justify-center mb-1 text-primary">
                                <TrendingUp className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold">{student.gpa}</div>
                            <div className="text-xs text-muted-foreground">GPA</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="flex justify-center mb-1 text-primary">
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold">6</div>
                            <div className="text-xs text-muted-foreground">Courses</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Student Details</h4>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{student.email}</p>
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <Badge variant="outline" className="h-4 w-auto px-1 text-[10px] border-muted-foreground/40 text-muted-foreground">ID</Badge>
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{student.id}</p>
                                    <p className="text-xs text-muted-foreground">Student ID</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <Calendar className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{student.enrolled}</p>
                                    <p className="text-xs text-muted-foreground">Enrollment Date</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
