import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Input } from '../Input';

describe('Input Component', () => {
  it('renders input field', () => {
    render(<Input placeholder="Enter text" onChange={() => {}} />);
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<Input label="Username" onChange={() => {}} />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(<Input label="Username" required onChange={() => {}} />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input error="This field is required" onChange={() => {}} />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(<Input placeholder="Type here" onChange={handleChange} />);
    const input = screen.getByPlaceholderText('Type here');
    
    await user.type(input, 'Hello');
    expect(handleChange).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input disabled onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('applies error border when error is present', () => {
    render(<Input error="Error message" onChange={() => {}} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-red-600');
  });
});
