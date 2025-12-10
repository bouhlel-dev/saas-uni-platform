import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AddStudentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStudentAdded?: () => void;
  editingStudent?: any | null;
}

export function AddStudentDialog({ open, onOpenChange, onStudentAdded, editingStudent }: AddStudentDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    studentId: "",
    department: "",
    year: "",
  });
  const [loading, setLoading] = useState(false);

  const [faculties, setFaculties] = useState<any[]>([]);
  const [selectedFaculty, setSelectedFaculty] = useState<string>("");
  const [filteredDepartments, setFilteredDepartments] = useState<any[]>([]);

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const data = await api.get('/admin/faculties');
        setFaculties(data);
      } catch (error) {
        console.error("Error fetching faculties:", error);
      }
    };
    fetchFaculties();
  }, []);

  useEffect(() => {
    if (selectedFaculty) {
      const faculty = faculties.find(f => f.id.toString() === selectedFaculty);
      setFilteredDepartments(faculty ? faculty.departments : []);
    } else {
      setFilteredDepartments([]);
    }
  }, [selectedFaculty, faculties]);

  useEffect(() => {
    if (open && editingStudent) {
      setFormData({
        name: editingStudent.name || editingStudent.User?.name || "",
        email: editingStudent.email || editingStudent.User?.email || "",
        studentId: editingStudent.student_id || editingStudent.id || "",
        department: editingStudent.department || "",
        year: editingStudent.year?.toString() || "",
      });
      // Try to find the faculty for the student's department if possible
      // This might require more logic if we don't have faculty_id in student data
    } else if (open) {
      setFormData({ name: "", email: "", studentId: "", department: "", year: "" });
      setSelectedFaculty("");
    }
  }, [open, editingStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        student_id: formData.studentId,
        password: 'password123', // Default password for new students
        specialization: formData.department, // Send department name as specialization
        enrollment_year: formData.year // Send year
      };

      if (editingStudent) {
        // Note: Backend might not have update endpoint yet, this is for future implementation
        await api.put(`/admin/users/students/${editingStudent.pk || editingStudent.id}`, payload);
      } else {
        await api.post('/admin/users/students', payload);
      }

      toast({
        title: editingStudent ? "Student Updated" : "Student Registered",
        description: `${formData.name} has been successfully ${editingStudent ? 'updated' : 'enrolled'}.`,
      });
      onOpenChange(false);
      setFormData({ name: "", email: "", studentId: "", department: "", year: "" });
      setSelectedFaculty("");
      if (onStudentAdded) onStudentAdded();
    } catch (error: any) {
      console.error('Error saving student:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingStudent ? 'update' : 'create'} student`,
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
            <DialogTitle>{editingStudent ? 'Edit Student' : 'Register New Student'}</DialogTitle>
            <DialogDescription>
              {editingStudent ? 'Update student information' : 'Add a new student to the university system'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="studentId">Student ID *</Label>
              <Input
                id="studentId"
                placeholder="STU2024001"
                value={formData.studentId}
                onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                required
                disabled={!!editingStudent}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty</Label>
                <Select value={selectedFaculty} onValueChange={setSelectedFaculty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select faculty" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id.toString()}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                  disabled={!selectedFaculty}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.name}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="year">Year</Label>
              <Select value={formData.year} onValueChange={(value) => setFormData({ ...formData, year: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingStudent ? 'Update Student' : 'Register Student')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
