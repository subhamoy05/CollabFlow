import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { OrganizationProvider } from './context/OrganizationContext';
import { SocketProvider } from './context/SocketContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppRoutes } from './routes/AppRoutes';

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <OrganizationProvider>
            <SocketProvider>
              <NotificationProvider>
                <AppRoutes />
              </NotificationProvider>
            </SocketProvider>
          </OrganizationProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
