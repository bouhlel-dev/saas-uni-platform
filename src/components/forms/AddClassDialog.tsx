import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";

interface AddClassDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onClassAdded?: () => void;
    editingClass?: any | null;
}

export function AddClassDialog({ open, onOpenChange, onClassAdded, editingClass }: AddClassDialogProps) {
    const [formData, setFormData] = useState({
        name: "",
        department_id: "",
        specialization: "",
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
        if (open && editingClass) {
            // Find faculty for the department
            let facultyId = "";
            for (const faculty of faculties) {
                const dept = faculty.departments.find((d: any) => d.id === editingClass.department_id);
                if (dept) {
                    facultyId = faculty.id.toString();
                    break;
                }
            }

            setSelectedFaculty(facultyId);
            setFormData({
                name: editingClass.name || "",
                department_id: editingClass.department_id?.toString() || "",
                specialization: editingClass.specialization || "",
            });
        } else if (open) {
            setFormData({ name: "", department_id: "", specialization: "" });
            setSelectedFaculty("");
        }
    }, [open, editingClass, faculties]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Get department name for specialization if not provided
            let specialization = formData.specialization;
            if (!specialization && formData.department_id) {
                const dept = filteredDepartments.find(d => d.id.toString() === formData.department_id);
                if (dept) specialization = dept.name;
            }

            const payload = {
                name: formData.name,
                department_id: parseInt(formData.department_id),
                specialization: specialization
            };

            if (editingClass) {
                await api.put(`/admin/classes/${editingClass.id}`, payload);
            } else {
                await api.post('/admin/classes', payload);
            }

            toast({
                title: editingClass ? "Class Updated" : "Class Created",
                description: `${formData.name} has been successfully ${editingClass ? 'updated' : 'created'}.`,
            });
            onOpenChange(false);
            setFormData({ name: "", department_id: "", specialization: "" });
            setSelectedFaculty("");
            if (onClassAdded) onClassAdded();
        } catch (error: any) {
            console.error('Error saving class:', error);
            toast({
                title: "Error",
                description: error.message || `Failed to ${editingClass ? 'update' : 'create'} class`,
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
                        <DialogTitle>{editingClass ? 'Edit Class' : 'Create New Class'}</DialogTitle>
                        <DialogDescription>
                            {editingClass ? 'Update class details' : 'Add a new class to the system'}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Class Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g. CS-101-A"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
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
                                        {filteredDepartments.map((dept) => (
                                            <SelectItem key={dept.id} value={dept.id.toString()}>
                                                {dept.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="specialization">Specialization (Optional)</Label>
                            <Input
                                id="specialization"
                                placeholder="e.g. Computer Science"
                                value={formData.specialization}
                                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                            />
                            <p className="text-xs text-muted-foreground">Defaults to department name if left blank.</p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Saving...' : (editingClass ? 'Update Class' : 'Create Class')}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
