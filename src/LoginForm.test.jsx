import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginForm from './LoginForm.jsx';

afterEach(cleanup);

function fillIn(labelPattern, value) {
  return userEvent.type(screen.getByLabelText(labelPattern), value);
}

function getSubmitButton() {
  return screen.getByRole('button', { name: /submit|log ?in|sign ?in/i });
}

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
    expect(getSubmitButton()).toBeDefined();
  });

  it('shows an error mentioning email for a malformed email', async () => {
    render(<LoginForm />);
    await fillIn(/email/i, 'not-an-email');
    expect(screen.getByText(/enter a valid email address/i)).toBeDefined();
  });

  it('shows an error mentioning length for a password under 8 characters', async () => {
    render(<LoginForm />);
    await fillIn(/password/i, 'hunter2');
    expect(screen.getByText(/length/i)).toBeDefined();
  });

  it('clears the errors once both fields become valid', async () => {
    render(<LoginForm />);
    await fillIn(/email/i, 'not-an-email');
    await fillIn(/password/i, 'hunter2');
    expect(screen.getAllByRole('alert')).toHaveLength(2);

    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');
    expect(screen.queryByRole('alert')).toBeNull();
  });

  it('disables submit while the form is invalid', async () => {
    render(<LoginForm />);
    expect(getSubmitButton()).toBeDisabled();

    await fillIn(/email/i, 'user@example.com');
    expect(getSubmitButton()).toBeDisabled();

    await fillIn(/password/i, 'hunter2');
    expect(getSubmitButton()).toBeDisabled();
  });

  it('enables submit once both fields pass validation', async () => {
    render(<LoginForm />);
    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');
    expect(getSubmitButton()).toBeEnabled();
  });

  it('reports the entered credentials on submit', async () => {
    const onLogin = vi.fn();
    render(<LoginForm onLogin={onLogin} />);

    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');
    await userEvent.click(getSubmitButton());

    expect(onLogin).toHaveBeenCalledWith({ email: 'user@example.com', password: 'hunter22' });
  });

  it('keeps the inputs controlled by React state', async () => {
    render(<LoginForm />);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(emailInput.value).toBe('');
    expect(passwordInput.value).toBe('');

    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');

    expect(emailInput.value).toBe('user@example.com');
    expect(passwordInput.value).toBe('hunter22');
  });

  it('prevents the default page reload on submit', async () => {
    const { container } = render(<LoginForm />);
    const submitEvents = [];
    // React 18 delegates listeners to the root container, so a listener added
    // here after mount runs after the component's own submit handler.
    container.addEventListener('submit', (event) => submitEvents.push(event.defaultPrevented));

    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');
    await userEvent.click(getSubmitButton());

    expect(submitEvents).toEqual([true]);
  });

  it('shows a success state after a successful submission', async () => {
    render(<LoginForm />);
    expect(screen.queryByRole('status')).toBeNull();

    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');
    await userEvent.click(getSubmitButton());

    expect(screen.getByRole('status')).toBeDefined();
    expect(screen.getByText(/success/i)).toBeDefined();
  });

  it('clears the success state once the user edits a field again', async () => {
    render(<LoginForm />);
    await fillIn(/email/i, 'user@example.com');
    await fillIn(/password/i, 'hunter22');
    await userEvent.click(getSubmitButton());
    expect(screen.getByRole('status')).toBeDefined();

    await fillIn(/password/i, 'x');
    expect(screen.queryByRole('status')).toBeNull();
  });
});