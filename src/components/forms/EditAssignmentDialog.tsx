import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface EditAssignmentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    assignment: any;
    onSave: (updatedAssignment: any) => void;
}

export function EditAssignmentDialog({ open, onOpenChange, assignment, onSave }: EditAssignmentDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        points: "",
        course: "",
    });
    const [date, setDate] = useState<Date>();
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (assignment) {
            setFormData({
                title: assignment.title || "",
                description: assignment.description || "",
                dueDate: assignment.dueDate || "",
                points: assignment.points || "",
                course: assignment.course || "",
            });
            // Parse date string if possible, otherwise leave undefined
            // This is a simplification
        }
    }, [assignment]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Call the backend API to update the assignment
            const payload = {
                title: formData.title,
                description: formData.description,
                deadline: date ? date.toISOString() : undefined,
            };

            await api.put(`/assignments/${assignment.id}`, payload);

            const updatedAssignment = {
                ...assignment,
                ...formData,
                dueDate: date ? format(date, "PPP") : formData.dueDate,
            };

            onSave(updatedAssignment);

            toast({
                title: "Assignment Updated",
                description: `${formData.title} has been updated successfully.`,
            });
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error updating assignment:', error);
            toast({
                title: "Error",
                description: error?.message || "Failed to update assignment",
                variant: "destructive"
            });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Edit Assignment</DialogTitle>
                        <DialogDescription>
                            Update assignment details and requirements
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="course">Course</Label>
                            <Input
                                id="course"
                                value={formData.course}
                                disabled
                                className="bg-muted"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Assignment Title *</Label>
                            <Input
                                id="title"
                                placeholder="e.g., ML Model Implementation"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Due Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : (formData.dueDate || "Pick a date")}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={setDate}
                                            initialFocus
                                            className="pointer-events-auto"
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="points">Total Points *</Label>
                                <Input
                                    id="points"
                                    type="number"
                                    placeholder="100"
                                    value={formData.points}
                                    onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="Enter assignment instructions..."
                                className="min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Changes"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
