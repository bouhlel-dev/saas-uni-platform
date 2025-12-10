import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AddCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCourseAdded?: () => void;
  editingCourse?: any | null;
}

export function AddCourseDialog({ open, onOpenChange, onCourseAdded, editingCourse }: AddCourseDialogProps) {
  const [formData, setFormData] = useState({
    code: "", // For display only, not sent to backend
    name: "",
    department_id: "",
    teacher_id: "",
    credits: "",
    semester: "1", // Changed to number string (1 = Fall, 2 = Spring, etc.)
    description: "",
  });

  const [teachers, setTeachers] = useState<any[]>([]);
  const [faculties, setFaculties] = useState<any[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch teachers and faculties when dialog opens
  useEffect(() => {
    if (open) {
      const fetchData = async () => {
        try {
          // Fetch Teachers
          const teachersData = await api.get('/admin/users/teachers');
          setTeachers(teachersData);

          // Fetch Faculties (which contain departments)
          const facultiesData = await api.get('/admin/faculties');
          setFaculties(facultiesData);

        } catch (error) {
          console.error("Error fetching form data:", error);
          setFaculties([]);
        }
      };
      fetchData();

      // Populate form if editing
      if (editingCourse) {
        setFormData({
          code: editingCourse.code || "",
          name: editingCourse.title || editingCourse.name || "",
          department_id: editingCourse.department_id?.toString() || "",
          teacher_id: editingCourse.teacher_id?.toString() || "",
          credits: editingCourse.credits?.toString() || "",
          semester: editingCourse.semester?.toString() || "1",
          description: editingCourse.description || "",
        });
        // Logic to set selectedFaculty based on department_id could be added here if needed
        // For now, user might need to re-select faculty if they want to change department
      } else {
        setFormData({ code: "", name: "", department_id: "", teacher_id: "", credits: "", semester: "1", description: "" });
        setSelectedFaculty("");
      }
    }
  }, [open, editingCourse]);

  // Filter departments when faculty changes
  useEffect(() => {
    if (selectedFaculty) {
      const faculty = faculties.find(f => f.id.toString() === selectedFaculty);
      setFilteredDepartments(faculty ? faculty.departments : []);
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedFaculty, faculties]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.name,
        credits: parseInt(formData.credits),
        semester: parseInt(formData.semester), // Send as integer
        department_id: parseInt(formData.department_id) || 1,
        teacher_id: formData.teacher_id ? parseInt(formData.teacher_id, 10) : null
      };

      if (editingCourse) {
        await api.put(`/courses/${editingCourse.id}`, payload);
      } else {
        await api.post('/courses', payload);
      }

      toast({
        title: editingCourse ? "Course Updated" : "Course Created",
        description: `${formData.name} has been successfully ${editingCourse ? 'updated' : 'added'}.`,
      });

      onOpenChange(false);
      setFormData({ code: "", name: "", department_id: "", teacher_id: "", credits: "", semester: "1", description: "" });
      setSelectedFaculty("");
      if (onCourseAdded) onCourseAdded();

    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create course",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editingCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Update course information' : 'Create a new course and assign it to a department'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Course Code *</Label>
                <Input
                  id="code"
                  placeholder="CS401"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits">Credits *</Label>
                <Input
                  id="credits"
                  type="number"
                  min="1"
                  max="6"
                  placeholder="4"
                  value={formData.credits}
                  onChange={(e) => setFormData({ ...formData, credits: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                placeholder="Advanced Machine Learning"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty *</Label>
                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map(faculty => (
                      <SelectItem key={faculty.id} value={faculty.id.toString()}>{faculty.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department_id}
                  onValueChange={(value) => setFormData({ ...formData, department_id: value })}
                  disabled={!selectedFaculty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDepartments.map(dept => (
                      <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select value={formData.semester} onValueChange={(value) => setFormData({ ...formData, semester: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Semester 1</SelectItem>
                  <SelectItem value="2">Semester 2</SelectItem>
                  <SelectItem value="3">Semester 3</SelectItem>
                  <SelectItem value="4">Semester 4</SelectItem>
                  <SelectItem value="5">Semester 5</SelectItem>
                  <SelectItem value="6">Semester 6</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="teacher">Assign Teacher *</Label>
              <Select value={formData.teacher_id} onValueChange={(value) => setFormData({ ...formData, teacher_id: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map(teacher => (
                    <SelectItem key={teacher.id} value={teacher.id.toString()}>
                      {teacher.User ? teacher.User.name : `Teacher ${teacher.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Course Description</Label>
              <Textarea
                id="description"
                placeholder="Brief description of the course..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>{loading ? (editingCourse ? 'Updating...' : 'Creating...') : (editingCourse ? 'Update Course' : 'Create Course')}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
