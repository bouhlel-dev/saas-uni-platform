import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface BulkScheduleUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUploadSuccess: () => void;
}

export function BulkScheduleUploadDialog({ open, onOpenChange, onUploadSuccess }: BulkScheduleUploadDialogProps) {
    const [file, setFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== "text/csv" && !selectedFile.name.endsWith('.csv')) {
                setError("Please upload a valid CSV file.");
                setFile(null);
                return;
            }
            setFile(selectedFile);
            setError(null);
            setSuccess(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await api.post("/schedule/bulk", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            setSuccess(response.message || "Upload successful!");
            toast({
                title: "Success",
                description: response.message || "Successfully imported schedules.",
            });

            if (response.errors && response.errors.length > 0) {
                setError(`Imported with warnings: ${response.errors.join("; ")}`);
            }

            setTimeout(() => {
                onUploadSuccess();
                onOpenChange(false);
                setFile(null);
                setSuccess(null);
            }, 2000);
        } catch (err: any) {
            console.error("Upload error:", err);
            setError(err.message || "Failed to upload file. Please check the format and try again.");
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const headers = "day,time,room,course_code,teacher_email,class_name";
        const blob = new Blob([headers], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "schedule_import_template.csv";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Import Schedules from CSV</DialogTitle>
                    <DialogDescription>
                        Upload a CSV file to bulk create schedules.
                        <Button variant="link" className="h-auto p-0 ml-1" onClick={downloadTemplate}>
                            Download template
                        </Button>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="csv-file">CSV File</Label>
                        <Input id="csv-file" type="file" accept=".csv" onChange={handleFileChange} />
                    </div>

                    {error && (
                        <Alert variant="destructive" className="max-h-40 overflow-y-auto">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="border-green-500 text-green-600">
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Success</AlertTitle>
                            <AlertDescription>{success}</AlertDescription>
                        </Alert>
                    )}

                    {file && !error && !success && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-2 rounded-md">
                            <FileSpreadsheet className="h-4 w-4" />
                            <span className="truncate">{file.name}</span>
                            <span className="ml-auto text-xs">{(file.size / 1024).toFixed(1)} KB</span>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
                        Cancel
                    </Button>
                    <Button onClick={handleUpload} disabled={!file || uploading}>
                        {uploading ? (
                            <>
                                <Upload className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                Import
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
