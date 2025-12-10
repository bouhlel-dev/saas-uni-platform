import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { StudentSidebar } from "@/components/StudentSidebar";
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const StudentTimetable = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const times = [
    '08:00', '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const data = await api.get('/student/schedule');
        setSchedules(data);
      } catch (error) {
        console.error('Error fetching schedule:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  const getScheduleForSlot = (day: string, time: string) => {
    return schedules.find(s => s.day === day && s.time.startsWith(time));
  };

  const handleExportPDF = () => {
    const doc = new jsPDF('landscape');
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFontSize(16);
    doc.setTextColor(40);
    doc.text("My Class Schedule", pageWidth / 2, 15, { align: 'center' });

    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 22, { align: 'center' });

    // Build timetable grid data (rows = times, columns = days)
    const tableBody = times.map(time => {
      const row: string[] = [time];
      days.forEach(day => {
        const slot = getScheduleForSlot(day, time);
        if (slot) {
          const parts = [slot.Course?.title || ''];
          if (slot.Teacher?.User?.name) parts.push(slot.Teacher.User.name);
          if (slot.room) parts.push(`📍${slot.room}`);
          row.push(parts.join('\n'));
        } else {
          row.push('');
        }
      });
      return row;
    });

    autoTable(doc, {
      head: [['Time', ...days]],
      body: tableBody,
      startY: 28,
      margin: { left: 10, right: 10 },
      theme: 'grid',
      tableWidth: 'auto',
      styles: { 
        fontSize: 7, 
        cellPadding: 2,
        valign: 'middle',
        halign: 'center',
        minCellHeight: 12,
        overflow: 'linebreak'
      },
      headStyles: { 
        fillColor: [66, 133, 244], 
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center',
        fontSize: 8
      },
      columnStyles: {
        0: { cellWidth: 18, fontStyle: 'bold', fillColor: [240, 240, 240] }
      },
      alternateRowStyles: { fillColor: [250, 250, 250] },
      didParseCell: function(data) {
        if (data.section === 'body' && data.column.index > 0 && data.cell.raw) {
          data.cell.styles.fillColor = [232, 240, 254];
        }
      }
    });

    doc.save("class_schedule.pdf");
  };

  const sidebarContent = <StudentSidebar />;

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="My Timetable">
        <div className="flex items-center justify-center h-full">
          <p>Loading timetable...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Timetable">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">My Timetable</h2>
            <p className="text-muted-foreground">Your weekly class schedule</p>
          </div>
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="mr-2 h-4 w-4" /> Export PDF
          </Button>
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
                          p-3 border-r last:border-r-0 min-h-[110px] relative
                          ${scheduleItem ? 'bg-primary/10 hover:bg-primary/15 transition-colors' : ''}
                        `}
                      >
                        {scheduleItem && (
                          <div className="h-full flex flex-col gap-1">
                            <div className="font-semibold text-primary text-sm leading-tight">
                              {scheduleItem.Course?.title || 'Untitled Course'}
                            </div>
                            {scheduleItem.Course?.code && (
                              <div className="text-xs text-muted-foreground">
                                {scheduleItem.Course.code}
                              </div>
                            )}
                            {scheduleItem.Teacher?.User?.name && (
                              <div className="text-xs font-medium text-foreground/80">
                                👤 {scheduleItem.Teacher.User.name}
                              </div>
                            )}
                            <div className="flex items-center gap-1 mt-auto text-xs text-muted-foreground">
                              <MapPin className="w-3 h-3 flex-shrink-0" />
                              <span>{scheduleItem.room || 'TBD'}</span>
                            </div>
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
      </div>
    </DashboardLayout>
  );
};

export default StudentTimetable;
