import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import ProtectedRoute from './components/ProtectedRoute';

// Page Components
import HomePage from './pages/HomePage';
import './App.css';
import Layout from './components/Layout';
import GalleryPage from './pages/GalleryPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
// Temporary placeholder components (we'll create these next)
const LoginPage = () => <div style={{padding: '2rem'}}><h1>Login Page</h1><p>Coming soon...</p></div>;
const RegisterPage = () => <div style={{padding: '2rem'}}><h1>Register Page</h1><p>Coming soon...</p></div>;
const GeneratePage = () => <div style={{padding: '2rem'}}><h1>🎨 Generate Images</h1><p>Coming soon...</p></div>;
const UploadPage = () => <div style={{padding: '2rem'}}><h1>📤 Upload & Enhance</h1><p>Coming soon...</p></div>;
const RecognizePage = () => <div style={{padding: '2rem'}}><h1>🔍 Image Recognition</h1><p>Coming soon...</p></div>;
const ExtractPage = () => <div style={{padding: '2rem'}}><h1>📝 Text Extraction</h1><p>Coming soon...</p></div>;



const NotFoundPage = () => <div style={{padding: '2rem'}}><h1>404 - Page Not Found</h1></div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <ChatbotProvider>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Protected Routes */}
              <Route path="/app" element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }>
                <Route index element={<GalleryPage />} />
                <Route path="generate" element={<GeneratePage />} />
                <Route path="upload" element={<UploadPage />} />
                <Route path="recognize" element={<RecognizePage />} />
                <Route path="extract" element={<ExtractPage />} />
                <Route path="gallery" element={<GalleryPage />} />
                {/* ✅ ADD THESE TWO MISSING ROUTES: */}
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </ChatbotProvider>
      </Router>
    </AuthProvider>
  );
}

export default App;
