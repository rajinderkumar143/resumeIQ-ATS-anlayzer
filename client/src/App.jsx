import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout.jsx';
import { LandingPage } from './pages/LandingPage.jsx';
import { LoginPage } from './pages/LoginPage.jsx';
import { RegisterPage } from './pages/RegisterPage.jsx';
import { AnalyzerPage } from './pages/AnalyzerPage.jsx';
import { AiStudioPage } from './pages/AiStudioPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { HistoryPage } from './pages/HistoryPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { NotFoundPage } from './pages/NotFoundPage.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { ResumeProvider } from './context/ResumeContext.jsx';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ResumeProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
              <Route path="analyzer" element={<AnalyzerPage />} />
              <Route path="ai-studio" element={<AiStudioPage />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="history" element={<HistoryPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </ResumeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
