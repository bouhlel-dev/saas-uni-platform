import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, Clock, GraduationCap, MapPin, FileCheck, AlertCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ExamDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exam: any;
}

export function ExamDetailsDialog({ open, onOpenChange, exam }: ExamDetailsDialogProps) {
    if (!exam) return null;

    const initials = exam.title ? exam.title.split(' ').map((n: string) => n[0]).slice(0, 2).join('') : 'E';

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
                            <DialogTitle className="text-xl">{exam.title}</DialogTitle>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Badge variant="secondary">{exam.course}</Badge>
                                <Badge variant={exam.status === "Scheduled" ? "default" : "outline"}>
                                    {exam.status}
                                </Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/20 transition-colors">
                            <div className="flex justify-center mb-2 text-primary">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div className="text-xl font-bold">{exam.duration}</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Duration</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/20 transition-colors">
                            <div className="flex justify-center mb-2 text-primary">
                                <MapPin className="w-5 h-5" />
                            </div>
                            <div className="text-xl font-bold">{exam.room}</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Room</div>
                        </div>
                        <div className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/20 transition-colors">
                            <div className="flex justify-center mb-2 text-primary">
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <div className="text-xl font-bold">{exam.className || "All Classes"}</div>
                            <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Class</div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg border">
                            <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm">
                                <Calendar className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                                <p className="font-bold text-lg">{exam.date}</p>
                                <p className="text-sm text-muted-foreground">Exam Date</p>
                            </div>
                            <div className="ml-auto text-right">
                                <p className="font-bold text-lg">{exam.time}</p>
                                <p className="text-sm text-muted-foreground">Start Time</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-950/30 dark:text-blue-300 dark:border-blue-900">
                            <AlertCircle className="w-5 h-5" />
                            <p className="text-sm">
                                This is a <strong>{exam.type}</strong> exam. Please ensure all materials are prepared.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    {exam.status === "Completed" && (
                        <Button>View Results</Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
