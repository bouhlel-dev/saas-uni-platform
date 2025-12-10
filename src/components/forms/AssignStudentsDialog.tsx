import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Search, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";

interface AssignStudentsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    classId: number;
    className: string;
    onAssignmentComplete: () => void;
}

export function AssignStudentsDialog({ open, onOpenChange, classId, className, onAssignmentComplete }: AssignStudentsDialogProps) {
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);

    useEffect(() => {
        if (open) {
            fetchStudents();
            setSelectedStudents([]);
            setSearchQuery("");
        }
    }, [open]);

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const data = await api.get('/admin/users/students');
            // Filter out students who are already in this class (optional, or show them as pre-selected)
            // For now, let's just show all students and maybe mark those in this class
            setStudents(data);

            // Pre-select students already in this class
            const inClass = data.filter((s: any) => s.class_id === classId).map((s: any) => s.id);
            setSelectedStudents(inClass);
        } catch (error) {
            console.error("Error fetching students:", error);
            toast({
                title: "Error",
                description: "Failed to load students",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const filteredStudents = students.filter(student =>
        student.User.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.User.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.student_id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleToggleStudent = (studentId: number) => {
        setSelectedStudents(prev =>
            prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId]
        );
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.post(`/admin/classes/${classId}/assign-students`, {
                studentIds: selectedStudents
            });

            toast({
                title: "Students Assigned",
                description: `Successfully updated student assignments for ${className}.`,
            });
            onAssignmentComplete();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error assigning students:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to assign students",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>Assign Students to {className}</DialogTitle>
                    <DialogDescription>
                        Select students to enroll in this class.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search students..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-hidden border rounded-md">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">Loading students...</div>
                    ) : (
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-2">
                                {filteredStudents.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-4">No students found.</p>
                                ) : (
                                    filteredStudents.map(student => (
                                        <div
                                            key={student.id}
                                            className="flex items-center space-x-3 p-2 hover:bg-muted/50 rounded-md cursor-pointer"
                                            onClick={() => handleToggleStudent(student.id)}
                                        >
                                            <Checkbox
                                                checked={selectedStudents.includes(student.id)}
                                                onCheckedChange={() => handleToggleStudent(student.id)}
                                            />
                                            <div className="flex-1">
                                                <p className="font-medium">{student.User.name}</p>
                                                <p className="text-xs text-muted-foreground">{student.student_id} • {student.specialization}</p>
                                            </div>
                                            {student.class_id && student.class_id !== classId && (
                                                <Badge variant="outline" className="text-xs">
                                                    In another class
                                                </Badge>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <p className="text-sm text-muted-foreground">
                        {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''} selected
                    </p>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button onClick={handleSave} disabled={saving || loading}>
                            {saving ? 'Saving...' : 'Save Assignments'}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
