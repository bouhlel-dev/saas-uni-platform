import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AddScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleAdded: () => void;
  editingSchedule?: any;
  defaultDay?: string;
  defaultTime?: string;
}

export function AddScheduleDialog({ open, onOpenChange, onScheduleAdded, editingSchedule, defaultDay, defaultTime }: AddScheduleDialogProps) {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    course_id: "",
    class_id: "",
    day: "",
    start_time: "",
    end_time: "",
    room: "",
  });

  // Get the teacher assigned to the selected course
  const selectedCourse = courses.find(c => c.id.toString() === formData.course_id);
  const assignedTeacherId = selectedCourse?.teacher_id;
  const assignedTeacherName = selectedCourse?.teacher || "Unknown";

  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          const [coursesData, classesData] = await Promise.all([
            api.get('/admin/courses'),
            api.get('/admin/classes')
          ]);
          setCourses(coursesData);
          setClasses(classesData || []);
        } catch (error) {
          console.error("Error fetching form data:", error);
        }
      };
      fetchData();

      if (editingSchedule) {
        // Parse time range like "09:00-11:00" into start and end times
        let startTime = "";
        let endTime = "";
        if (editingSchedule.time && editingSchedule.time.includes('-')) {
          const [start, end] = editingSchedule.time.split('-');
          startTime = start?.trim() || "";
          endTime = end?.trim() || "";
        } else if (editingSchedule.start_time && editingSchedule.end_time) {
          startTime = editingSchedule.start_time;
          endTime = editingSchedule.end_time;
        }

        setFormData({
          course_id: editingSchedule.course_id.toString(),
          class_id: editingSchedule.class_id?.toString() || "",
          day: editingSchedule.day_of_week || editingSchedule.day,
          start_time: startTime,
          end_time: endTime,
          room: editingSchedule.room,
        });
      } else {
        // Parse defaultTime if it's a range
        let startTime = "";
        let endTime = "";
        if (defaultTime && defaultTime.includes('-')) {
          const [start, end] = defaultTime.split('-');
          startTime = start?.trim() || "";
          endTime = end?.trim() || "";
        } else if (defaultTime) {
          startTime = defaultTime;
        }

        setFormData({
          course_id: "",
          class_id: "",
          day: defaultDay || "",
          start_time: startTime,
          end_time: endTime,
          room: "",
        });
      }
    }
  }, [open, editingSchedule, defaultDay, defaultTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Combine start_time and end_time into a single time range string
      const timeRange = formData.start_time && formData.end_time 
        ? `${formData.start_time}-${formData.end_time}` 
        : formData.start_time;

      // Convert string IDs to integers, handle empty values
      // Use the teacher assigned to the course
      const payload = {
        course_id: formData.course_id ? parseInt(formData.course_id) : null,
        teacher_id: assignedTeacherId || null,
        class_id: formData.class_id ? parseInt(formData.class_id) : null,
        day_of_week: formData.day,
        start_time: formData.start_time,
        end_time: formData.end_time,
        time: timeRange,
        room: formData.room,
      };

      // Validate required fields
      if (!payload.course_id || !payload.day_of_week || !payload.start_time || !payload.end_time || !payload.room) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      if (editingSchedule) {
        await api.put(`/schedule/${editingSchedule.id}`, payload);
        toast({
          title: "Schedule Updated",
          description: "The class schedule has been successfully updated.",
        });
      } else {
        await api.post('/schedule', payload);
        toast({
          title: "Schedule Added",
          description: "The class schedule has been successfully created.",
        });
      }
      onScheduleAdded();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error saving schedule:', error);
      const message = error?.message || "Failed to save schedule";
      toast({
        title: "Error",
        description: message.includes("conflict") 
          ? "Schedule conflict detected. The teacher, room, or class is already booked at this time." 
          : message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'Add Class Schedule'}</DialogTitle>
            <DialogDescription>
              {editingSchedule ? 'Update existing schedule entry' : 'Create a new schedule entry for a course'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="course">Select Course *</Label>
              <Select value={formData.course_id} onValueChange={(value) => setFormData({ ...formData, course_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((course) => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assigned Teacher</Label>
              <Input
                value={formData.course_id ? assignedTeacherName : "Select a course first"}
                disabled
                className="bg-muted"
              />
            </div>

            {/* We need a class/group selection too, assuming backend requires it */}
            <div className="space-y-2">
              <Label htmlFor="class">Select Class/Group</Label>
              <Select value={formData.class_id} onValueChange={(value) => setFormData({ ...formData, class_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a class (Optional)" />
                </SelectTrigger>
                <SelectContent>
                  {classes.length > 0 ? (
                    classes.map((cls: any) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="p-2 text-sm text-muted-foreground text-center">No classes found</div>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="day">Day of Week *</Label>
              <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Monday">Monday</SelectItem>
                  <SelectItem value="Tuesday">Tuesday</SelectItem>
                  <SelectItem value="Wednesday">Wednesday</SelectItem>
                  <SelectItem value="Thursday">Thursday</SelectItem>
                  <SelectItem value="Friday">Friday</SelectItem>
                  <SelectItem value="Saturday">Saturday</SelectItem>
                  <SelectItem value="Sunday">Sunday</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_time">End Time *</Label>
                <Input
                  id="end_time"
                  type="time"
                  value={formData.end_time}
                  onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="room">Room/Location *</Label>
              <Input
                id="room"
                placeholder="Lab 301"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingSchedule ? 'Update Schedule' : 'Add Schedule')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
