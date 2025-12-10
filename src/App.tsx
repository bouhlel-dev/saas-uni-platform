import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useSessionTimeout } from '@/hooks/useSessionTimeout';
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import UniversityAdminDashboard from "./pages/UniversityAdminDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Universities from "./pages/super-admin/Universities";
import Applications from "./pages/super-admin/Applications";
import Billing from "./pages/super-admin/Billing";
import Settings from "./pages/super-admin/Settings";
import Faculties from "./pages/university-admin/Faculties";
import Teachers from "./pages/university-admin/Teachers";
import Students from "./pages/university-admin/Students";
import ClassesPage from "./pages/university-admin/Classes";
import Courses from "./pages/university-admin/Courses";
import Timetable from "./pages/university-admin/Timetable";
import ManageSubscription from "./pages/university-admin/ManageSubscription";
import MyCourses from "./pages/teacher/MyCourses";
import Assignments from "./pages/teacher/Assignments";
import Exams from "./pages/teacher/Exams";
import Attendance from "./pages/teacher/Attendance";
import Grades from "./pages/teacher/Grades";
import TeacherTimetable from "./pages/teacher/TeacherTimetable";
import StudentCourses from "./pages/student/Courses";
import StudentAssignments from "./pages/student/StudentAssignments";
import StudentExams from "./pages/student/StudentExams";
import StudentGrades from "./pages/student/StudentGrades";
import StudentTimetable from "./pages/student/StudentTimetable";
import StudentAttendance from "./pages/student/StudentAttendance";
import StudentLearning from "./pages/student/StudentLearning";
import ResetPassword from "./pages/ResetPassword";
import Messages from "./pages/Messages";
import { ChatProvider } from "./components/contexts/ChatContext";



const queryClient = new QueryClient();

import { ThemeProvider } from "@/components/theme-provider"

import PricingPage from "./pages/PricingPage";
import MaintenancePage from "./pages/MaintenancePage";

const App = () => {
  // Enable session timeout tracking
  useSessionTimeout();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <ChatProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/maintenance" element={<MaintenancePage />} />
                <Route path="/" element={<Index />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Super Admin Routes */}
                <Route path="/dashboard/super-admin" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <SuperAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/super-admin/universities" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <Universities />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/super-admin/applications" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <Applications />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/super-admin/billing" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <Billing />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/super-admin/settings" element={
                  <ProtectedRoute allowedRoles={['superadmin']}>
                    <Settings />
                  </ProtectedRoute>
                } />

                {/* University Admin Routes */}
                <Route path="/dashboard/university-admin" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <UniversityAdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/faculties" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <Faculties />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/teachers" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <Teachers />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/students" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <Students />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/classes" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <ClassesPage />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/courses" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <Courses />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/timetable" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <Timetable />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/university-admin/subscription" element={
                  <ProtectedRoute allowedRoles={['admin', 'universityadmin', 'university_admin']}>
                    <ManageSubscription />
                  </ProtectedRoute>
                } />

                {/* Teacher Routes */}
                <Route path="/dashboard/teacher" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/teacher/courses" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <MyCourses />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/teacher/assignments" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <Assignments />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/teacher/exams" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <Exams />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/teacher/attendance" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <Attendance />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/teacher/grades" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <Grades />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/teacher/timetable" element={
                  <ProtectedRoute allowedRoles={['teacher']}>
                    <TeacherTimetable />
                  </ProtectedRoute>
                } />

                {/* Student Routes */}
                <Route path="/dashboard/student" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/courses" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentCourses />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/assignments" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentAssignments />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/exams" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentExams />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/grades" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentGrades />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/timetable" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentTimetable />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/attendance" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentAttendance />
                  </ProtectedRoute>
                } />
                <Route path="/dashboard/student/learning" element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <StudentLearning />
                  </ProtectedRoute>
                } />

                {/* Messages Route - Available to all authenticated users */}
                <Route path="/dashboard/messages" element={
                  <ProtectedRoute allowedRoles={['superadmin', 'admin', 'universityadmin', 'university_admin', 'teacher', 'student']}>
                    <Messages />
                  </ProtectedRoute>
                } />

                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </ChatProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
