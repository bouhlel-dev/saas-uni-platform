import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mail, Phone, MapPin, BookOpen, Users, Star, Edit, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TeacherProfileDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    teacher: any;
    onEdit: (teacher: any) => void;
    onDelete: (id: number) => void;
}

export function TeacherProfileDialog({ open, onOpenChange, teacher, onEdit, onDelete }: TeacherProfileDialogProps) {
    if (!teacher) return null;

    const initials = teacher.name ? teacher.name.split(' ').map((n: string) => n[0]).join('') : 'T';

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                                <AvatarImage src={teacher.avatar} />
                                <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
                                    {initials}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <DialogTitle className="text-xl">{teacher.name}</DialogTitle>
                                <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                    <span>{teacher.specialization} Department</span>
                                    <Badge variant="secondary" className="text-xs font-normal">Active</Badge>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                onClick={() => onEdit(teacher)}
                            >
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => {
                                    if (confirm("Are you sure you want to delete this teacher?")) {
                                        onDelete(teacher.id);
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
                                <BookOpen className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold">{teacher.courses}</div>
                            <div className="text-xs text-muted-foreground">Courses</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="flex justify-center mb-1 text-primary">
                                <Users className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold">{teacher.students}</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                        </div>
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                            <div className="flex justify-center mb-1 text-primary">
                                <Star className="w-4 h-4" />
                            </div>
                            <div className="text-lg font-bold">4.8</div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Contact Details</h4>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{teacher.email}</p>
                                    <p className="text-xs text-muted-foreground">Email Address</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">{teacher.phone || 'N/A'}</p>
                                    <p className="text-xs text-muted-foreground">Phone Number</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                    <MapPin className="w-4 h-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Building A, Room 304</p>
                                    <p className="text-xs text-muted-foreground">Office Location</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
