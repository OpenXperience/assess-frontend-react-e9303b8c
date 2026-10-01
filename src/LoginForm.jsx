import { useState } from 'react';

export default function LoginForm({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    if (onSubmit) {
      onSubmit({ email, password });
    }
  }

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2 className="login-form__title">Log in</h2>

      <div className="login-form__field">
        <label htmlFor="login-email">Email address</label>
        <input
          id="login-email"
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </div>

      <div className="login-form__field">
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      <button type="submit">Submit</button>

      {submitted && (
        <p className="login-form__status" role="status">
          Sign in submitted for {email || 'no email'}.
        </p>
      )}
    </form>
  );
}