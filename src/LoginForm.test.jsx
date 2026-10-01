import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm.jsx';

afterEach(cleanup);

describe('LoginForm', () => {
  it('renders without crashing', () => {
    expect(() => render(<LoginForm />)).not.toThrow();
  });

  it('renders a labeled email input', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeDefined();
  });

  it('renders a labeled password input of type password', () => {
    render(<LoginForm />);
    const password = screen.getByLabelText(/password/i);
    expect(password.getAttribute('type')).toBe('password');
  });

  it('renders a submit button', () => {
    render(<LoginForm />);
    expect(screen.getByRole('button', { name: /submit|log ?in|sign ?in/i })).toBeDefined();
  });

  it('reports the entered credentials on submit', async () => {
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText(/email/i), 'user@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'hunter2');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({ email: 'user@example.com', password: 'hunter2' });
  });
});