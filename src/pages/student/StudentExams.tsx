import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/formatUtils";
import { Calendar, Clock, MapPin, FileCheck, AlertCircle, GraduationCap } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { StudentSidebar } from "@/components/StudentSidebar";

const StudentExams = () => {
  const sidebarContent = <StudentSidebar />;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await api.get("/student/exams");
        setExams(data);
      } catch (error) {
        console.error("Error fetching exams:", error);
        toast({
          title: "Error",
          description: "Failed to load exams",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const getStatusColor = (date: string) => {
    if (!date) return "bg-gray-100 text-gray-800";
    const examDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return "bg-gray-100 text-gray-800";
    if (diffDays <= 7) return "bg-red-100 text-red-800";
    if (diffDays <= 14) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  const getStatusText = (date: string) => {
    if (!date) return "TBA";
    const examDate = new Date(date);
    const today = new Date();
    const diffDays = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

    if (diffDays < 0) return "Completed";
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Tomorrow";
    if (diffDays <= 7) return `In ${diffDays} days`;
    return formatDate(date);
  };

  if (loading) {
    return (
      <DashboardLayout sidebar={sidebarContent} title="My Exams">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading exams...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout sidebar={sidebarContent} title="My Exams">
      <div className="space-y-6">
        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Total Exams",
              value: exams.length,
              icon: FileCheck,
              color: "text-blue-600",
              bgColor: "bg-blue-100 dark:bg-blue-900/20"
            },
            {
              title: "Upcoming",
              value: exams.filter((exam: any) => new Date(exam.date) > new Date()).length,
              icon: Calendar,
              color: "text-amber-600",
              bgColor: "bg-amber-100 dark:bg-amber-900/20"
            },
            {
              title: "Completed",
              value: exams.filter((exam: any) => new Date(exam.date) < new Date()).length,
              icon: AlertCircle,
              color: "text-purple-600",
              bgColor: "bg-purple-100 dark:bg-purple-900/20"
            }
          ].map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Exams List */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Schedule</CardTitle>
            <CardDescription>View all your upcoming and past exams</CardDescription>
          </CardHeader>
          <CardContent>
            {exams.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No exams scheduled</p>
            ) : (
              <div className="space-y-4">
                {exams.map((exam: any) => (
                  <div
                    key={exam.id}
                    className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline">{exam.Course?.code || `C${exam.course_id}`}</Badge>
                          {exam.Class && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <GraduationCap className="h-3 w-3" />
                              {exam.Class.name}
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-semibold text-lg">{exam.title || exam.Course?.title || "Upcoming Exam"}</h4>
                        {exam.description && exam.description.trim() !== '' && (
                          <p className="text-sm text-muted-foreground">{exam.description}</p>
                        )}
                      </div>
                      <Badge className={getStatusColor(exam.date)}>{getStatusText(exam.date)}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {exam.date ? formatDate(exam.date) : "TBA"}
                      </div>
                      {exam.duration && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {exam.duration} minutes
                        </div>
                      )}
                      {exam.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {exam.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default StudentExams;
