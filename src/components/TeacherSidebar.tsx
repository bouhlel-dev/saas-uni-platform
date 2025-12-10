import { NavLink } from "react-router-dom";
import { LayoutDashboard, BookOpen, FileText, ClipboardCheck, Users, GraduationCap, MessageSquare } from "lucide-react";

export const TeacherSidebar = () => {
    return (
        <nav className="space-y-2">
            <NavLink
                to="/dashboard/teacher"
                end
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <LayoutDashboard className="w-5 h-5" />
                Overview
            </NavLink>
            <NavLink
                to="/dashboard/teacher/courses"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <BookOpen className="w-5 h-5" />
                My Courses
            </NavLink>
            <NavLink
                to="/dashboard/teacher/assignments"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <FileText className="w-5 h-5" />
                Assignments
            </NavLink>
            <NavLink
                to="/dashboard/teacher/exams"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <ClipboardCheck className="w-5 h-5" />
                Exams
            </NavLink>
            <NavLink
                to="/dashboard/teacher/attendance"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <Users className="w-5 h-5" />
                Attendance
            </NavLink>
            <NavLink
                to="/dashboard/teacher/grades"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <GraduationCap className="w-5 h-5" />
                Grades
            </NavLink>
            <NavLink
                to="/dashboard/messages"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <MessageSquare className="w-5 h-5" />
                Messages
            </NavLink>
            <NavLink
                to="/dashboard/teacher/timetable"
                className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`
                }
            >
                <ClipboardCheck className="w-5 h-5" />
                Timetable
            </NavLink>
        </nav>
    );
};
