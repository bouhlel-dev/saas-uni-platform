import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, CheckCircle, XCircle, TrendingUp, ArrowLeft, User, Download, FileText, FileSpreadsheet } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface AttendanceHistoryDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    course: any;
}

interface AttendanceRecord {
    date: string;
    rawDate: string;
    present: number;
    absent: number;
    excused?: number;
    total: number;
    percentage: number;
}

interface StudentAttendance {
    id: number;
    student_id: number;
    student_name: string;
    student_email: string;
    class_name: string;
    status: 'present' | 'absent' | 'excused';
}

interface ClassOption {
    id: number;
    name: string;
}

export function AttendanceHistoryDialog({ open, onOpenChange, course }: AttendanceHistoryDialogProps) {
    const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState<AttendanceRecord | null>(null);
    const [studentAttendance, setStudentAttendance] = useState<StudentAttendance[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(false);
    const [classes, setClasses] = useState<ClassOption[]>([]);
    const [selectedClassId, setSelectedClassId] = useState<string>("all");

    useEffect(() => {
        if (open && course?.id) {
            const fetchData = async () => {
                setLoading(true);
                try {
                    // Fetch both history and classes
                    const [historyData, classesData] = await Promise.all([
                        api.get(`/teacher/courses/${course.id}/attendance-history`),
                        api.get(`/teacher/courses/${course.id}/classes`)
                    ]);
                    setAttendanceHistory(historyData);
                    setClasses(classesData);
                } catch (error) {
                    console.error('Error fetching attendance history:', error);
                    toast({ title: "Error", description: "Failed to load attendance history", variant: "destructive" });
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }
    }, [open, course?.id]);

    // Reset when dialog closes
    useEffect(() => {
        if (!open) {
            setSelectedDate(null);
            setStudentAttendance([]);
            setSelectedClassId("all");
        }
    }, [open]);

    const handleDateClick = async (record: AttendanceRecord) => {
        setSelectedDate(record);
        setLoadingStudents(true);
        try {
            let url = `/teacher/courses/${course.id}/attendance-by-date?date=${record.rawDate}`;
            if (selectedClassId !== "all") {
                url += `&classId=${selectedClassId}`;
            }
            const data = await api.get(url);
            setStudentAttendance(data);
        } catch (error) {
            console.error('Error fetching student attendance:', error);
            toast({ title: "Error", description: "Failed to load student attendance", variant: "destructive" });
        } finally {
            setLoadingStudents(false);
        }
    };

    // Filter student attendance by selected class
    const filteredStudentAttendance = selectedClassId === "all" 
        ? studentAttendance 
        : studentAttendance.filter(s => {
            const classMatch = classes.find(c => c.id.toString() === selectedClassId);
            return classMatch && s.class_name === classMatch.name;
        });

    // Recalculate stats based on filtered students
    const filteredStats = {
        present: filteredStudentAttendance.filter(s => s.status === 'present').length,
        absent: filteredStudentAttendance.filter(s => s.status === 'absent').length,
        total: filteredStudentAttendance.length,
        percentage: filteredStudentAttendance.length > 0 
            ? Math.round((filteredStudentAttendance.filter(s => s.status === 'present').length / filteredStudentAttendance.length) * 100)
            : 0
    };

    const handleBack = () => {
        setSelectedDate(null);
        setStudentAttendance([]);
    };

    const exportToCSV = () => {
        if (attendanceHistory.length === 0) {
            toast({ title: "No Data", description: "No attendance records to export", variant: "destructive" });
            return;
        }

        // Create CSV content
        const headers = ["Date", "Present", "Absent", "Total", "Attendance Rate (%)"];
        const rows = attendanceHistory.map(record => [
            record.date,
            record.present,
            record.absent,
            record.total,
            record.percentage
        ]);

        const csvContent = [
            `Attendance Report - ${course.name} (${course.code})`,
            `Generated on: ${new Date().toLocaleDateString()}`,
            "",
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_${course.code}_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Successful", description: "Attendance report downloaded" });
    };

    const exportStudentListToCSV = () => {
        if (filteredStudentAttendance.length === 0) {
            toast({ title: "No Data", description: "No student records to export", variant: "destructive" });
            return;
        }

        const selectedClassName = selectedClassId === "all" 
            ? "All Classes" 
            : classes.find(c => c.id.toString() === selectedClassId)?.name || "";

        // Create CSV content
        const headers = ["Student Name", "Email", "Class", "Status"];
        const rows = filteredStudentAttendance.map(student => [
            `"${student.student_name}"`,
            student.student_email,
            student.class_name || "N/A",
            student.status.charAt(0).toUpperCase() + student.status.slice(1)
        ]);

        const csvContent = [
            `Attendance Details - ${course.name} (${course.code})`,
            `Date: ${selectedDate?.date}`,
            `Class Filter: ${selectedClassName}`,
            `Generated on: ${new Date().toLocaleDateString()}`,
            "",
            headers.join(","),
            ...rows.map(row => row.join(","))
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `attendance_${course.code}_${selectedDate?.rawDate || 'details'}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Successful", description: "Student attendance list downloaded" });
    };

    const exportToPDF = () => {
        if (attendanceHistory.length === 0) {
            toast({ title: "No Data", description: "No attendance records to export", variant: "destructive" });
            return;
        }

        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246); // Blue color
        doc.text("Attendance Report", 14, 22);
        
        // Course info
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`${course.name} (${course.code})`, 14, 32);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 40);
        
        // Summary stats
        const totalClasses = attendanceHistory.length;
        const avgAttendance = course.avgAttendance || 0;
        doc.text(`Total Classes: ${totalClasses} | Average Attendance: ${avgAttendance}%`, 14, 50);

        // Table
        const tableData = attendanceHistory.map(record => [
            record.date,
            record.present.toString(),
            record.absent.toString(),
            record.total.toString(),
            `${record.percentage}%`
        ]);

        autoTable(doc, {
            startY: 58,
            head: [["Date", "Present", "Absent", "Total", "Rate"]],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { cellWidth: 30, halign: 'center' },
                2: { cellWidth: 30, halign: 'center' },
                3: { cellWidth: 30, halign: 'center' },
                4: { cellWidth: 30, halign: 'center' }
            }
        });

        doc.save(`attendance_${course.code}_${new Date().toISOString().split('T')[0]}.pdf`);
        toast({ title: "Export Successful", description: "PDF report downloaded" });
    };

    const exportStudentListToPDF = () => {
        if (filteredStudentAttendance.length === 0) {
            toast({ title: "No Data", description: "No student records to export", variant: "destructive" });
            return;
        }

        const selectedClassName = selectedClassId === "all" 
            ? "All Classes" 
            : classes.find(c => c.id.toString() === selectedClassId)?.name || "";

        const doc = new jsPDF();
        
        // Title
        doc.setFontSize(18);
        doc.setTextColor(59, 130, 246);
        doc.text("Attendance Details", 14, 22);
        
        // Course and date info
        doc.setFontSize(12);
        doc.setTextColor(100);
        doc.text(`${course.name} (${course.code})`, 14, 32);
        doc.text(`Date: ${selectedDate?.date}`, 14, 40);
        doc.text(`Class: ${selectedClassName}`, 14, 48);
        doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 56);
        
        // Summary
        doc.text(`Present: ${filteredStats.present} | Absent: ${filteredStats.absent} | Total: ${filteredStudentAttendance.length}`, 14, 66);

        // Table
        const tableData = filteredStudentAttendance.map(student => [
            student.student_name,
            student.student_email,
            student.class_name || "N/A",
            student.status.charAt(0).toUpperCase() + student.status.slice(1)
        ]);

        autoTable(doc, {
            startY: 74,
            head: [["Student Name", "Email", "Class", "Status"]],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [59, 130, 246] },
            styles: { fontSize: 9 },
            columnStyles: {
                3: { 
                    cellWidth: 25,
                    halign: 'center'
                }
            },
            didParseCell: (data) => {
                if (data.section === 'body' && data.column.index === 3) {
                    const status = data.cell.raw?.toString().toLowerCase();
                    if (status === 'present') {
                        data.cell.styles.textColor = [22, 163, 74]; // Green
                    } else if (status === 'absent') {
                        data.cell.styles.textColor = [220, 38, 38]; // Red
                    }
                }
            }
        });

        doc.save(`attendance_${course.code}_${selectedDate?.rawDate || 'details'}.pdf`);
        toast({ title: "Export Successful", description: "PDF student list downloaded" });
    };

    if (!course) return null;

    const getPercentageColor = (percentage: number) => {
        if (percentage >= 90) return "text-green-600 dark:text-green-400";
        if (percentage >= 75) return "text-orange-600 dark:text-orange-400";
        return "text-red-600 dark:text-red-400";
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'present':
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">Present</Badge>;
            case 'absent':
                return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">Absent</Badge>;
            case 'excused':
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">Excused</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-xl flex items-center gap-2">
                        {selectedDate && (
                            <Button variant="ghost" size="icon" onClick={handleBack} className="h-8 w-8">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        )}
                        {selectedDate ? `Attendance - ${selectedDate.date}` : "Attendance History"}
                    </DialogTitle>
                    <DialogDescription>
                        {course.name} ({course.code})
                    </DialogDescription>
                </DialogHeader>

                {!selectedDate ? (
                    <>
                        <div className="grid grid-cols-3 gap-4 py-4">
                            <div className="p-3 bg-muted/30 rounded-lg text-center border">
                                <div className="text-2xl font-bold">{course.avgAttendance}%</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">Avg. Attendance</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg text-center border">
                                <div className="text-2xl font-bold">{attendanceHistory.length}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">Total Classes</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg text-center border">
                                <div className="text-2xl font-bold">{course.totalStudents}</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">Students</div>
                            </div>
                        </div>

                        <Separator />

                        <div className="flex items-center justify-between py-2">
                            <div className="text-sm font-medium text-muted-foreground">Date</div>
                            <div className="flex gap-8 mr-4">
                                <div className="text-sm font-medium text-muted-foreground w-20 text-center">Present</div>
                                <div className="text-sm font-medium text-muted-foreground w-20 text-center">Absent</div>
                                <div className="text-sm font-medium text-muted-foreground w-20 text-center">Rate</div>
                            </div>
                        </div>

                        <ScrollArea className="h-[300px] pr-4">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-muted-foreground">Loading attendance history...</p>
                                </div>
                            ) : attendanceHistory.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-muted-foreground">No attendance records found for this course</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {attendanceHistory.map((record, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/10 transition-colors cursor-pointer"
                                            onClick={() => handleDateClick(record)}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <Calendar className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <div className="font-medium hover:underline">{record.date}</div>
                                                    <div className="text-xs text-muted-foreground">{record.total} students recorded</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-8">
                                                <div className="flex items-center gap-2 w-20 justify-center">
                                                    <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                    <span className="font-bold">{record.present}</span>
                                                </div>
                                                <div className="flex items-center gap-2 w-20 justify-center">
                                                    <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                                                    <span className="font-bold">{record.absent}</span>
                                                </div>
                                                <div className="w-20 text-center">
                                                    <Badge variant="outline" className={getPercentageColor(record.percentage)}>
                                                        {record.percentage}%
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </>
                ) : (
                    <>
                        <div className="flex items-center justify-between py-2">
                            <div className="text-sm text-muted-foreground">
                                Filter by class:
                            </div>
                            <Select value={selectedClassId} onValueChange={setSelectedClassId}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="All Classes" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Classes</SelectItem>
                                    {classes.map((cls) => (
                                        <SelectItem key={cls.id} value={cls.id.toString()}>
                                            {cls.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 gap-4 py-4">
                            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg text-center border border-green-200 dark:border-green-800">
                                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{filteredStats.present}</div>
                                <div className="text-xs text-green-600 dark:text-green-400 uppercase tracking-wide">Present</div>
                            </div>
                            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-center border border-red-200 dark:border-red-800">
                                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{filteredStats.absent}</div>
                                <div className="text-xs text-red-600 dark:text-red-400 uppercase tracking-wide">Absent</div>
                            </div>
                            <div className="p-3 bg-muted/30 rounded-lg text-center border">
                                <div className="text-2xl font-bold">{filteredStats.percentage}%</div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wide">Attendance Rate</div>
                            </div>
                        </div>

                        <Separator />

                        <ScrollArea className="h-[300px] pr-4">
                            {loadingStudents ? (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-muted-foreground">Loading student attendance...</p>
                                </div>
                            ) : filteredStudentAttendance.length === 0 ? (
                                <div className="flex items-center justify-center py-8">
                                    <p className="text-muted-foreground">No attendance records found for this date</p>
                                </div>
                            ) : (
                                <div className="space-y-2 py-2">
                                    {filteredStudentAttendance.map((student) => (
                                        <div
                                            key={student.id}
                                            className="flex items-center justify-between p-3 border rounded-lg bg-card"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                                                    <User className="w-5 h-5 text-muted-foreground" />
                                                </div>
                                                <div>
                                                    <div className="font-medium">{student.student_name}</div>
                                                    <div className="text-xs text-muted-foreground">{student.student_email}</div>
                                                </div>
                                            </div>
                                            {getStatusBadge(student.status)}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </>
                )}

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
                    {!selectedDate ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={attendanceHistory.length === 0}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export Report
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={exportToPDF}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportToCSV}>
                                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                                    Export as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button disabled={filteredStudentAttendance.length === 0}>
                                    <Download className="w-4 h-4 mr-2" />
                                    Export List
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={exportStudentListToPDF}>
                                    <FileText className="w-4 h-4 mr-2" />
                                    Export as PDF
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={exportStudentListToCSV}>
                                    <FileSpreadsheet className="w-4 h-4 mr-2" />
                                    Export as CSV
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
