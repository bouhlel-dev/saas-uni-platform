import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface MarkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MarkAttendanceDialog({ open, onOpenChange }: MarkAttendanceDialogProps) {
  const [course, setCourse] = useState("");
  const [attendance, setAttendance] = useState<Record<string, boolean>>({});

  const students = [
    { id: "S2024001", name: "John Anderson" },
    { id: "S2024002", name: "Emma Thompson" },
    { id: "S2024003", name: "Michael Chen" },
    { id: "S2024004", name: "Sarah Williams" },
    { id: "S2024005", name: "David Martinez" },
    { id: "S2024006", name: "Lisa Johnson" },
    { id: "S2024007", name: "Robert Brown" },
    { id: "S2024008", name: "Jennifer Davis" },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const presentCount = Object.values(attendance).filter(Boolean).length;
    toast({
      title: "Attendance Recorded",
      description: `${presentCount} out of ${students.length} students marked present.`,
    });
    onOpenChange(false);
    setCourse("");
    setAttendance({});
  };

  const toggleAll = (present: boolean) => {
    const newAttendance: Record<string, boolean> = {};
    students.forEach(student => {
      newAttendance[student.id] = present;
    });
    setAttendance(newAttendance);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Mark Class Attendance</DialogTitle>
            <DialogDescription>
              Record student attendance for today's class
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course">Select Course *</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cs401">CS401 - Advanced Machine Learning</SelectItem>
                  <SelectItem value="cs302">CS302 - Data Structures</SelectItem>
                  <SelectItem value="cs201">CS201 - Programming Basics</SelectItem>
                  <SelectItem value="cs403">CS403 - Neural Networks</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {course && (
              <>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => toggleAll(true)}>
                    Mark All Present
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggleAll(false)}>
                    Mark All Absent
                  </Button>
                  <Badge variant="secondary" className="ml-auto">
                    {Object.values(attendance).filter(Boolean).length}/{students.length} Present
                  </Badge>
                </div>

                <ScrollArea className="h-[300px] border rounded-md p-4">
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                        <div className="flex items-center gap-3">
                          <Checkbox
                            checked={attendance[student.id] || false}
                            onCheckedChange={(checked) => 
                              setAttendance({ ...attendance, [student.id]: checked as boolean })
                            }
                          />
                          <div>
                            <p className="font-medium">{student.name}</p>
                            <p className="text-sm text-muted-foreground">{student.id}</p>
                          </div>
                        </div>
                        <Badge variant={attendance[student.id] ? "default" : "outline"}>
                          {attendance[student.id] ? "Present" : "Absent"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!course}>Save Attendance</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
