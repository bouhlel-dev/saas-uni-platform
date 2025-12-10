import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";

interface EditGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    id: string;
    name: string;
    course: string;
    midterm: number;
    assignments: number;
    final: number;
  };
  courseId: string;
  onSave?: () => void;
}

export function EditGradeDialog({ open, onOpenChange, student, courseId, onSave }: EditGradeDialogProps) {
  const [formData, setFormData] = useState({
    midterm: "",
    final: "",
    feedback: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (student && open) {
      setFormData({
        midterm: String(student.midterm || 0),
        final: String(student.final || 0),
        feedback: "",
      });
    }
  }, [student, open]);

  const calculateTotal = () => {
    const midterm = parseFloat(formData.midterm) || 0;
    const assignments = student?.assignments || 0;
    const final = parseFloat(formData.final) || 0;
    return ((midterm * 0.3 + assignments * 0.3 + final * 0.4)).toFixed(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const studentId = student.id.replace(/\D/g, '');
      
      await api.put(`/teacher/courses/${courseId}/students/${studentId}/grades`, {
        midterm: parseFloat(formData.midterm) || 0,
        final: parseFloat(formData.final) || 0,
        feedback: formData.feedback
      });

      toast({
        title: "Grade Updated",
        description: `Grades for ${student.name} have been updated successfully.`,
      });
      
      if (onSave) onSave();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating grades:', error);
      toast({
        title: "Error",
        description: "Failed to update grades",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Student Grade</DialogTitle>
            <DialogDescription>
              Update grades for {student?.name} ({student?.id})
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="midterm">Midterm (30%)</Label>
                <Input
                  id="midterm"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.midterm}
                  onChange={(e) => setFormData({ ...formData, midterm: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">/ 20</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignments">Assignments (30%)</Label>
                <Input
                  id="assignments"
                  type="number"
                  min="0"
                  max="20"
                  value={student?.assignments || 0}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">Auto-calculated / 20</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="final">Final (40%)</Label>
                <Input
                  id="final"
                  type="number"
                  min="0"
                  max="20"
                  step="0.5"
                  value={formData.final}
                  onChange={(e) => setFormData({ ...formData, final: e.target.value })}
                />
                <p className="text-xs text-muted-foreground">/ 20</p>
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Weighted Total:</span>
                <span className={`text-2xl font-bold ${parseFloat(calculateTotal()) < 10 ? 'text-red-600' : 'text-primary'}`}>{calculateTotal()} / 20</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{parseFloat(calculateTotal()) >= 10 ? 'Passing' : 'Needs Improvement'}</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback for Student</Label>
              <Textarea
                id="feedback"
                placeholder="Add feedback or comments..."
                rows={3}
                value={formData.feedback}
                onChange={(e) => setFormData({ ...formData, feedback: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {saving ? "Saving..." : "Save Grade"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
