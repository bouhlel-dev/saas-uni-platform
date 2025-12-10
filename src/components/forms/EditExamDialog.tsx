import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { formatDate } from "@/lib/formatUtils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Loader2 } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";

interface EditExamDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    exam: any;
    onSave: (updatedExam: any) => void;
}

export function EditExamDialog({ open, onOpenChange, exam, onSave }: EditExamDialogProps) {
    const [formData, setFormData] = useState({
        title: "",
        course: "",
        type: "",
        duration: "",
        room: "",
        time: "",
    });
    const [date, setDate] = useState<Date>();
    const [saving, setSaving] = useState(false);

    // Helper function to convert 12-hour format to 24-hour format
    const convertTo24Hour = (time12h: string): string => {
        if (!time12h) return "10:00";
        
        // If already in 24-hour format (HH:mm), return as-is
        if (/^\d{2}:\d{2}$/.test(time12h)) {
            return time12h;
        }
        
        // Try to parse 12-hour format (e.g., "10:20 PM" or "10:20PM")
        const match = time12h.match(/^(\d{1,2}):(\d{2})\s*(AM|PM|am|pm)?$/i);
        if (!match) return "10:00";
        
        let hours = parseInt(match[1], 10);
        const minutes = match[2];
        const period = match[3]?.toUpperCase();
        
        if (period === "PM" && hours !== 12) {
            hours += 12;
        } else if (period === "AM" && hours === 12) {
            hours = 0;
        }
        
        return `${hours.toString().padStart(2, '0')}:${minutes}`;
    };

    useEffect(() => {
        if (exam) {
            setFormData({
                title: exam.title || "",
                course: exam.course || "",
                type: (exam.type || "").toLowerCase(),
                duration: exam.duration ? exam.duration.replace(' min', '') : "60",
                room: exam.room || "TBD",
                time: convertTo24Hour(exam.time || "10:00"),
            });
            if (exam.date) {
                // Try to parse the date - it might be in various formats
                let parsedDate = new Date(exam.date);
                
                // If that doesn't work, try parsing "PPP" format (e.g., "November 29, 2025")
                if (!isValid(parsedDate)) {
                    try {
                        parsedDate = parse(exam.date, "PPP", new Date());
                    } catch (e) {
                        // If parsing fails, leave date undefined
                        parsedDate = new Date(); // Default to today
                    }
                }
                
                if (isValid(parsedDate)) {
                    setDate(parsedDate);
                }
            }
        }
    }, [exam]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            // Call the backend API to update the exam
            const payload = {
                type: formData.type,
                date: date ? date.toISOString() : undefined,
                duration: parseInt(formData.duration),
                room: formData.room,
                time: formData.time
            };

            await api.put(`/exams/${exam.id}`, payload);

            const updatedExam = {
                ...exam,
                ...formData,
                date: date ? format(date, "PPP") : exam.date,
                duration: `${formData.duration} min`
            };

            onSave(updatedExam);

            toast({
                title: "Exam Updated",
                description: `${formData.title} has been updated successfully.`,
            });
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error updating exam:', error);
            toast({
                title: "Error",
                description: error?.message || "Failed to update exam",
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
                        <DialogTitle>Edit Exam</DialogTitle>
                        <DialogDescription>
                            Update exam schedule and details
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Exam Type *</Label>
                                <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="midterm">Midterm</SelectItem>
                                        <SelectItem value="final">Final</SelectItem>
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Duration (minutes) *</Label>
                                <Select value={formData.duration} onValueChange={(value) => setFormData({ ...formData, duration: value })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select duration" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="30">30 minutes</SelectItem>
                                        <SelectItem value="60">60 minutes</SelectItem>
                                        <SelectItem value="90">90 minutes</SelectItem>
                                        <SelectItem value="120">120 minutes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date *</Label>
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
                                            {date ? format(date, "PPP") : "Pick a date"}
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
                                <Label htmlFor="time">Time *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        id="time"
                                        type="time"
                                        className="pl-10"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="room">Room / Location</Label>
                            <Input
                                id="room"
                                placeholder="e.g. Hall A, Room 302"
                                value={formData.room}
                                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
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
