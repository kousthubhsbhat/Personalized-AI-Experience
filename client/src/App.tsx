import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CopilotDrawer } from './components/CopilotDrawer';
import { ToastContainer } from './components/ToastContainer';
import { PathwayDashboard } from './pages/PathwayDashboard';
import { OnboardingPage } from './pages/OnboardingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SkillGapPage } from './pages/SkillGapPage';
import { LoginPage } from './pages/LoginPage';
import { isSessionActive } from './services/api';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoadingPathway } = useApp();

  if (isLoadingPathway) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 rounded-full border-2 border-indigo-500 border-t-cyan-400 animate-spin shadow-glow" />
        <p className="text-xs font-mono text-slate-400">Calibrating adaptive environment...</p>
      </div>
    );
  }

  if (!isAuthenticated && !isSessionActive()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useApp();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to={isSessionActive() ? "/pathway" : "/login"} replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/pathway"
            element={
              <ProtectedRoute>
                <PathwayDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <OnboardingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skill-gap"
            element={
              <ProtectedRoute>
                <SkillGapPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isSessionActive() ? "/pathway" : "/login"} replace />} />
        </Routes>
      </main>

      {isAuthenticated && <CopilotDrawer />}
      <ToastContainer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppContent />
      </Router>
    </AppProvider>
  );
};

export default App;
