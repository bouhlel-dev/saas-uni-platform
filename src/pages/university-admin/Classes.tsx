import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Filter, Edit, Trash2, UserPlus, BookOpen } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";
import { AddClassDialog } from "@/components/forms/AddClassDialog";
import { AssignStudentsDialog } from "@/components/forms/AssignStudentsDialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ClassesPage = () => {
    const [classes, setClasses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const [showAddDialog, setShowAddDialog] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);
    const [editingClass, setEditingClass] = useState<any>(null);
    const [selectedClassForAssign, setSelectedClassForAssign] = useState<any>(null);

    const fetchClasses = async () => {
        try {
            const data = await api.get('/admin/classes');
            setClasses(data);
        } catch (error) {
            console.error('Error fetching classes:', error);
            toast({
                title: "Error",
                description: "Failed to load classes",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this class? All students will be unassigned.")) return;

        try {
            await api.delete(`/admin/classes/${id}`);
            toast({
                title: "Class Deleted",
                description: "The class has been removed successfully.",
            });
            fetchClasses();
        } catch (error) {
            console.error('Error deleting class:', error);
            toast({
                title: "Error",
                description: "Failed to delete class",
                variant: "destructive"
            });
        }
    };

    const handleEdit = (cls: any) => {
        setEditingClass(cls);
        setShowAddDialog(true);
    };

    const handleAssign = (cls: any) => {
        setSelectedClassForAssign(cls);
        setShowAssignDialog(true);
    };

    const sidebarContent = <UniversityAdminSidebar />;

    // Get unique departments
    const departments = Array.from(new Set(classes.map(c => c.Department?.name).filter(Boolean)));

    const filteredClasses = classes.filter(cls => {
        const matchesSearch = cls.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDepartment = selectedDepartment === "all" || cls.Department?.name === selectedDepartment;
        return matchesSearch && matchesDepartment;
    });

    if (loading) {
        return (
            <DashboardLayout sidebar={sidebarContent} title="Classes Management">
                <div className="flex items-center justify-center h-full">
                    <p>Loading classes...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <>
            <AddClassDialog
                open={showAddDialog}
                onOpenChange={(open) => {
                    setShowAddDialog(open);
                    if (!open) setEditingClass(null);
                }}
                onClassAdded={fetchClasses}
                editingClass={editingClass}
            />

            {selectedClassForAssign && (
                <AssignStudentsDialog
                    open={showAssignDialog}
                    onOpenChange={(open) => {
                        setShowAssignDialog(open);
                        if (!open) setSelectedClassForAssign(null);
                    }}
                    classId={selectedClassForAssign.id}
                    className={selectedClassForAssign.name}
                    onAssignmentComplete={fetchClasses}
                />
            )}

            <DashboardLayout sidebar={sidebarContent} title="Classes Management">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold">Classes</h2>
                            <p className="text-muted-foreground">Manage classes and student assignments</p>
                        </div>
                        <Button onClick={() => setShowAddDialog(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Class
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex gap-4 mb-6">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search classes..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="gap-2">
                                            <Filter className="w-4 h-4" />
                                            Filter
                                            {selectedDepartment !== "all" && (
                                                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-[10px]">
                                                    1
                                                </Badge>
                                            )}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80" align="end">
                                        <div className="grid gap-4">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">Filters</h4>
                                                <p className="text-sm text-muted-foreground">Refine the class list</p>
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="department">Department</Label>
                                                <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                                                    <SelectTrigger id="department">
                                                        <SelectValue placeholder="Select department" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="all">All Departments</SelectItem>
                                                        {departments.map((dept: any) => (
                                                            <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            {selectedDepartment !== "all" && (
                                                <Button
                                                    variant="ghost"
                                                    className="justify-start px-0 text-muted-foreground"
                                                    onClick={() => setSelectedDepartment("all")}
                                                >
                                                    Reset filters
                                                </Button>
                                            )}
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardContent>
                    </Card>

                    {filteredClasses.length === 0 ? (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">No classes found.</p>
                        </div>
                    ) : (
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredClasses.map((cls) => (
                                <Card key={cls.id} className="hover:shadow-md transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <CardTitle className="text-lg">{cls.name}</CardTitle>
                                                <CardDescription>{cls.Department?.name || 'No Department'}</CardDescription>
                                            </div>
                                            <Badge variant="outline">{cls.specialization || 'General'}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                            <Users className="w-4 h-4" />
                                            <span>{cls.studentCount} Students</span>
                                        </div>

                                        <div className="flex gap-2 mt-2">
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => handleAssign(cls)}>
                                                <UserPlus className="w-4 h-4 mr-2" />
                                                Assign
                                            </Button>
                                            <Button variant="ghost" size="icon" onClick={() => handleEdit(cls)}>
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDelete(cls.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </DashboardLayout>
        </>
    );
};

export default ClassesPage;
