import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";
import { Upload, FileText } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";


interface SubmitAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: {
    id: number;
    title: string;
    course: string;
  };
  onSuccess?: () => void;
}

export function SubmitAssignmentDialog({ open, onOpenChange, assignment, onSuccess }: SubmitAssignmentDialogProps) {
  const [notes, setNotes] = useState("");
  const [fileName, setFileName] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast({ title: "Error", description: "Please select a file to upload", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('file', file);
    if (notes) formData.append('notes', notes);

    try {
      // Assuming api.post handles FormData correctly or using fetch directly if api wrapper doesn't support it
      // Since api wrapper likely sets Content-Type to json, we might need to use fetch or modify api wrapper
      // For safety, let's use fetch with the token from localStorage
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/student/assignments/${assignment.id}/submit`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      toast({
        title: "Assignment Submitted",
        description: `Your submission for ${assignment.title} has been received.`,
      });
      onOpenChange(false);
      setNotes("");
      setFileName("");
      setFile(null);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to submit assignment",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Uploading..." : "Submit Assignment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
