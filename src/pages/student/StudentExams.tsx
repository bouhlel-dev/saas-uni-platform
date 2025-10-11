import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, FileCheck, AlertCircle } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const StudentExams = () => {
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
      <NavLink to="/dashboard/student/exams" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Exams
      </NavLink>
      <NavLink to="/dashboard/student/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
      <NavLink to="/dashboard/student/timetable" className="block px-3 py-2 rounded-md hover:bg-muted">
        Timetable
      </NavLink>
    </nav>
  );

  const exams = [
    { 
      id: 1,
      course: "CS401",
      courseName: "Advanced Machine Learning",
      title: "Midterm Exam",
      type: "Midterm",
      date: "Apr 15, 2024",
      time: "10:00 AM - 12:00 PM",
      duration: "120 min",
      room: "Lab 301",
      status: "Upcoming",
      daysLeft: 28
    },
    { 
      id: 2,
      course: "CS302",
      courseName: "Data Structures",
      title: "Final Exam",
      type: "Final",
      date: "May 20, 2024",
      time: "2:00 PM - 4:30 PM",
      duration: "150 min",
      room: "Hall A",
      status: "Upcoming",
      daysLeft: 63
    },
    { 
      id: 3,
      course: "MATH301",
      courseName: "Linear Algebra",
      title: "Quiz 3",
      type: "Quiz",
      date: "Mar 28, 2024",
      time: "11:00 AM - 11:45 AM",
      duration: "45 min",
      room: "Room 303",
      status: "Upcoming",
      daysLeft: 10
    },
    { 
      id: 4,
      course: "CS201",
      courseName: "Programming Basics",
      title: "Midterm Exam",
      type: "Midterm",
      date: "Mar 10, 2024",
      time: "9:00 AM - 11:00 AM",
      duration: "120 min",
      room: "Room 101",
      status: "Completed",
      score: 95
    },
  ];

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Exams">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">My Exams</h2>
          <p className="text-muted-foreground">View your scheduled and completed exams</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{exam.course}</Badge>
                      <Badge variant={exam.status === "Upcoming" ? "default" : "outline"}>
                        {exam.status}
                      </Badge>
                      <Badge variant="outline">{exam.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
                    <CardDescription>{exam.courseName}</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                    <FileCheck className="w-5 h-5 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{exam.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span>{exam.time} ({exam.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{exam.room}</span>
                  </div>
                </div>

                {exam.status === "Upcoming" && exam.daysLeft <= 14 && (
                  <div className="flex items-center gap-2 p-2 bg-orange-100 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded">
                    <AlertCircle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {exam.daysLeft} days remaining
                    </span>
                  </div>
                )}

                {exam.status === "Completed" && (
                  <div className="p-3 border rounded-lg text-center">
                    <p className="text-sm text-muted-foreground mb-1">Your Score</p>
                    <p className="text-3xl font-bold text-primary">{exam.score}%</p>
                  </div>
                )}

                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => toast({ 
                    title: "Exam Details", 
                    description: `Viewing details for ${exam.title}...` 
                  })}
                >
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentExams;
