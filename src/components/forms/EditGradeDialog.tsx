import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface EditGradeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  student: {
    name: string;
    id: string;
  };
}

export function EditGradeDialog({ open, onOpenChange, student }: EditGradeDialogProps) {
  const [formData, setFormData] = useState({
    midterm: "88",
    assignments: "92",
    final: "85",
    feedback: "",
  });

  const calculateTotal = () => {
    const midterm = parseFloat(formData.midterm) || 0;
    const assignments = parseFloat(formData.assignments) || 0;
    const final = parseFloat(formData.final) || 0;
    return ((midterm * 0.3 + assignments * 0.3 + final * 0.4)).toFixed(1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Grade Updated",
      description: `Grades for ${student.name} have been updated successfully.`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Student Grade</DialogTitle>
            <DialogDescription>
              Update grades for {student.name} ({student.id})
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
                  max="100"
                  value={formData.midterm}
                  onChange={(e) => setFormData({ ...formData, midterm: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assignments">Assignments (30%)</Label>
                <Input 
                  id="assignments" 
                  type="number"
                  min="0"
                  max="100"
                  value={formData.assignments}
                  onChange={(e) => setFormData({ ...formData, assignments: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="final">Final (40%)</Label>
                <Input 
                  id="final" 
                  type="number"
                  min="0"
                  max="100"
                  value={formData.final}
                  onChange={(e) => setFormData({ ...formData, final: e.target.value })}
                />
              </div>
            </div>
            <div className="p-4 border rounded-lg bg-muted/50">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Grade:</span>
                <span className="text-2xl font-bold text-primary">{calculateTotal()}%</span>
              </div>
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
            <Button type="submit">Save Grade</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
