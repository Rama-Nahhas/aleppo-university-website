import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import DashboardLayout from "@/components/DashboardLayout";
import PublicLayout from "@/components/public/PublicLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import UsersPage from "@/pages/UsersPage";
import CollegesPage from "@/pages/CollegesPage";
import DepartmentsPage from "@/pages/DepartmentsPage";
import CoursesPage from "@/pages/CoursesPage";
import LaboratoriesPage from "@/pages/LaboratoriesPage";
import WarehousesPage from "@/pages/WarehousesPage";
import OrdersPage from "@/pages/OrdersPage";
import HospitalPage from "@/pages/HospitalPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import HomePage from "@/pages/public/HomePage";
import CollegePage from "@/pages/public/CollegePage";
import CollegesListPage from "@/pages/public/CollegesListPage";
import HospitalsPage from "@/pages/public/HospitalsPage";
import EventsPage from "@/pages/public/EventsPage";
import ContactPage from "@/pages/public/ContactPage";
import MyCoursesPage from "@/pages/dashboard/MyCoursesPage";
import MyGradesPage from "@/pages/dashboard/MyGradesPage";
import MySchedulePage from "@/pages/dashboard/MySchedulePage";


import GradesManagementPage from "@/pages/dashboard/GradesManagementPage";
import EquipmentPage from "@/pages/dashboard/EquipmentPage";
import MaintenancePage from "@/pages/dashboard/MaintenancePage";
import ManageStudentsPage from "@/pages/dashboard/ManageStudentsPage";
import AppointmentsPage from "@/pages/dashboard/AppointmentsPage";
import PatientsPage from "@/pages/dashboard/PatientsPage";
import NotFound from "@/pages/NotFound";
import Directorate from "@/pages/Directorate";
import CentersPage from "@/pages/public/CentersPage";

const queryClient = new QueryClient();

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <DashboardLayout>{children}</DashboardLayout>;
};

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};

const AppRoutes = () => (
  <Routes>
    {/* Public website */}
    <Route element={<PublicLayout />}>
      <Route path="/" element={<HomePage />} />
      <Route path="/college/:slug" element={<CollegePage />} />
      <Route path="/colleges-list" element={<CollegesListPage />} />
      <Route path="/hospitals" element={<HospitalsPage />} />
      <Route path="/Directorate" element={<Directorate />} />
      <Route path="/CentersPage" element={<CentersPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/contact" element={<ContactPage />} />
    </Route>

    {/* Auth */}
    <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />

    {/* Dashboard */}
    <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
    <Route path="/dashboard/users" element={<ProtectedRoute><UsersPage /></ProtectedRoute>} />
    <Route path="/dashboard/colleges" element={<ProtectedRoute><CollegesPage /></ProtectedRoute>} />
    <Route path="/dashboard/departments" element={<ProtectedRoute><DepartmentsPage /></ProtectedRoute>} />
    <Route path="/dashboard/courses" element={<ProtectedRoute><CoursesPage /></ProtectedRoute>} />
    <Route path="/dashboard/laboratories" element={<ProtectedRoute><LaboratoriesPage /></ProtectedRoute>} />
    <Route path="/dashboard/warehouses" element={<ProtectedRoute><WarehousesPage /></ProtectedRoute>} />
    <Route path="/dashboard/orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
    <Route path="/dashboard/hospital" element={<ProtectedRoute><HospitalPage /></ProtectedRoute>} />
    <Route path="/dashboard/announcements" element={<ProtectedRoute><AnnouncementsPage /></ProtectedRoute>} />
    {/* Student */}
    <Route path="/dashboard/my-courses" element={<ProtectedRoute><MyCoursesPage /></ProtectedRoute>} />
    <Route path="/dashboard/my-grades" element={<ProtectedRoute><MyGradesPage /></ProtectedRoute>} />
    <Route path="/dashboard/my-schedule" element={<ProtectedRoute><MySchedulePage /></ProtectedRoute>} />
   
    {/* Doctor */}
   
    <Route path="/dashboard/grades" element={<ProtectedRoute><GradesManagementPage /></ProtectedRoute>} />
    {/* Lab Tech */}
    <Route path="/dashboard/equipment" element={<ProtectedRoute><EquipmentPage /></ProtectedRoute>} />
    <Route path="/dashboard/maintenance" element={<ProtectedRoute><MaintenancePage /></ProtectedRoute>} />
    {/* Staff */}
    <Route path="/dashboard/students" element={<ProtectedRoute><ManageStudentsPage /></ProtectedRoute>} />
    {/* Hospital */}
    <Route path="/dashboard/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
    <Route path="/dashboard/patients" element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />

    <Route path="*" element={<NotFound />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <LanguageProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </AuthProvider>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
