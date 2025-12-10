import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AddTeacherDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeacherAdded?: () => void;
  editingTeacher?: any | null;
}

export function AddTeacherDialog({ open, onOpenChange, onTeacherAdded, editingTeacher }: AddTeacherDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
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
    if (open && editingTeacher) {
      setFormData({
        name: editingTeacher.name || editingTeacher.User?.name || "",
        email: editingTeacher.email || editingTeacher.User?.email || "",
        phone: editingTeacher.phone || "",
        department: editingTeacher.specialization || editingTeacher.department || "",
      });
    } else if (open) {
      setFormData({ name: "", email: "", phone: "", department: "" });
      setSelectedFaculty("");
    }
  }, [open, editingTeacher]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: 'password123', // Default password for new teachers
        specialization: formData.department,
      };

      if (editingTeacher) {
        // Note: Backend might not have update endpoint yet, this is for future implementation
        await api.put(`/admin/users/teachers/${editingTeacher.id}`, payload);
      } else {
        await api.post('/admin/users/teachers', payload);
      }

      toast({
        title: editingTeacher ? "Teacher Updated" : "Teacher Added",
        description: `${formData.name} has been successfully ${editingTeacher ? 'updated' : 'registered'}.`,
      });
      onOpenChange(false);
      setFormData({ name: "", email: "", phone: "", department: "" });
      setSelectedFaculty("");
      if (onTeacherAdded) onTeacherAdded();
    } catch (error: any) {
      console.error('Error saving teacher:', error);
      toast({
        title: "Error",
        description: error.message || `Failed to ${editingTeacher ? 'update' : 'create'} teacher`,
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
            <DialogTitle>{editingTeacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
            <DialogDescription>
              {editingTeacher ? 'Update teacher information' : 'Register a new teaching staff member'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Dr. Jane Smith"
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
                placeholder="teacher@university.edu"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                <Label htmlFor="department">Department/Specialization *</Label>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingTeacher ? 'Update Teacher' : 'Add Teacher')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
