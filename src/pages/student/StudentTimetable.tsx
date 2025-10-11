import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin } from "lucide-react";
import { NavLink } from "react-router-dom";

const StudentTimetable = () => {
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/student" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/student/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/student/assignments" className="block px-3 py-2 rounded-md hover:bg-muted">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/student/exams" className="block px-3 py-2 rounded-md hover:bg-muted">
        Exams
      </NavLink>
      <NavLink to="/dashboard/student/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
      <NavLink to="/dashboard/student/timetable" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Timetable
      </NavLink>
    </nav>
  );

  const schedule = {
    Monday: [
      { time: "09:00-10:00", code: "CS201", name: "Programming Basics", teacher: "Dr. Williams", room: "Room 101" },
      { time: "10:00-11:30", code: "CS401", name: "Advanced ML", teacher: "Dr. Smith", room: "Lab 301" },
    ],
    Tuesday: [
      { time: "11:00-12:30", code: "MATH301", name: "Linear Algebra", teacher: "Dr. Brown", room: "Room 303" },
      { time: "14:00-15:30", code: "CS302", name: "Data Structures", teacher: "Dr. Johnson", room: "Room 205" },
    ],
    Wednesday: [
      { time: "09:00-10:00", code: "CS201", name: "Programming Basics", teacher: "Dr. Williams", room: "Room 101" },
      { time: "10:00-11:30", code: "CS401", name: "Advanced ML", teacher: "Dr. Smith", room: "Lab 301" },
    ],
    Thursday: [
      { time: "11:00-12:30", code: "MATH301", name: "Linear Algebra", teacher: "Dr. Brown", room: "Room 303" },
      { time: "14:00-15:30", code: "CS302", name: "Data Structures", teacher: "Dr. Johnson", room: "Room 205" },
    ],
    Friday: [
      { time: "09:00-10:00", code: "CS201", name: "Programming Basics", teacher: "Dr. Williams", room: "Room 101" },
    ],
  };

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Timetable">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Timetable</h2>
          <p className="text-muted-foreground">Your weekly class schedule</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Spring Semester 2024
            </CardTitle>
            <CardDescription>Computer Science - Year 3</CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {Object.entries(schedule).map(([day, classes]) => (
            <Card key={day}>
              <CardHeader>
                <CardTitle className="text-lg">{day}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {classes.map((class_, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="text-center min-w-[100px]">
                        <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                        <p className="text-sm font-medium whitespace-nowrap">{class_.time}</p>
                      </div>
                      <div className="w-px h-16 bg-border" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{class_.code}</Badge>
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
                  ))}
                  {classes.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">No classes scheduled</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentTimetable;
