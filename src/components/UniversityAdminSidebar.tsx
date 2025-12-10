import { NavLink } from "react-router-dom";
import { LayoutDashboard, Building2, GraduationCap, Users, BookOpen, Calendar, CreditCard, MessageSquare } from "lucide-react";

export const UniversityAdminSidebar = () => {
    return (
        <nav className="space-y-2">
            <NavLink
                to="/dashboard/university-admin"
                end
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <LayoutDashboard className="w-4 h-4" />
                Overview
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/faculties"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <Building2 className="w-4 h-4" />
                Faculties
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/teachers"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <Users className="w-4 h-4" />
                Teachers
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/students"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <GraduationCap className="w-4 h-4" />
                Students
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/classes"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <Users className="w-4 h-4" />
                Classes
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/courses"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <BookOpen className="w-4 h-4" />
                Courses
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/timetable"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <Calendar className="w-4 h-4" />
                Timetable
            </NavLink>
            <NavLink
                to="/dashboard/university-admin/subscription"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <CreditCard className="w-4 h-4" />
                Manage Subscription
            </NavLink>
            <NavLink
                to="/dashboard/messages"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted text-muted-foreground"
                    }`
                }
            >
                <MessageSquare className="w-4 h-4" />
                Messages
            </NavLink>
        </nav>
    );
};
