import { Building2, UserCog, Users2, GraduationCap, Calendar, FileText, BarChart3, Bell } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Building2,
    title: "Super Admin Control",
    description: "Manage platform-wide settings, approve universities, handle subscriptions and generate global reports.",
    color: "text-primary"
  },
  {
    icon: UserCog,
    title: "University Management",
    description: "Complete control over faculties, departments, courses, and institutional hierarchy for each tenant.",
    color: "text-secondary"
  },
  {
    icon: Users2,
    title: "Teacher Dashboard",
    description: "Create assignments, manage exams, track attendance, input grades and communicate with students.",
    color: "text-primary"
  },
  {
    icon: GraduationCap,
    title: "Student Portal",
    description: "Enroll in courses, access materials, submit assignments, view results and track academic progress.",
    color: "text-secondary"
  },
  {
    icon: Calendar,
    title: "Smart Scheduling",
    description: "Automated timetable generation, room allocation, and conflict detection for optimal resource utilization.",
    color: "text-primary"
  },
  {
    icon: FileText,
    title: "Exam Management",
    description: "Create, schedule, and grade exams with support for multiple question types and automatic grading.",
    color: "text-secondary"
  },
  {
    icon: BarChart3,
    title: "Analytics & Reports",
    description: "Comprehensive dashboards with real-time insights on student performance and institutional metrics.",
    color: "text-primary"
  },
  {
    icon: Bell,
    title: "Notifications",
    description: "Real-time alerts for assignments, exams, announcements and important updates across the platform.",
    color: "text-secondary"
  }
];

export const Features = () => {
  return (
    <section className="py-24 px-4 bg-gradient-card">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything You Need to
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Manage Your Institution
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive features designed for modern educational institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="border-border/50 shadow-card hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 bg-card/80 backdrop-blur-sm"
            >
              <CardHeader>
                <div className={`w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
