import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import Navbar from './components/layout/Navbar';
import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Events from './pages/Events';
import EventDetails from './pages/EventDetails';
import ParticipantDashboard from './pages/dashboards/ParticipantDashboard';
import OrganizerDashboard from './pages/dashboards/OrganizerDashboard';
import JudgeDashboard from './pages/dashboards/JudgeDashboard';
import CreateEvent from './pages/CreateEvent';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <DataProvider>
              <Router>
              <div className="min-h-screen bg-white dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#0b1b3a] dark:to-[#1a202c]">
                <Navbar />
                <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetails />} />
            <Route 
              path="/dashboard/participant" 
              element={
                <ProtectedRoute>
                  <ParticipantDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/organizer" 
              element={
                <ProtectedRoute>
                  <OrganizerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/judge" 
              element={
                <ProtectedRoute>
                  <JudgeDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            </Routes>
          </div>
          </Router>
        </DataProvider>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;