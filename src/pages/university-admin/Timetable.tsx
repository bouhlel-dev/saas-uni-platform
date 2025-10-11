import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Plus } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { AddScheduleDialog } from "@/components/forms/AddScheduleDialog";
import { useState } from "react";

const Timetable = () => {
  const [showAddDialog, setShowAddDialog] = useState(false);

  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/university-admin" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/university-admin/faculties" className="block px-3 py-2 rounded-md hover:bg-muted">
        Faculties
      </NavLink>
      <NavLink to="/dashboard/university-admin/teachers" className="block px-3 py-2 rounded-md hover:bg-muted">
        Teachers
      </NavLink>
      <NavLink to="/dashboard/university-admin/students" className="block px-3 py-2 rounded-md hover:bg-muted">
        Students
      </NavLink>
      <NavLink to="/dashboard/university-admin/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        Courses
      </NavLink>
      <NavLink to="/dashboard/university-admin/timetable" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Timetable
      </NavLink>
    </nav>
  );

  const schedule = {
    Monday: [
      { time: "09:00-10:30", course: "CS401", name: "Advanced ML", teacher: "Dr. Smith", room: "Lab 301" },
      { time: "11:00-12:30", course: "BUS201", name: "Financial Accounting", teacher: "Dr. Williams", room: "Room 205" },
      { time: "14:00-15:30", course: "ENG202", name: "Thermodynamics", teacher: "Dr. Davis", room: "Lab 401" },
    ],
    Tuesday: [
      { time: "10:00-12:00", course: "MED301", name: "Clinical Medicine", teacher: "Dr. Brown", room: "Med Hall" },
      { time: "13:00-14:30", course: "ECON301", name: "Macroeconomics", teacher: "Dr. Wilson", room: "Room 301" },
      { time: "15:00-16:30", course: "CS302", name: "Data Structures", teacher: "Dr. Johnson", room: "Lab 201" },
    ],
    Wednesday: [
      { time: "09:00-10:30", course: "CS401", name: "Advanced ML", teacher: "Dr. Smith", room: "Lab 301" },
      { time: "11:00-12:30", course: "BUS201", name: "Financial Accounting", teacher: "Dr. Williams", room: "Room 205" },
      { time: "14:00-15:30", course: "ENG202", name: "Thermodynamics", teacher: "Dr. Davis", room: "Lab 401" },
    ],
    Thursday: [
      { time: "10:00-12:00", course: "MED301", name: "Clinical Medicine", teacher: "Dr. Brown", room: "Med Hall" },
      { time: "13:00-14:30", course: "ECON301", name: "Macroeconomics", teacher: "Dr. Wilson", room: "Room 301" },
      { time: "15:00-16:30", course: "CS302", name: "Data Structures", teacher: "Dr. Johnson", room: "Lab 201" },
    ],
    Friday: [
      { time: "09:00-10:00", course: "BUS201", name: "Financial Accounting", teacher: "Dr. Williams", room: "Room 205" },
    ],
  };


  return (
    <DashboardLayout sidebar={sidebarContent} title="Timetable Management">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">University Timetable</h2>
            <p className="text-muted-foreground">Manage class schedules and room allocations</p>
          </div>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Schedule
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Week Schedule</CardTitle>
                <CardDescription>Spring Semester 2024</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Previous Week</Button>
                <Button variant="outline" size="sm">Next Week</Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {Object.entries(schedule).map(([day, classes]) => (
            <Card key={day}>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <CardTitle>{day}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classes.map((class_, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                          <p className="text-sm font-medium whitespace-nowrap">{class_.time}</p>
                        </div>
                        <div className="w-px h-12 bg-border" />
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline">{class_.course}</Badge>
                            <h4 className="font-semibold">{class_.name}</h4>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{class_.teacher}</span>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {class_.room}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => toast({ 
                          title: "Edit Schedule", 
                          description: `Editing ${class_.course} schedule...` 
                        })}
                      >
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <AddScheduleDialog open={showAddDialog} onOpenChange={setShowAddDialog} />
      </div>
    </DashboardLayout>
  );
};

export default Timetable;
