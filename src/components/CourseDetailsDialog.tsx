import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, FileText, Calendar, Clock, Download, ChevronLeft, Loader2, Pencil, Trash2, Save, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/formatUtils";
import { toast } from "@/hooks/use-toast";

interface CourseDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: any;
}

export function CourseDetailsDialog({ open, onOpenChange, course }: CourseDetailsDialogProps) {
    const [showMaterials, setShowMaterials] = useState(false);
    const [materials, setMaterials] = useState<any[]>([]);
    const [loadingMaterials, setLoadingMaterials] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<any>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [saving, setSaving] = useState(false);

    // Get user role from localStorage
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    const userRole = user?.role || 'student';

    if (!course) return null;

    const initials = course.name ? course.name.split(' ').map((n: string) => n[0]).join('') : 'C';

    const handleViewMaterials = async () => {
        setShowMaterials(true);
        setLoadingMaterials(true);
        try {
            const courseId = course.id?.toString().replace(/\D/g, '') || course.code?.replace(/\D/g, '');
            const endpoint = userRole === 'teacher'
                ? `/teacher/courses/${courseId}/materials`
                : `/student/courses/${courseId}/materials`;
            const data = await api.get(endpoint);
            setMaterials(data);
        } catch (error) {
            console.error("Failed to fetch materials", error);
        } finally {
            setLoadingMaterials(false);
        }
    };

    const handleDeleteMaterial = async (materialId: number) => {
        if (!confirm('Are you sure you want to delete this material?')) return;
        try {
            await api.delete(`/teacher/materials/${materialId}`);
            setMaterials(materials.filter(m => m.id !== materialId));
            toast({ title: "Success", description: "Material deleted successfully" });
        } catch (error) {
            console.error("Failed to delete material", error);
            toast({ title: "Error", description: "Failed to delete material", variant: "destructive" });
        }
    };

    const handleEditMaterial = (material: any) => {
        setEditingMaterial(material);
        setEditTitle(material.title);
        setEditDescription(material.description || "");
    };

    const handleSaveEdit = async () => {
        if (!editingMaterial || !editTitle.trim()) {
            toast({ title: "Error", description: "Title is required", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            await api.put(`/teacher/materials/${editingMaterial.id}`, {
                title: editTitle,
                description: editDescription
            });
            setMaterials(materials.map(m =>
                m.id === editingMaterial.id
                    ? { ...m, title: editTitle, description: editDescription }
                    : m
            ));
            setEditingMaterial(null);
            toast({ title: "Success", description: "Material updated successfully" });
        } catch (error) {
            console.error("Failed to update material", error);
            toast({ title: "Error", description: "Failed to update material", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(val) => {
            onOpenChange(val);
            if (!val) {
                setShowMaterials(false);
                setEditingMaterial(null);
            }
        }}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <div className="flex items-start gap-4">
                        <Avatar className="w-16 h-16 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <DialogTitle className="text-xl">{course.name}</DialogTitle>
                            <DialogDescription className="sr-only">
                                Course details and materials for {course.name}
                            </DialogDescription>
                            <div className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                                <Badge variant="outline">{course.code || `CS${course.id}`}</Badge>
                                <Badge variant="secondary" className="text-xs font-normal">Active Semester</Badge>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="py-4">
                    {editingMaterial ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Button variant="ghost" size="sm" onClick={() => setEditingMaterial(null)} className="p-0 h-auto hover:bg-transparent">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back to Materials
                                </Button>
                                <h3 className="font-semibold text-lg ml-auto">Edit Material</h3>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="edit-title">Title</Label>
                                    <Input
                                        id="edit-title"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        placeholder="Material title"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="edit-description">Description</Label>
                                    <Textarea
                                        id="edit-description"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Material description"
                                        rows={4}
                                    />
                                </div>
                                <div className="flex gap-2 justify-end">
                                    <Button variant="outline" onClick={() => setEditingMaterial(null)}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                    <Button onClick={handleSaveEdit} disabled={saving}>
                                        {saving ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>
                                        ) : (
                                            <><Save className="w-4 h-4 mr-2" />Save Changes</>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : showMaterials ? (
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <Button variant="ghost" size="sm" onClick={() => setShowMaterials(false)} className="p-0 h-auto hover:bg-transparent">
                                    <ChevronLeft className="w-4 h-4 mr-1" />
                                    Back to Details
                                </Button>
                                <h3 className="font-semibold text-lg ml-auto">Course Materials</h3>
                            </div>

                            {loadingMaterials ? (
                                <div className="text-center py-8">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                                    <p className="text-sm text-muted-foreground mt-2">Loading materials...</p>
                                </div>
                            ) : materials.length === 0 ? (
                                <div className="text-center py-8 border rounded-lg bg-muted/20">
                                    <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-2" />
                                    <p className="text-muted-foreground">No materials uploaded yet.</p>
                                </div>
                            ) : (
                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                                    {materials.map((material) => (
                                        <div key={material.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-start gap-3 flex-1">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                                    <FileText className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-sm">{material.title}</h4>
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{material.description}</p>
                                                    <p className="text-[10px] text-muted-foreground mt-1">
                                                        {formatDate(material.createdAt)} • {material.Teacher?.User?.name || "Teacher"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary/80"
                                                    onClick={() => window.open(`http://localhost:3000/${material.file_path}`, '_blank')}
                                                >
                                                    <Download className="w-4 h-4" />
                                                </Button>
                                                {userRole === 'teacher' && (
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                                                            onClick={() => handleEditMaterial(material)}
                                                        >
                                                            <Pencil className="w-4 h-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                            onClick={() => handleDeleteMaterial(material.id)}
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 gap-4 mb-6">
                                <div
                                    className="p-4 bg-muted/30 rounded-xl text-center border hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer group"
                                    onClick={handleViewMaterials}
                                >
                                    <div className="flex justify-center mb-2 text-primary group-hover:scale-110 transition-transform">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="text-2xl font-bold">{course.materials || 0}</div>
                                    <div className="text-xs text-muted-foreground font-medium uppercase tracking-wide group-hover:text-primary transition-colors">Course Materials</div>
                                    <p className="text-[10px] text-muted-foreground mt-2">Click to view files</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-3">Course Schedule</h4>
                                    <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg border">
                                        <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shadow-sm">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{course.schedule || "TBA"}</p>
                                            <p className="text-xs text-muted-foreground">Weekly Schedule</p>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Course Progress</h4>
                                        <span className="text-sm font-bold text-primary">{course.progress || 0}%</span>
                                    </div>
                                    <Progress value={course.progress || 0} className="h-2" />
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Based on completed syllabus and assignments.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            <Clock className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">14 Weeks</p>
                                            <p className="text-xs text-muted-foreground">Duration</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                            <BookOpen className="w-4 h-4 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{course.credits || 3} Credits</p>
                                            <p className="text-xs text-muted-foreground">Course Value</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
