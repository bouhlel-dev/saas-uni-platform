import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Building, BookOpenCheck, User } from "lucide-react";

const roles = [
  {
    icon: Crown,
    title: "Super Admin",
    badge: "Platform Owner",
    description: "Complete platform control with university approval, subscription management, and global oversight.",
    features: [
      "Approve/reject university applications",
      "Manage subscription plans & billing",
      "Platform-wide security & compliance",
      "Generate global analytics reports"
    ],
    gradient: "from-yellow-500 to-orange-500"
  },
  {
    icon: Building,
    title: "University Admin",
    badge: "Tenant Owner",
    description: "Full control over institutional structure, staff management, and academic operations within their university.",
    features: [
      "Manage faculties & departments",
      "Add teachers and students",
      "Create timetables & exams",
      "Publish results & announcements"
    ],
    gradient: "from-blue-500 to-purple-500"
  },
  {
    icon: BookOpenCheck,
    title: "Teacher",
    badge: "Course Manager",
    description: "Comprehensive course management tools for assignments, exams, grading, and student communication.",
    features: [
      "Upload course materials",
      "Create assignments & exams",
      "Input grades & track attendance",
      "Send course announcements"
    ],
    gradient: "from-green-500 to-teal-500"
  },
  {
    icon: User,
    title: "Student",
    badge: "Learner",
    description: "Access educational resources, submit work, track progress, and communicate with instructors.",
    features: [
      "Enroll in courses",
      "Access materials & timetable",
      "Submit assignments & take exams",
      "View results & GPA"
    ],
    gradient: "from-pink-500 to-red-500"
  }
];

export const Roles = () => {
  return (
    <section className="py-24 px-4 bg-background">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Built for Every
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Educational Role
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Role-based access control with tailored experiences for each user type
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {roles.map((role, index) => (
            <Card 
              key={index}
              className="border-border/50 shadow-elegant hover:shadow-glow transition-all duration-300 bg-gradient-card"
            >
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center shadow-lg`}>
                    <role.icon className="w-7 h-7 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {role.badge}
                  </Badge>
                </div>
                <CardTitle className="text-2xl">{role.title}</CardTitle>
                <CardDescription className="text-base">
                  {role.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {role.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
