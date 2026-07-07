import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { ToastProvider } from '@/context/ToastContext'
import { ProtectedRoute, GuestRoute } from '@/routes/ProtectedRoute'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { AuthLayout } from '@/layouts/AuthLayout'

import DashboardPage from '@/pages/dashboard/DashboardPage'
import StudentsPage from '@/pages/students/StudentsPage'
import FacultyPage from '@/pages/faculty/FacultyPage'
import CoursesPage from '@/pages/courses/CoursesPage'
import AttendancePage from '@/pages/attendance/AttendancePage'
import ResultsPage from '@/pages/results/ResultsPage'
import TimetablePage from '@/pages/timetable/TimetablePage'
import AnnouncementsPage from '@/pages/announcements/AnnouncementsPage'
import LibraryPage from '@/pages/library/LibraryPage'
import AIAssistantPage from '@/pages/ai/AIAssistantPage'
import ProfilePage from '@/pages/profile/ProfilePage'
import SettingsPage from '@/pages/settings/SettingsPage'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage'

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route element={<GuestRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              </Route>
            </Route>

            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route index element={<DashboardPage />} />
                <Route path="students" element={<StudentsPage />} />
                <Route path="faculty" element={<FacultyPage />} />
                <Route path="courses" element={<CoursesPage />} />
                <Route path="attendance" element={<AttendancePage />} />
                <Route path="results" element={<ResultsPage />} />
                <Route path="timetable" element={<TimetablePage />} />
                <Route path="announcements" element={<AnnouncementsPage />} />
                <Route path="library" element={<LibraryPage />} />
                <Route path="ai-assistant" element={<AIAssistantPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
