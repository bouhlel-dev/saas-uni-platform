import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Plus, Trash2, X } from "lucide-react";

interface Department {
  id?: number;
  name: string;
}

interface AddFacultyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFacultyAdded?: () => void;
  editingFaculty?: {
    id: number;
    name: string;
    departments: Department[]
  } | null;
}

export function AddFacultyDialog({ open, onOpenChange, onFacultyAdded, editingFaculty }: AddFacultyDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [originalDepartments, setOriginalDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (editingFaculty) {
        setName(editingFaculty.name);
        // Deep copy to avoid mutating prop
        const depts = editingFaculty.departments.map(d => ({ ...d }));
        setDepartments(depts);
        setOriginalDepartments(depts);
        setDescription(""); // Description is not currently in the backend model for update
      } else {
        setName("");
        setDepartments([]);
        setOriginalDepartments([]);
        setDescription("");
      }
    }
  }, [editingFaculty, open]);

  const handleAddDepartmentRow = () => {
    setDepartments([...departments, { name: "" }]);
  };

  const handleDepartmentChange = (index: number, value: string) => {
    const newDepts = [...departments];
    newDepts[index].name = value;
    setDepartments(newDepts);
  };

  const handleRemoveDepartmentRow = (index: number) => {
    const newDepts = [...departments];
    newDepts.splice(index, 1);
    setDepartments(newDepts);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingFaculty) {
        // 1. Update Faculty Name
        if (name !== editingFaculty.name) {
          await api.put(`/admin/faculties/${editingFaculty.id}`, { name });
        }

        // 2. Handle Departments
        const promises = [];

        // Updates and Creates
        for (const dept of departments) {
          if (dept.id) {
            // Update existing if changed
            const original = originalDepartments.find(d => d.id === dept.id);
            if (original && original.name !== dept.name) {
              promises.push(api.put(`/admin/departments/${dept.id}`, { name: dept.name }));
            }
          } else if (dept.name.trim()) {
            // Create new
            promises.push(api.post('/admin/departments', {
              name: dept.name,
              faculty_id: editingFaculty.id
            }));
          }
        }

        // Deletes
        const currentIds = departments.filter(d => d.id).map(d => d.id);
        const toDelete = originalDepartments.filter(d => d.id && !currentIds.includes(d.id));

        for (const dept of toDelete) {
          if (dept.id) {
            promises.push(api.delete(`/admin/departments/${dept.id}`));
          }
        }

        await Promise.all(promises);

        toast({
          title: "Faculty Updated",
          description: "Faculty and departments have been updated successfully.",
        });

      } else {
        // Create Mode
        const payload = {
          name,
          university_id: 1, // Default
          departments: departments.map(d => d.name).filter(name => name.trim() !== "") // Send array of names
        };
        await api.post('/admin/faculties', payload);

        toast({
          title: "Faculty Created",
          description: "New faculty has been added successfully.",
        });
      }

      onOpenChange(false);
      if (onFacultyAdded) onFacultyAdded();

    } catch (error) {
      console.error('Error saving faculty:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to save faculty",
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
            <DialogTitle>{editingFaculty ? 'Edit Faculty' : 'Add New Faculty'}</DialogTitle>
            <DialogDescription>
              {editingFaculty ? 'Update faculty details and manage departments' : 'Create a new faculty and define its departments'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Faculty Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Engineering & Technology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Departments</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleAddDepartmentRow}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Department
                </Button>
              </div>

              <div className="space-y-3">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={dept.name}
                      onChange={(e) => handleDepartmentChange(index, e.target.value)}
                      placeholder="Department Name"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleRemoveDepartmentRow(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {departments.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-md">
                    No departments. Add one to get started.
                  </p>
                )}
              </div>
            </div>

            {!editingFaculty && (
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Brief description of the faculty..."
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : (editingFaculty ? 'Save Changes' : 'Create Faculty')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
