import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, GraduationCap, Building } from "lucide-react";

interface Department {
    id: number;
    name: string;
    students: number;
    teachers: number;
    courses: number;
}

interface Faculty {
    id: number;
    name: string;
    departments: Department[];
    students: number;
    teachers: number;
    courses: number;
}

interface FacultyDetailsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    faculty: Faculty | null;
}

export function FacultyDetailsDialog({ open, onOpenChange, faculty }: FacultyDetailsDialogProps) {
    if (!faculty) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center gap-2">
                        <Building className="h-6 w-6 text-primary" />
                        {faculty.name}
                    </DialogTitle>
                    <DialogDescription>
                        Detailed statistics and department breakdown
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Faculty Overview Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Students</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    <Users className="h-5 w-5 text-primary" />
                                    {faculty.students.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Teachers</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    <GraduationCap className="h-5 w-5 text-primary" />
                                    {faculty.teachers.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">Total Courses</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" />
                                    {faculty.courses.toLocaleString()}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Departments List */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4">Departments Breakdown</h3>
                        <div className="space-y-4">
                            {faculty.departments.length === 0 ? (
                                <p className="text-center text-muted-foreground py-8 border border-dashed rounded-lg">
                                    No departments found in this faculty.
                                </p>
                            ) : (
                                <div className="grid gap-4">
                                    {faculty.departments.map((dept) => (
                                        <div key={dept.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-semibold text-lg">{dept.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="flex flex-col items-center min-w-[80px]">
                                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Students</span>
                                                    <span className="font-bold flex items-center gap-1">
                                                        <Users className="h-3 w-3" />
                                                        {dept.students}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center min-w-[80px]">
                                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Teachers</span>
                                                    <span className="font-bold flex items-center gap-1">
                                                        <GraduationCap className="h-3 w-3" />
                                                        {dept.teachers}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-center min-w-[80px]">
                                                    <span className="text-muted-foreground text-xs uppercase tracking-wider">Courses</span>
                                                    <span className="font-bold flex items-center gap-1">
                                                        <BookOpen className="h-3 w-3" />
                                                        {dept.courses}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
