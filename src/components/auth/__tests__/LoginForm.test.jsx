import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LoginForm } from '../LoginForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as api from '../../../services/api';

// Mock the API
vi.mock('../../../services/api', () => ({
  login: vi.fn(),
}));

// Mock the auth store
vi.mock('../../../stores/authStore', () => ({
  useAuthStore: () => ({
    login: vi.fn(),
  }),
}));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: false },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('LoginForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    render(<LoginForm />, { wrapper });
    
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('shows demo accounts notice', () => {
    render(<LoginForm />, { wrapper });
    expect(screen.getByText(/Demo Accounts Available/i)).toBeInTheDocument();
  });

  it('displays loading state when submitting', async () => {
    api.login.mockImplementation(() => new Promise(() => {})); // Never resolves
    const user = userEvent.setup();
    
    render(<LoginForm />, { wrapper });
    
    await user.type(screen.getByPlaceholderText('Email'), 'test@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(screen.getByText(/logging in/i)).toBeInTheDocument();
    });
  });

  it('disables inputs and button when loading', async () => {
    api.login.mockImplementation(() => new Promise(() => {}));
    const user = userEvent.setup();
    
    render(<LoginForm />, { wrapper });
    
    const emailInput = screen.getByPlaceholderText('Email');
    const passwordInput = screen.getByPlaceholderText('Password');
    const submitButton = screen.getByRole('button', { name: /login/i });
    
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(emailInput).toBeDisabled();
      expect(passwordInput).toBeDisabled();
      expect(submitButton).toBeDisabled();
    });
  });
});
