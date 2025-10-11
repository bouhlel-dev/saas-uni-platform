import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Users, FileCheck } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { CreateExamDialog } from "@/components/forms/CreateExamDialog";
import { ViewDetailsDialog } from "@/components/forms/ViewDetailsDialog";
import { useState } from "react";

const Exams = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const sidebarContent = (
    <nav className="space-y-2">
      <NavLink to="/dashboard/teacher" className="block px-3 py-2 rounded-md hover:bg-muted">
        Overview
      </NavLink>
      <NavLink to="/dashboard/teacher/courses" className="block px-3 py-2 rounded-md hover:bg-muted">
        My Courses
      </NavLink>
      <NavLink to="/dashboard/teacher/assignments" className="block px-3 py-2 rounded-md hover:bg-muted">
        Assignments
      </NavLink>
      <NavLink to="/dashboard/teacher/exams" className="block px-3 py-2 rounded-md bg-primary/10 text-primary font-medium">
        Exams
      </NavLink>
      <NavLink to="/dashboard/teacher/attendance" className="block px-3 py-2 rounded-md hover:bg-muted">
        Attendance
      </NavLink>
      <NavLink to="/dashboard/teacher/grades" className="block px-3 py-2 rounded-md hover:bg-muted">
        Grades
      </NavLink>
    </nav>
  );

  const exams = [
    { 
      id: 1,
      course: "CS401",
      title: "Midterm Exam",
      type: "Midterm",
      date: "Apr 15, 2024",
      time: "10:00 AM - 12:00 PM",
      duration: "120 min",
      room: "Lab 301",
      students: 45,
      status: "Scheduled"
    },
    { 
      id: 2,
      course: "CS302",
      title: "Final Exam",
      type: "Final",
      date: "May 20, 2024",
      time: "2:00 PM - 4:30 PM",
      duration: "150 min",
      room: "Hall A",
      students: 67,
      status: "Scheduled"
    },
    { 
      id: 3,
      course: "CS201",
      title: "Quiz 3",
      type: "Quiz",
      date: "Mar 18, 2024",
      time: "9:00 AM - 9:30 AM",
      duration: "30 min",
      room: "Room 101",
      students: 89,
      status: "Completed"
    },
    { 
      id: 4,
      course: "CS403",
      title: "Practical Exam",
      type: "Practical",
      date: "Apr 25, 2024",
      time: "4:00 PM - 6:00 PM",
      duration: "120 min",
      room: "Lab 401",
      students: 33,
      status: "Scheduled"
    },
  ];

  const handleCreateExam = () => {
    setShowCreateDialog(true);
  };

  return (
    <>
      <CreateExamDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />
      <DashboardLayout sidebar={sidebarContent} title="Exams">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Exams</h2>
            <p className="text-muted-foreground">Schedule and manage course examinations</p>
          </div>
          <Button onClick={handleCreateExam}>
            <Plus className="w-4 h-4 mr-2" />
            Schedule Exam
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {exams.map((exam) => (
            <Card key={exam.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{exam.course}</Badge>
                      <Badge variant={exam.status === "Scheduled" ? "default" : "outline"}>
                        {exam.status}
                      </Badge>
                      <Badge variant="outline">{exam.type}</Badge>
                    </div>
                    <CardTitle className="text-lg">{exam.title}</CardTitle>
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
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span>{exam.students} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Room:</span>
                    <span className="font-medium">{exam.room}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                  {exam.status === "Completed" ? (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedExam(exam);
                        setShowDetails(true);
                      }}
                    >
                      View Results
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => {
                        setSelectedExam(exam);
                        setShowDetails(true);
                      }}
                    >
                      View Details
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {selectedExam && (
          <ViewDetailsDialog
            open={showDetails}
            onOpenChange={setShowDetails}
            title={selectedExam.title}
            description={`${selectedExam.course} - ${selectedExam.type}`}
            details={[
              { label: "Date", value: selectedExam.date },
              { label: "Time", value: selectedExam.time },
              { label: "Duration", value: selectedExam.duration },
              { label: "Room", value: selectedExam.room },
              { label: "Students", value: selectedExam.students },
              { label: "Status", value: selectedExam.status, badge: true },
            ]}
          />
        )}
      </div>
    </DashboardLayout>
    </>
  );
};

export default Exams;
