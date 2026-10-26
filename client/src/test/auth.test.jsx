import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { LandingPage } from '../pages/LandingPage';

function renderWithProviders(ui) {
  return render(
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          {ui}
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

describe('Frontend Auth & Landing Flow Tests', () => {
  it('renders landing page with headline and call to action', () => {
    renderWithProviders(<LandingPage />);
    expect(screen.getByText(/Great Teams Build Better Things/i)).toBeInTheDocument();
    expect(screen.getByText(/Get Started Free/i)).toBeInTheDocument();
    expect(screen.getByText(/Real-Time Kanban Boards/i)).toBeInTheDocument();
  });

  it('renders login page with inputs and demo buttons', () => {
    renderWithProviders(<LoginPage />);
    expect(screen.getByText(/Sign in to your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Sign In$/i })).toBeInTheDocument();
    expect(screen.getByText(/Quick Demo Logins/i)).toBeInTheDocument();
  });

  it('renders registration form with full name and password requirements', () => {
    renderWithProviders(<RegisterPage />);
    expect(screen.getByText(/Create your account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Work email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm password/i)).toBeInTheDocument();
  });
});
