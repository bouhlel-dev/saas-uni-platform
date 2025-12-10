import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { api } from "@/lib/api";

interface MarkAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

interface Course {
  id: number;
  title: string;
  code?: string;
}

interface Class {
  id: number;
  name: string;
}

interface Student {
  id: number;
  user_id: number;
  name: string;
  email: string;
  class_name?: string;
}

export function MarkAttendanceDialog({ open, onOpenChange, onSuccess }: MarkAttendanceDialogProps) {
  const [courseId, setCourseId] = useState("");
  const [classId, setClassId] = useState("");
  const [attendance, setAttendance] = useState<Record<number, 'present' | 'absent' | 'excused'>>({});
  const [courses, setCourses] = useState<Course[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch courses on dialog open
  useEffect(() => {
    if (open) {
      const fetchCourses = async () => {
        try {
          const data = await api.get('/teacher/courses');
          setCourses(data);
        } catch (error) {
          console.error('Error fetching courses:', error);
          toast({ title: "Error", description: "Failed to load courses", variant: "destructive" });
        }
      };
      fetchCourses();
    } else {
      // Reset state when dialog closes
      setCourseId("");
      setClassId("");
      setClasses([]);
      setStudents([]);
      setAttendance({});
    }
  }, [open]);

  // Fetch classes when course changes
  useEffect(() => {
    if (courseId) {
      const fetchClasses = async () => {
        setLoadingClasses(true);
        setClassId("");
        setStudents([]);
        setAttendance({});
        try {
          const data = await api.get(`/teacher/courses/${courseId}/classes`);
          setClasses(data);
        } catch (error) {
          console.error('Error fetching classes:', error);
          toast({ title: "Error", description: "Failed to load classes", variant: "destructive" });
        } finally {
          setLoadingClasses(false);
        }
      };
      fetchClasses();
    } else {
      setClasses([]);
      setClassId("");
      setStudents([]);
      setAttendance({});
    }
  }, [courseId]);

  // Fetch students when class changes
  useEffect(() => {
    if (classId) {
      const fetchStudents = async () => {
        setLoading(true);
        try {
          const data = await api.get(`/teacher/classes/${classId}/students`);
          setStudents(data);
          // Initialize all as present by default
          const initialAttendance: Record<number, 'present' | 'absent' | 'excused'> = {};
          data.forEach((student: Student) => {
            initialAttendance[student.id] = 'present';
          });
          setAttendance(initialAttendance);
        } catch (error) {
          console.error('Error fetching students:', error);
          toast({ title: "Error", description: "Failed to load students", variant: "destructive" });
        } finally {
          setLoading(false);
        }
      };
      fetchStudents();
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [classId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseId || !classId || students.length === 0) return;

    setSubmitting(true);
    try {
      // Group students by status
      const presentIds = Object.entries(attendance)
        .filter(([_, status]) => status === 'present')
        .map(([id]) => parseInt(id));
      const absentIds = Object.entries(attendance)
        .filter(([_, status]) => status === 'absent')
        .map(([id]) => parseInt(id));

      // Send attendance data
      await api.post('/teacher/attendance', {
        courseId: parseInt(courseId),
        classId: parseInt(classId),
        studentIds: Object.keys(attendance).map(id => parseInt(id)),
        date: new Date().toISOString().split('T')[0],
        records: Object.entries(attendance).map(([studentId, status]) => ({
          student_id: parseInt(studentId),
          status
        }))
      });

      toast({
        title: "Attendance Recorded",
        description: `${presentIds.length} present, ${absentIds.length} absent out of ${students.length} students.`,
      });
      
      onOpenChange(false);
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error marking attendance:', error);
      toast({ title: "Error", description: "Failed to save attendance", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAll = (status: 'present' | 'absent') => {
    const newAttendance: Record<number, 'present' | 'absent' | 'excused'> = {};
    students.forEach(student => {
      newAttendance[student.id] = status;
    });
    setAttendance(newAttendance);
  };

  const presentCount = Object.values(attendance).filter(s => s === 'present').length;

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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Select Course *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id.toString()}>
                        {course.code || `CS${course.id}`} - {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="class">Select Class *</Label>
                <Select value={classId} onValueChange={setClassId} disabled={!courseId || loadingClasses}>
                  <SelectTrigger>
                    <SelectValue placeholder={loadingClasses ? "Loading..." : "Choose a class"} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {classId && (
              <>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => toggleAll('present')}>
                    Mark All Present
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={() => toggleAll('absent')}>
                    Mark All Absent
                  </Button>
                  <Badge variant="secondary" className="ml-auto">
                    {presentCount}/{students.length} Present
                  </Badge>
                </div>

                {loading ? (
                  <div className="text-center py-4">Loading students...</div>
                ) : students.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">No students enrolled in this course</div>
                ) : (
                  <ScrollArea className="h-[300px] border rounded-md p-4">
                    <div className="space-y-3">
                      {students.map((student) => (
                        <div key={student.id} className="flex items-center justify-between p-2 hover:bg-muted rounded-lg">
                          <div className="flex items-center gap-3">
                            <Checkbox
                              checked={attendance[student.id] === 'present'}
                              onCheckedChange={(checked) => 
                                setAttendance({ ...attendance, [student.id]: checked ? 'present' : 'absent' })
                              }
                            />
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-sm text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                          <Badge variant={attendance[student.id] === 'present' ? "default" : "outline"}>
                            {attendance[student.id] === 'present' ? "Present" : "Absent"}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={!courseId || !classId || students.length === 0 || submitting}>
              {submitting ? "Saving..." : "Save Attendance"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
