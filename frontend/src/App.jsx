import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Sidebar } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { ChatWindow } from './components/chat/ChatWindow'
import { InputBox } from './components/chat/InputBox'
import { ChatProvider } from './context/ChatContext'
import { AuthProvider, useAuth } from './context/AuthContext'
import { SettingsModal } from './components/modals/SettingsModal'
import { ShareModal } from './components/modals/ShareModal'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import SharedChatPage from './pages/SharedChatPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AuthCallback from "./pages/AuthCallback";

const AppContent = () => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isShareOpen, setIsShareOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex min-h-screen h-[100dvh] bg-brand-black text-foreground overflow-hidden font-sans transition-colors relative">
            {isAuthenticated && (
                <>
                    {/* Mobile Sidebar Overlay */}
                    {isMobileSidebarOpen && (
                        <div 
                            className="fixed inset-0 bg-black/60 z-30 md:hidden backdrop-blur-sm" 
                            onClick={() => setIsMobileSidebarOpen(false)}
                        />
                    )}
                    <Sidebar 
                        onOpenSettings={() => setIsSettingsOpen(true)} 
                        isOpen={isMobileSidebarOpen}
                    />
                </>
            )}
            <main className="flex-1 flex flex-col min-w-0 min-h-0 relative w-full">
                {isAuthenticated && (
                    <TopBar 
                        onOpenSettings={() => setIsSettingsOpen(true)} 
                        onOpenShare={() => setIsShareOpen(true)}
                        onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                    />
                )}
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/share/:shareableId" element={<SharedChatPage />} />
                    <Route path="/auth/callback" element={<AuthCallback />} />
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
            <ChatProvider>
                <AppContent />
            </ChatProvider>
        </AuthProvider>
    </Router>
  )
}

export default App
