import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import UniversityAdminDashboard from "./pages/UniversityAdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import Universities from "./pages/super-admin/Universities";
import Applications from "./pages/super-admin/Applications";
import Billing from "./pages/super-admin/Billing";
import Settings from "./pages/super-admin/Settings";
import Faculties from "./pages/university-admin/Faculties";
import Teachers from "./pages/university-admin/Teachers";
import Students from "./pages/university-admin/Students";
import Courses from "./pages/university-admin/Courses";
import Timetable from "./pages/university-admin/Timetable";
import MyCourses from "./pages/teacher/MyCourses";
import Assignments from "./pages/teacher/Assignments";
import Exams from "./pages/teacher/Exams";
import Attendance from "./pages/teacher/Attendance";
import Grades from "./pages/teacher/Grades";
import StudentCourses from "./pages/student/Courses";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentExams from "./pages/student/StudentExams";
import StudentGrades from "./pages/student/StudentGrades";
import StudentTimetable from "./pages/student/StudentTimetable";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard/super-admin" element={<SuperAdminDashboard />} />
          <Route path="/dashboard/super-admin/universities" element={<Universities />} />
          <Route path="/dashboard/super-admin/applications" element={<Applications />} />
          <Route path="/dashboard/super-admin/billing" element={<Billing />} />
          <Route path="/dashboard/super-admin/settings" element={<Settings />} />
          <Route path="/dashboard/university-admin" element={<UniversityAdminDashboard />} />
          <Route path="/dashboard/university-admin/faculties" element={<Faculties />} />
          <Route path="/dashboard/university-admin/teachers" element={<Teachers />} />
          <Route path="/dashboard/university-admin/students" element={<Students />} />
          <Route path="/dashboard/university-admin/courses" element={<Courses />} />
          <Route path="/dashboard/university-admin/timetable" element={<Timetable />} />
          <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="/dashboard/teacher/courses" element={<MyCourses />} />
          <Route path="/dashboard/teacher/assignments" element={<Assignments />} />
          <Route path="/dashboard/teacher/exams" element={<Exams />} />
          <Route path="/dashboard/teacher/attendance" element={<Attendance />} />
          <Route path="/dashboard/teacher/grades" element={<Grades />} />
          <Route path="/dashboard/student" element={<StudentDashboard />} />
          <Route path="/dashboard/student/courses" element={<StudentCourses />} />
          <Route path="/dashboard/student/assignments" element={<StudentAssignments />} />
          <Route path="/dashboard/student/exams" element={<StudentExams />} />
          <Route path="/dashboard/student/grades" element={<StudentGrades />} />
          <Route path="/dashboard/student/timetable" element={<StudentTimetable />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
