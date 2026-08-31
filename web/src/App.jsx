import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ToastContainer } from "./components/ui/Toast";
import { AlertModal } from "./components/ui/AlertModal";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

// Pages
import { LandingPage } from "./pages/landing/LandingPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { BrowseProjectsPage } from "./pages/projects/BrowseProjectsPage";
import { ProjectDetailPage } from "./pages/projects/ProjectDetailPage";
import { CreateProjectPage } from "./pages/projects/CreateProjectPage";
import { ProposalBoardPage } from "./pages/proposals/ProposalBoardPage";
import { ApplyProposalPage } from "./pages/proposals/ApplyProposalPage";
import { PortfolioPage } from "./pages/portfolio/PortfolioPage";
import { ProfilePage } from "./pages/profile/ProfilePage";
import { WalletPage } from "./pages/wallet/WalletPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminDisputePage } from "./pages/admin/AdminDisputePage";

export default function App() {
  const { isAuthenticated, user } = useAuthStore();
  const userRole = user?.role?.toUpperCase();

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-canvas text-dark-900">
        <Navbar />

        <main className="flex-1">
          <Routes>
            {/* 1. Public Open Routes (Accessible by everyone) */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/projects" element={<BrowseProjectsPage />} />
            <Route path="/projects/:id" element={<ProjectDetailPage />} />

            {/* 2. Auth Routes */}
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate
                    to={userRole === "ADMIN" ? "/admin" : "/dashboard"}
                    replace
                  />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RegisterPage />
                )
              }
            />

            {/* 3. UMKM Exclusive Routes */}
            <Route element={<ProtectedRoute allowedRoles={["UMKM"]} />}>
              <Route path="/projects/new" element={<CreateProjectPage />} />
            </Route>

            {/* 4. Mahasiswa Exclusive Routes */}
            <Route
              element={<ProtectedRoute allowedRoles={["MHS", "MAHASISWA"]} />}
            >
              <Route
                path="/projects/:id/apply"
                element={<ApplyProposalPage />}
              />
            </Route>

            {/* 5. Shared Authenticated Routes (With Role-Specific Workspaces) */}
            <Route
              element={
                <ProtectedRoute allowedRoles={["MHS", "MAHASISWA", "UMKM"]} />
              }
            >
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/proposals" element={<ProposalBoardPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wallet" element={<WalletPage />} />
            </Route>

            {/* 6. Admin Protected Routes */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/disputes" element={<AdminDisputePage />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <Footer />
        <ToastContainer />
        <AlertModal />
      </div>
    </BrowserRouter>
  );
}
