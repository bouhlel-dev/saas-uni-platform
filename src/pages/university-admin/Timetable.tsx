import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus, Edit, Trash2, Filter, Download, Upload, FileJson, FileText, FileSpreadsheet } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { AddScheduleDialog } from "@/components/forms/AddScheduleDialog";
import { BulkScheduleUploadDialog } from "@/components/forms/BulkScheduleUploadDialog";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { UniversityAdminSidebar } from "@/components/UniversityAdminSidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Timetable = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");

  const [schedules, setSchedules] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedClass, setSelectedClass] = useState<string>("all");
  const [selectedTeacher, setSelectedTeacher] = useState<string>("all");

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch filters data
      const [classesData, teachersData] = await Promise.all([
        api.get('/admin/classes'),
        api.get('/admin/users/teachers')
      ]);
      setClasses(classesData);
      setTeachers(teachersData);

      await fetchSchedules();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load initial data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedules = async () => {
    try {
      let url = '/schedule?';
      if (selectedClass !== 'all') url += `class_id=${selectedClass}&`;
      if (selectedTeacher !== 'all') url += `teacher_id=${selectedTeacher}&`;

      const data = await api.get(url);
      setSchedules(data);
    } catch (error) {
      console.error('Error fetching schedules:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [selectedClass, selectedTeacher]);

  const handleDelete = async (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this schedule entry?")) return;
    try {
      await api.delete(`/schedule/${id}`);
      toast({
        title: "Schedule Deleted",
        description: "Schedule entry removed successfully.",
      });
      fetchSchedules();
    } catch (error) {
      console.error('Error deleting schedule:', error);
      toast({
        title: "Error",
        description: "Failed to delete schedule",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (item: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingSchedule(item);
    setShowEditDialog(true);
  };

  const handleCellClick = (day: string, time: string) => {
    setSelectedDay(day);
    setSelectedTime(time);
    setEditingSchedule(null);
    setShowAddDialog(true);
  };

  const getScheduleForSlot = (day: string, time: string) => {
    // Simple check for exact time match.
    // In a real app, you might check if time falls within start-end range.
    return schedules.find(s => s.day === day && s.time.startsWith(time));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Class Schedule", 14, 22);

    doc.setFontSize(11);
    doc.setTextColor(100);
    const dateStr = new Date().toLocaleDateString();
    doc.text(`Generated on: ${dateStr}`, 14, 30);

    // Filter info
    let filterText = "Filters: ";
    if (selectedClass !== 'all') {
      const cls = classes.find(c => String(c.id) === selectedClass);
      filterText += `Class: ${cls?.name || selectedClass}  `;
    }
    if (selectedTeacher !== 'all') {
      const tchr = teachers.find(t => String(t.id) === selectedTeacher);
      filterText += `Teacher: ${tchr?.User?.name || selectedTeacher}`;
    }
    if (selectedClass === 'all' && selectedTeacher === 'all') {
      filterText += "None (All Schedules)";
    }
    doc.text(filterText, 14, 38);

    const tableData = schedules.map(s => [
      s.day,
      s.time,
      s.Course?.code || 'N/A',
      s.Course?.title || 'N/A',
      s.Class?.name || 'N/A',
      s.Teacher?.User?.name || 'N/A',
      s.room
    ]);

    autoTable(doc, {
      head: [['Day', 'Time', 'Code', 'Course', 'Class', 'Teacher', 'Room']],
      body: tableData,
      startY: 45,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [66, 66, 66] }
    });

    doc.save("schedule_export.pdf");
  };

  const handleExportCSV = () => {
    const headers = ["Day,Time,Course Code,Course Title,Class,Teacher,Room"];
    const rows = schedules.map(s => [
      s.day,
      s.time,
      s.Course?.code || '',
      s.Course?.title || '',
      s.Class?.name || '',
      s.Teacher?.User?.name || '',
      s.room
    ].map(field => `"${field}"`).join(",")); // Quote fields to handle commas

    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "schedule_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(schedules, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "schedule_export.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sidebarContent = <UniversityAdminSidebar />;

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="Timetable Management">
        <div className="flex items-center justify-center h-full">
          <p>Loading timetable...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="Timetable Management">
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Class Schedule</h2>
            <p className="text-muted-foreground">Manage weekly class schedules</p>
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="grid gap-1.5">
              <Label htmlFor="class-filter">Filter by Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger id="class-filter" className="w-[160px]">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {classes.map((cls: any) => (
                    <SelectItem key={cls.id} value={String(cls.id)}>{cls.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-1.5">
              <Label htmlFor="teacher-filter">Filter by Teacher</Label>
              <Select value={selectedTeacher} onValueChange={setSelectedTeacher}>
                <SelectTrigger id="teacher-filter" className="w-[160px]">
                  <SelectValue placeholder="All Teachers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Teachers</SelectItem>
                  {teachers.map((teacher: any) => (
                    <SelectItem key={teacher.id} value={String(teacher.id)}>
                      {teacher.User?.name || 'Unknown'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Export
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Export Options</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleExportPDF}>
                    <FileText className="mr-2 h-4 w-4" /> PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportCSV}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" /> CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleExportJSON}>
                    <FileJson className="mr-2 h-4 w-4" /> JSON
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={() => setShowUploadDialog(true)}>
                <Upload className="mr-2 h-4 w-4" /> Import CSV
              </Button>

              <Button onClick={() => {
                setEditingSchedule(null);
                setSelectedDay("");
                setSelectedTime("");
                setShowAddDialog(true);
              }}>
                <Plus className="mr-2 h-4 w-4" /> Add Schedule
              </Button>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Header Row */}
              <div className="grid grid-cols-7 border-b bg-muted/50">
                <div className="p-4 font-medium text-center border-r">Time</div>
                {days.map(day => (
                  <div key={day} className="p-4 font-medium text-center border-r last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time Rows */}
              {times.map(time => (
                <div key={time} className="grid grid-cols-7 border-b last:border-b-0">
                  <div className="p-4 text-sm text-muted-foreground text-center border-r flex items-center justify-center bg-muted/5">
                    {time}
                  </div>
                  {days.map(day => {
                    const scheduleItem = getScheduleForSlot(day, time);
                    return (
                      <div
                        key={`${day}-${time}`}
                        className={`
                          p-2 border-r last:border-r-0 min-h-[100px] relative group transition-colors
                          ${scheduleItem ? 'bg-primary/5 hover:bg-primary/10' : 'hover:bg-muted/50 cursor-pointer'}
                        `}
                        onClick={() => !scheduleItem && handleCellClick(day, time)}
                      >
                        {scheduleItem ? (
                          <div className="h-full flex flex-col justify-between text-xs">
                            <div className="font-semibold text-primary truncate" title={scheduleItem.Course?.title}>
                              {scheduleItem.Course?.code}
                            </div>
                            <div className="text-muted-foreground truncate" title={scheduleItem.Class?.name}>
                              {scheduleItem.Class?.name}
                            </div>
                            <div className="truncate" title={scheduleItem.Teacher?.User?.name}>
                              {scheduleItem.Teacher?.User?.name}
                            </div>
                            <div className="flex items-center gap-1 mt-1 text-[10px] text-muted-foreground">
                              <MapPin className="w-3 h-3" />
                              {scheduleItem.room}
                            </div>

                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 bg-white/80 dark:bg-black/80 rounded p-0.5">
                              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => handleEdit(scheduleItem, e)}>
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive hover:text-destructive" onClick={(e) => handleDelete(scheduleItem.id, e)}>
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
                            <Plus className="w-4 h-4 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Card>

        <AddScheduleDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onScheduleAdded={fetchSchedules}
          defaultDay={selectedDay}
          defaultTime={selectedTime}
        />

        <AddScheduleDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onScheduleAdded={fetchSchedules}
          editingSchedule={editingSchedule}
        />

        <BulkScheduleUploadDialog
          open={showUploadDialog}
          onOpenChange={setShowUploadDialog}
          onUploadSuccess={fetchSchedules}
        />
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
