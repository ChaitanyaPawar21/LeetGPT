import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { ChatWindow } from './components/chat/ChatWindow'
import { InputBox } from './components/chat/InputBox'
import { ChatProvider } from './context/ChatContext'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SettingsModal } from './components/modals/SettingsModal'
import { ShareModal } from './components/modals/ShareModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SharedChatPage from './pages/SharedChatPage'
import ProtectedRoute from './components/auth/ProtectedRoute'

const AppContent = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex h-screen bg-brand-black text-foreground overflow-hidden font-sans transition-colors">
            {isAuthenticated && (
                <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />
            )}
            <main className="flex-1 flex flex-col min-w-0 min-h-0 relative">
                {isAuthenticated && (
                    <TopBar onOpenSettings={() => setIsSettingsOpen(true)} onOpenShare={() => setIsShareOpen(true)} />
                )}
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/share/:shareableId" element={<SharedChatPage />} />
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <div className="flex-1 flex flex-col min-w-0 min-h-0 h-full">
                                    <ChatWindow />
                                    <InputBox />
                                </div>
                            </ProtectedRoute>
                        } 
                    />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </main>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
            <ShareModal isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} />
        </div>
    );
};

function App() {
  return (
    <Router>
        <AuthProvider>
            <ThemeProvider>
                <ChatProvider>
                    <AppContent />
                </ChatProvider>
            </ThemeProvider>
        </AuthProvider>
    </Router>
  )
}

export default App
