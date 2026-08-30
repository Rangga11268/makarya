import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/layout/Navbar";
import { Footer } from "./components/layout/Footer";
import { ToastContainer } from "./components/ui/Toast";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { useAuthStore } from "./store/authStore";

// Pages
import { LoginPage } from "./pages/auth/LoginPage";
import { RegisterPage } from "./pages/auth/RegisterPage";
import { DashboardPage } from "./pages/dashboard/DashboardPage";
import { BrowseProjectsPage } from "./pages/projects/BrowseProjectsPage";
import { ProjectDetailPage } from "./pages/projects/ProjectDetailPage";
import { CreateProjectPage } from "./pages/projects/CreateProjectPage";
import { ProposalBoardPage } from "./pages/proposals/ProposalBoardPage";
import { PortfolioPage } from "./pages/portfolio/PortfolioPage";
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
            {/* Landing / Root Route */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to={userRole === "ADMIN" ? "/admin" : "/dashboard"} replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />

            {/* Public Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Mahasiswa & UMKM Portal Routes */}
            <Route element={<ProtectedRoute allowedRoles={["MHS", "MAHASISWA", "UMKM"]} />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/projects" element={<BrowseProjectsPage />} />
              <Route path="/projects/new" element={<CreateProjectPage />} />
              <Route path="/projects/:id" element={<ProjectDetailPage />} />
              <Route path="/proposals" element={<ProposalBoardPage />} />
              <Route path="/portfolio" element={<PortfolioPage />} />
              <Route path="/wallet" element={<WalletPage />} />
            </Route>

            {/* Admin Protected Routes */}
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
      </div>
    </BrowserRouter>
  );
}