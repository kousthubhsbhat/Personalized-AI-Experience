import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { CopilotDrawer } from './components/CopilotDrawer';
import { ToastContainer } from './components/ToastContainer';
import { PathwayDashboard } from './pages/PathwayDashboard';
import { OnboardingPage } from './pages/OnboardingPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SkillGapPage } from './pages/SkillGapPage';

export const App: React.FC = () => {
  return (
    <AppProvider>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white relative">
          <Navbar />
          
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Navigate to="/pathway" replace />} />
              <Route path="/pathway" element={<PathwayDashboard />} />
              <Route path="/onboarding" element={<OnboardingPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/skill-gap" element={<SkillGapPage />} />
              <Route path="*" element={<Navigate to="/pathway" replace />} />
            </Routes>
          </main>

          <CopilotDrawer />
          <ToastContainer />
        </div>
      </Router>
    </AppProvider>
  );
};

export default App;
