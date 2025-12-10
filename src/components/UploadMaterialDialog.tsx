import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { api } from "@/lib/api";

interface Course {
    id: string;
    name: string;
}

interface UploadMaterialDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    courses: Course[];
    preSelectedCourseId?: string | null;
    onSuccess?: () => void;
}

export function UploadMaterialDialog({ open, onOpenChange, courses, preSelectedCourseId, onSuccess }: UploadMaterialDialogProps) {
    const [loading, setLoading] = useState(false);
    const [selectedCourseId, setSelectedCourseId] = useState<string>("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [file, setFile] = useState<File | null>(null);

    // Set pre-selected course when dialog opens
    useEffect(() => {
        if (open && preSelectedCourseId) {
            setSelectedCourseId(preSelectedCourseId);
        }
    }, [open, preSelectedCourseId]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseId || !file || !title) {
            toast({ title: "Error", description: "Please fill in all required fields", variant: "destructive" });
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("file", file);

        try {
            // Extract numeric ID if courseId is like "CS101"
            const numericId = selectedCourseId.replace(/\D/g, '');

            await api.post(`/teacher/courses/${numericId}/materials`, formData);

            toast({ title: "Success", description: "Material uploaded successfully" });
            onOpenChange(false);
            setTitle("");
            setDescription("");
            setFile(null);
            setSelectedCourseId("");
            if (onSuccess) onSuccess();
        } catch (error) {
            console.error("Upload error:", error);
            toast({ title: "Error", description: "Failed to upload material", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Upload Course Material</DialogTitle>
                    <DialogDescription>
                        Upload documents, slides, or resources for your students.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="course">Course <span className="text-red-500">*</span></Label>
                        <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
                            <SelectTrigger id="course">
                                <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                                {courses.map((course) => (
                                    <SelectItem key={course.id} value={course.id}>
                                        {course.id} - {course.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="title">Title <span className="text-red-500">*</span></Label>
                        <Input
                            id="title"
                            placeholder="e.g., Lecture 1 Slides"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Brief description of the material..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="file">File <span className="text-red-500">*</span></Label>
                        <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                            <Input
                                id="file"
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleFileChange}
                                required
                            />
                            <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                            {file ? (
                                <p className="text-sm font-medium text-primary">{file.name}</p>
                            ) : (
                                <>
                                    <p className="text-sm font-medium">Click to upload or drag and drop</p>
                                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PPTX, etc.</p>
                                </>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading || !file || !title || !selectedCourseId}>
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Uploading...
                                </>
                            ) : (
                                "Upload Material"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
