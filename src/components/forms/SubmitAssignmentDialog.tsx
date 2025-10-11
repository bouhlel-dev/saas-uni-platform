import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Upload, FileText } from "lucide-react";

interface SubmitAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: {
    title: string;
    course: string;
  };
}

export function SubmitAssignmentDialog({ open, onOpenChange, assignment }: SubmitAssignmentDialogProps) {
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Assignment Submitted",
      description: `Your submission for ${assignment.title} has been received.`,
    });
    onOpenChange(false);
    setNotes("");
    setFileName("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Submit Assignment</DialogTitle>
            <DialogDescription>
              {assignment.course} - {assignment.title}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="file">Upload Your Work *</Label>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" className="w-full" asChild>
                  <label htmlFor="file" className="cursor-pointer">
                    <Upload className="w-4 h-4 mr-2" />
                    {fileName || "Choose File"}
                  </label>
                </Button>
                <input
                  id="file"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                  accept=".pdf,.doc,.docx,.zip"
                  required
                />
              </div>
              {fileName && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{fileName}</span>
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                Accepted formats: PDF, DOC, DOCX, ZIP (Max 10MB)
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Submission Notes (Optional)</Label>
              <Textarea 
                id="notes" 
                placeholder="Add any notes or comments about your submission..."
                rows={4}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit">Submit Assignment</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
