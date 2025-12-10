import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, Calendar, GraduationCap, ClipboardCheck, MessageSquare, UserCheck, Brain } from "lucide-react";

export const StudentSidebar = () => {
    return (
        <nav className="space-y-2">
            <NavLink
                to="/dashboard/student"
                end
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <LayoutDashboard className="w-5 h-5" />
                Overview
            </NavLink>
            <NavLink
                to="/dashboard/student/courses"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <BookOpen className="w-5 h-5" />
                My Courses
            </NavLink>
            <NavLink
                to="/dashboard/student/assignments"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <FileText className="w-5 h-5" />
                Assignments
            </NavLink>
            <NavLink
                to="/dashboard/student/exams"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <ClipboardCheck className="w-5 h-5" />
                Exams
            </NavLink>
            <NavLink
                to="/dashboard/student/grades"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <GraduationCap className="w-5 h-5" />
                Grades
            </NavLink>
            <NavLink
                to="/dashboard/student/timetable"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <Calendar className="w-5 h-5" />
                Timetable
            </NavLink>
            <NavLink
                to="/dashboard/student/attendance"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <UserCheck className="w-5 h-5" />
                Attendance
            </NavLink>
            <NavLink
                to="/dashboard/student/learning"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-600 font-medium border border-green-500/30"
                        : "text-muted-foreground hover:bg-gradient-to-r hover:from-green-500/10 hover:to-emerald-500/10 hover:text-green-600"
                    }`
                }
            >
                <Brain className="w-5 h-5" />
                AI Learning
            </NavLink>
            <NavLink
                to="/dashboard/messages"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                }
            >
                <MessageSquare className="w-5 h-5" />
                Messages
            </NavLink>
        </nav>
    );
};
